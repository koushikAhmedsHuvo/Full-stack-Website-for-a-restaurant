import pymysql
from flask import Flask, request, jsonify, session, redirect, url_for, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
from flask_cors import CORS
from flask_mail import Mail, Message
import os
import jwt
import random


app = Flask(__name__)

# CORS configuration
# CORS configuration
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})


app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use Gmail's SMTP server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'koushik101517@gmail.com'  # Your Gmail address
app.config['MAIL_PASSWORD'] = 'nkwnfznfyeivakjv'  # Your Gmail App Password
app.config['MAIL_DEFAULT_SENDER'] = 'koushik101517@gmail.com'  # Set the sender's email
mail = Mail(app)


app.config['SECRET_KEY'] = 'super_secure_random_secret_key'  # Use a strong key in production
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # SameSite cookie policy
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to cookies

# Get database connection
def get_db_connection():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            port=3308,
            password='12345',
            db='restaurant',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.MySQLError as e:
        print(f"Error connecting to database: {e}")
        return None

# Create tables if they don't exist
def create_tables():
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            create_users_table_query = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                telephone VARCHAR(20),
                city VARCHAR(100),
                address TEXT
            );
            """
            cursor.execute(create_users_table_query)

            create_products_table_query = """
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                image_link VARCHAR(255),
                description TEXT,
                price DECIMAL(10, 2) NOT NULL
            );
            """
            cursor.execute(create_products_table_query)

            create_contact_table_query = """
            CREATE TABLE IF NOT EXISTS contact_table (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                description TEXT
            );
            """
            cursor.execute(create_contact_table_query)

            # Reservations table (with a foreign key to users)
            create_reservations_table_query = """
            CREATE TABLE IF NOT EXISTS reservations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                reservation_date DATE NOT NULL,
                reservation_time TIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            """
            cursor.execute(create_reservations_table_query)

            create_reserved_tables_query = """
            CREATE TABLE IF NOT EXISTS reserved_tables (
              id INT AUTO_INCREMENT PRIMARY KEY,
              reservation_id INT,
              table_id INT,
              FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
            );
            """
            cursor.execute(create_reserved_tables_query)


            create_order_tables_query = """
            CREATE TABLE IF NOT EXISTS orders (
               id INT AUTO_INCREMENT PRIMARY KEY,
               user_id INT,  
               item_id INT NOT NULL,
               quantity INT NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (item_id) REFERENCES products(id) ON DELETE CASCADE
            );
            """
            cursor.execute(create_order_tables_query)

            create_pickup_tables_query = """
            CREATE TABLE IF NOT EXISTS pickups (
               id INT AUTO_INCREMENT PRIMARY KEY,
               user_id INT,  
               item_id INT NOT NULL,
               pickup_date DATE NOT NULL,
               pickup_time TIME NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
               FOREIGN KEY (item_id) REFERENCES products(id) ON DELETE CASCADE
            );
            """
            cursor.execute(create_pickup_tables_query)


            create_rating_tables_query = """
         CREATE TABLE IF NOT EXISTS rating (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,  
            item_id INT NOT NULL,
            rating INT CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES products(id) ON DELETE CASCADE
    );
    """
            cursor.execute(create_rating_tables_query)
   


            connection.commit()
            cursor.close()
            print("Users, Products, and Contact tables created or already exist.")
        except pymysql.MySQLError as e:
            print(f"Error creating tables: {e}")
        finally:
            connection.close()

# Call the function to create the tables
create_tables()

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    telephone = data.get('telephone')
    city = data.get('city')
    address = data.get('address')
    email = data.get('email')
    password = data.get('password')

    if not all([username, firstname, lastname, telephone, city, address, email, password]):
        return jsonify({'error': 'All fields are required.'}), 400

    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()

            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({'error': 'Email is already registered.'}), 400

            hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

            cursor.execute(
                """
                INSERT INTO users 
                (username, first_name, last_name, telephone, city, address, email, password) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (username, firstname, lastname, telephone, city, address, email, hashed_password)
            )

            connection.commit()

            # Send confirmation email
            msg = Message('Welcome to Our Service!', recipients=[email])
            msg.body = f"Hi {firstname},\n\nThank you for signing up! Your account has been created successfully.\n\nBest regards,\nThe Reservq Team"
            mail.send(msg)

            cursor.close()
            return jsonify({'message': 'User registered successfully.'}), 201

        except pymysql.MySQLError as e:
            connection.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            connection.close()
    else:
        return jsonify({'error': 'Database connection failed.'}), 500

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            if user and check_password_hash(user['password'], password):
                session['user_id'] = user['id']
                session['user_email'] = user['email']
                return jsonify({'message': 'Login successful!'}), 200
            else:
                return jsonify({'error': 'Invalid email or password.'}), 401
        except pymysql.MySQLError as e:
            return jsonify({'error': str(e)}), 500
        finally:
            connection.close()
    else:
        return jsonify({'error': 'Database connection failed.'}), 500

# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    response = make_response(jsonify({'message': 'Logged out successfully.'}), 200)
    response.delete_cookie('session')
    return response

@app.route('/api/user', methods=['GET'])
def get_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        user = cursor.fetchone()
    finally:
        connection.close()

    if user:
        return jsonify(user), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({'isLoggedIn': True,"userId": session['user_id'], 'email': session.get('user_email')}), 200
    return jsonify({'isLoggedIn': False}), 200

# update user information
@app.route('/api/user/update', methods=['PUT'])
def update_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not authenticated'}), 401

    data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()

    update_query = '''
        UPDATE users
        SET first_name = %s, last_name = %s, email = %s, telephone = %s, city = %s, address = %s
        WHERE id = %s
    '''
    cursor.execute(update_query, (
        data.get('firstName'),
        data.get('lastName'),
        data.get('email'),
        data.get('telephone'),
        data.get('city'),
        data.get('address'),
        user_id
    ))
    connection.commit()
    connection.close()
    return jsonify({'message': 'User information updated successfully'})




# Fetch products route
@app.route('/products', methods=['GET'])
def get_products():
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM products LIMIT 6")
            products = cursor.fetchall()
            cursor.close()
            return jsonify(products), 200
        except pymysql.MySQLError as e:
            return jsonify({'error': str(e)}), 500
        finally:
            connection.close()
    else:
        return jsonify({'error': 'Database connection failed.'}), 500

# Fetch products in a range route
@app.route('/products-range', methods=['GET'])
def get_products_range():
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM products WHERE id BETWEEN 7 AND 12")
            products = cursor.fetchall()
            cursor.close()
            return jsonify(products), 200
        except pymysql.MySQLError as e:
            return jsonify({'error': str(e)}), 500
        finally:
            connection.close()
    else:
        return jsonify({'error': 'Database connection failed.'}), 500

# Fetch all products route
@app.route('/menu', methods=['GET'])
def get_all_products():
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM products")
            products = cursor.fetchall()
            cursor.close()
            return jsonify(products), 200
        except pymysql.MySQLError as e:
            return jsonify({'error': str(e)}), 500
        finally:
            connection.close()
    else:
        return jsonify({'error': 'Database connection failed.'}), 500

# Handle contact form route
@app.route('/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()

        required_fields = ['firstName', 'lastName', 'email', 'phone', 'description']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO contact_table (first_name, last_name, email, phone, description)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['firstName'],
                data['lastName'],
                data['email'],
                data['phone'],
                data['description']
            ))
            connection.commit()

        return jsonify({"message": "Contact added successfully."}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
@app.route('/reservations', methods=['POST'])
def create_reservation():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not authenticated'}), 401

    data = request.json
    reservation_date = data.get('reservation_date')
    reservation_time = data.get('reservation_time')
    tables_reserved = data.get('tables_reserved')

    # Validate incoming data
    if not reservation_date or not reservation_time or not tables_reserved:
        return jsonify({'error': 'All fields are required.'}), 400
    if not isinstance(tables_reserved, list) or not tables_reserved:
        return jsonify({'error': 'Invalid tables_reserved format or no tables provided.'}), 400

    try:
        # Parse date and time into a valid datetime object
        reservation_datetime = datetime.strptime(f"{reservation_date} {reservation_time}", "%Y-%m-%d %H:%M:%S")
        
        # Convert table IDs to integers
        tables_reserved = [int(table) for table in tables_reserved]

        # Get database connection
        connection = get_db_connection()
        cursor = connection.cursor()

        # Prepare query for checking existing reservations
        format_strings = ','.join(['%s'] * len(tables_reserved))
        cursor.execute(f"""
            SELECT table_id FROM reserved_tables 
            JOIN reservations ON reserved_tables.reservation_id = reservations.id
            WHERE reservation_date = %s AND reservation_time = %s AND table_id IN ({format_strings})
        """, [reservation_date, reservation_time] + tables_reserved)

        existing_reservations = cursor.fetchall()
        reserved_tables = {row['table_id'] for row in existing_reservations}

        # Check if any of the selected tables are already reserved
        if reserved_tables:
            return jsonify({
                'error': f'Some of the selected tables are already reserved: {list(reserved_tables)}'
            }), 409

        # Insert the reservation into reservations table
        cursor.execute("""
            INSERT INTO reservations (user_id, reservation_date, reservation_time, created_at)
            VALUES (%s, %s, %s, NOW())
        """, (user_id, reservation_date, reservation_time))
        reservation_id = cursor.lastrowid

        # Insert the reserved tables into reserved_tables table
        for table_id in tables_reserved:
            cursor.execute("""
                INSERT INTO reserved_tables (reservation_id, table_id)
                VALUES (%s, %s)
            """, (reservation_id, table_id))

        connection.commit()
        return jsonify({'message': 'Reservation created successfully!'}), 201

    except pymysql.MySQLError as e:
        connection.rollback()  # Roll back any changes if an error occurs
        print(f"Database error: {e}")
        return jsonify({'error': 'An error occurred while processing your request.'}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred.'}), 500

    finally:
        # Ensure the connection is closed
        if cursor:
            cursor.close()
        if connection:
            connection.close()

            

@app.route('/pickup', methods=['POST'])
def store_pickup():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not authenticated'}), 401

    data = request.json
    pickup_date = data.get('pickup_date')
    pickup_time = data.get('pickup_time')
    item_id = data.get('item_id')

    # Validate incoming data
    if not pickup_date or not pickup_time or not item_id:
        return jsonify({'error': 'All fields are required.'}), 400

    try:
        # Optional: parse date and time to ensure they are valid
        # Example: datetime.strptime(f"{pickup_date} {pickup_time}", "%Y-%m-%d %H:%M:%S")

        # Get database connection
        connection = get_db_connection()
        cursor = connection.cursor()

        # Insert the pickup information into the database
        cursor.execute("""
            INSERT INTO pickups (user_id, item_id, pickup_date, pickup_time)
            VALUES (%s, %s, %s, %s)
        """, (user_id, item_id, pickup_date, pickup_time))

        connection.commit()
        return jsonify({"message": "Pickup information stored successfully!"}), 201

    except pymysql.MySQLError as e:
        connection.rollback()  # Roll back any changes if an error occurs
        print(f"Database error: {e}")
        return jsonify({'error': 'An error occurred while processing your request.'}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred.'}), 500

    finally:
        # Ensure the connection is closed
        if cursor:
            cursor.close()
        if connection:
            connection.close()



@app.route('/order', methods=['POST'])
def create_order():
    # Retrieve the user_id from the session
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not authenticated'}), 401

    # Get the JSON data from the request
    data = request.json
    if not data or 'cart' not in data:
        return jsonify({'error': 'No order data provided'}), 400

    try:
        # Connect to the database
        connection = get_db_connection()
        cursor = connection.cursor()

        # Iterate through the cart items and insert each as an order
        for item in data['cart']:
            insert_order_query = '''
                INSERT INTO orders (user_id, item_id, quantity)
                VALUES (%s, %s, %s)
            '''
            cursor.execute(insert_order_query, (
                user_id,
                item['item_id'],  # Product ID
                item.get('quantity', 1)  # Default to 1 if quantity is not provided
            ))

        # Commit the transaction to save the order
        connection.commit()

        return jsonify({'message': 'Order created successfully'}), 201

    except Exception as e:
        # Rollback in case of error
        connection.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        # Ensure the connection is always closed
        connection.close()



@app.route('/order-history', methods=['GET'])
def get_order_history():
    user_id = session.get('user_id')  # Retrieve user_id from session
    if user_id is None:
        return jsonify({"error": "User not logged in"}), 401  # Unauthorized access

    connection = get_db_connection()
    if connection:
        try:
            with connection.cursor() as cursor:
                # Query to fetch order details with associated product information
                query = """
                SELECT o.id AS order_id, o.quantity, o.created_at, 
                       p.title, p.price,p.image_link
                FROM orders o
                JOIN products p ON o.item_id = p.id
                WHERE o.user_id = %s
                ORDER BY o.created_at DESC;
                """
                cursor.execute(query, (user_id,))
                orders = cursor.fetchall()
                return jsonify(orders), 200
        except Exception as e:
            print(f"Error fetching order history: {e}")
            return jsonify({"error": "Internal server error"}), 500
        finally:
            connection.close()
    else:
        return jsonify({"error": "Database connection error"}), 500



@app.route('/submit-rating', methods=['POST'])
def submit_rating():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401

        data = request.get_json()
        item_id = data.get('item_id')
        rating = data.get('rating')
        comment = data.get('comment')

        # Input validation
        if not all([item_id, isinstance(item_id, int), rating in range(1, 6), comment]):
            return jsonify({"error": "Invalid input."}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO rating (user_id, item_id, rating, comment)
            VALUES (%s, %s, %s, %s);
        """, (user_id, item_id, rating, comment))
        connection.commit()

        return jsonify({"message": "Rating and comment submitted successfully!"}), 201

    except pymysql.MySQLError:
        return jsonify({"error": "A database error occurred."}), 500

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while submitting rating and comment."}), 500

    finally:
        if cursor: cursor.close()
        if connection: connection.close()



# Store verification codes (In production, use a more persistent storage like a database)
verification_codes = {}
@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')

    # Validate email in the database
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            if not user:
                return jsonify(success=False, message='Email not found.'), 404

            # Generate a random verification code
            verification_code = random.randint(100000, 999999)
            verification_codes[email] = verification_code

            msg = Message('Password Reset Request', recipients=[email])
            msg.body = f'Your verification code is: {verification_code}'

            try:
                mail.send(msg)
                return jsonify(success=True, message='Password reset link sent! Please check your email.'), 200
            except Exception as e:
                return jsonify(success=False, message='Failed to send email: ' + str(e)), 500

        except pymysql.MySQLError as e:
            return jsonify(success=False, message=str(e)), 500
        finally:
            cursor.close()
            connection.close()
    else:
        return jsonify(success=False, message='Database connection failed.'), 500



@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    code = data.get('code')
    new_password = data.get('new_password')

    # Validate input fields
    if not all([email, code, new_password]):
        return jsonify(success=False, message='All fields are required.'), 400

    # Verify the code
    if email in verification_codes and verification_codes[email] == int(code):
        # Hash the new password
        hashed_password = generate_password_hash(new_password)

        # Update the user's password in the database
        connection = get_db_connection()
        if connection:
            try:
                cursor = connection.cursor()
                cursor.execute(
                    "UPDATE users SET password = %s WHERE email = %s",
                    (hashed_password, email)
                )
                connection.commit()

                # Remove the code after successful use
                del verification_codes[email]

                return jsonify(success=True, message='Password has been reset!'), 200

            except pymysql.MySQLError as e:
                connection.rollback()
                return jsonify(success=False, message='Database error: ' + str(e)), 500
            finally:
                cursor.close()
                connection.close()
        else:
            return jsonify(success=False, message='Database connection failed.'), 500
    else:
        return jsonify(success=False, message='Invalid verification code!'), 400




if __name__ == '__main__':
    app.run(debug=True)
