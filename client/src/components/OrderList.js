import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import api from "../api/axios";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch("https://farmart-server-dcd6.onrender.com/api/orders")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched orders:", data); // DEBUG: check structure
        // ✅ Extract the array from 'data.orders' or fallback to []
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-center text-muted">No orders found.</p>;
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">All Orders</h2>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Buyer Username</th>
              <th scope="col">Animals Ordered</th>
              <th scope="col">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.username || "N/A"}</td>
                <td>
                  <ul className="mb-0">
                    {order.animals.map((animal) => (
                      <li key={animal.id}>
                        <strong>{animal.name}</strong> - {animal.breed} (${animal.price})
                      </li>
                    ))}
                  </ul>
                </td>
                <td><strong>${order.total_amount}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
