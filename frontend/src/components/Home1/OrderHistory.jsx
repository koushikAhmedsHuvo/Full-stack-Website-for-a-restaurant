import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/order-history', {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('Failed to load order history.');
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/check-session',
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.isLoggedIn);

        if (response.data.isLoggedIn) {
          await fetchOrderHistory();
        } else {
          setError('You must be logged in to view your order history.');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setError('Authentication check failed.');
      }
    };

    checkAuthentication();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleCommentChange = (orderId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [orderId]: value,
    }));
  };

  const handleRatingChange = (orderId, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [orderId]: value,
    }));
  };

  const handleSubmitComment = async (orderId) => {
    const comment = comments[orderId];
    const rating = ratings[orderId];

    if (!rating || !comment) {
      alert('Please provide both a rating and comment.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/submit-rating',
        {
          item_id: orderId,
          rating: rating,
          comment: comment,
        },
        {
          withCredentials: true, // Ensures cookies (session) are included
        }
      );
      alert('Comment and rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting comment and rating:', error);
      alert('Failed to submit comment and rating.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No orders found.</p>
      ) : (
        <div className="flex flex-col space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="flex flex-row space-x-8 bg-white p-6 rounded-lg shadow-md border border-gray-300"
            >
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex items-center">
                  <img
                    src={order.image_link}
                    alt={order.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-bold">{order.title}</h2>
                    <p className="text-gray-600">Quantity: {order.quantity}</p>
                    <p className="text-lg font-medium">
                      Price: $
                      {typeof order.price === 'number' && !isNaN(order.price)
                        ? order.price.toFixed(2)
                        : typeof order.price === 'string' &&
                          !isNaN(parseFloat(order.price))
                        ? parseFloat(order.price).toFixed(2)
                        : 'N/A'}
                    </p>
                    <p className="text-gray-500">
                      Created At: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Rating:</h3>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`cursor-pointer text-2xl ${
                          ratings[order.order_id] >= star
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }`}
                        onClick={() => handleRatingChange(order.order_id, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Comments:</h3>
                  <textarea
                    placeholder="Add a comment..."
                    className="border rounded-lg w-full p-2 mt-2"
                    rows="3"
                    value={comments[order.order_id] || ''}
                    onChange={(e) =>
                      handleCommentChange(order.order_id, e.target.value)
                    }
                  />
                  <button
                    className="mt-2 bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 transition"
                    onClick={() => handleSubmitComment(order.order_id)}
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
