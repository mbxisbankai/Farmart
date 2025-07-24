import React, { useEffect, useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    fetch(`/cart/?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch cart');
        }
        return res.json();
      })
      .then((data) => {
        setCartItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const removeItem = (cartId) => {
    fetch(`/cart/${cartId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to remove item');
        }
        setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const clearCart = () => {
    fetch(`/cart/clear?user_id=${userId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to clear cart');
        }
        setCartItems([]);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const checkout = () => {
    fetch(`/cart/checkout?user_id=${userId}`, {
      method: 'POST',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Checkout failed');
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        setCartItems([]);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.cart_id}>
                {item.animal.name} - ${item.animal.price.toFixed(2)}{' '}
                <button onClick={() => removeItem(item.cart_id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={checkout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
