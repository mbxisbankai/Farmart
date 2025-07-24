import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.id;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart/?user_id=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch cart');
        const data = await res.json();
        setCartItems(data);
        if (data.length === 0) {
          setError('Your cart is empty.');
        } else {
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, userId, navigate]);

  const removeItem = async (cartId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cart/${cartId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove item');
      setCartItems((prev) => prev.filter((item) => item.cart_id !== cartId));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {cartItems.length > 0 ? (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.cart_id}
              className="flex justify-between items-center p-4 border rounded"
            >
              <div>
                <p className="font-medium">{item.product_name || 'Item'}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <button
                onClick={() => removeItem(item.cart_id)}
                disabled={actionLoading}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading ? 'Removing...' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>Your cart is currently empty.</p>
      )}
    </div>
  );
};

export default Cart;
