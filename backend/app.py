import pymysql
from flask import Flask, request, jsonify, session, redirect, url_for, flash,make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)

# CORS configuration
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

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

# Create users table if not exists
def create_users_table():
    connection = get_db_connection()
    if connection:
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
        """
        try:
            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            cursor.close()
            print("Users table created or already exists.")
        except pymysql.MySQLError as e:
            print(f"Error creating table: {e}")
        finally:
            connection.close()

# Call the function to create users table
create_users_table()

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
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
                "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                (username, email, hashed_password)
            )
            connection.commit()
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

# # Session check route
# @app.route('/check_session', methods=['GET'])
# def check_session():
#     session_status = {"isLoggedIn": True, "email": "user@example.com"}
#     response = jsonify(session_status)
#     response.headers['Content-Type'] = 'application/json'
#     return response


# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clears all session data
    
    response = make_response(jsonify({'message': 'Logged out successfully.'}), 200)
    response.delete_cookie('session')  # Ensure this deletes the session cookie
    return response

@app.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:  # Adjust this to how you store the session
        return jsonify({'isLoggedIn': True, 'email': session.get('email')}), 200
    return jsonify({'isLoggedIn': False}), 200


# Home route
@app.route('/')
def home():
    if 'user_id' in session:
        return f"Hello, {session['user_email']}! Welcome to the home page."
    else:
        return redirect(url_for('login'))

# Fetch user data
@app.route('/user_data', methods=['GET'])
def user_data():
    if 'user_id' in session:
        connection = get_db_connection()
        if connection:
            try:
                cursor = connection.cursor()
                cursor.execute("SELECT username, email FROM users WHERE id = %s", (session['user_id'],))
                user_data = cursor.fetchone()
                return jsonify(user_data), 200
            except pymysql.MySQLError as e:
                return jsonify({'error': str(e)}), 500
            finally:
                connection.close()
        else:
            return jsonify({'error': 'Database connection failed.'}), 500
    else:
        return jsonify({'error': 'Not logged in'}), 401

if __name__ == "__main__":
    app.run(debug=True)
