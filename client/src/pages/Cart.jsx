import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?.id;

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/cart/?user_id=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch cart');

        const data = await res.json();
        setCartItems(data);
        if (data.length === 0) {
          setError(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const removeItem = async (cartId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cart/${cartId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove item');
      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cart/clear?user_id=${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear cart');
      setCartItems([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const checkout = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cart/checkout?user_id=${userId}`, { method: 'POST' });
      if (!res.ok) throw new Error('Checkout failed');
      const data = await res.json();
      alert(data.message || 'Checkout successful');
      setCartItems([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.animal?.price || 0), 0);

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>

      {cartItems.length === 0 && !error ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li key={item.cart_id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {item.animal?.name || 'Unnamed'} - ${item.animal?.price?.toFixed(2) || '0.00'}
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeItem(item.cart_id)}
                  disabled={actionLoading}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h4>Total: ${total.toFixed(2)}</h4>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-warning" onClick={clearCart} disabled={actionLoading}>
              {actionLoading ? 'Clearing...' : 'Clear Cart'}
            </button>
            <button className="btn btn-success" onClick={checkout} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;