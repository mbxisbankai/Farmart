import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import OrderList from "../components/OrderList";

function AdminPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    total_users: 0,
    total_animals: 0,
    total_orders: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/admin/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch admin summary");
          return r.json();
        })
        .then(setSummary)
        .catch((err) => console.error("❌ Admin summary error:", err));
    }
  }, [user, token, navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">👑 Admin Dashboard</h2>
      <div className="row">
        <Card className="col-md-4 p-3 m-2 bg-light shadow-sm">
          <h5>Total Users</h5>
          <p className="fs-4">{summary.total_users}</p>
        </Card>
        <Card className="col-md-4 p-3 m-2 bg-light shadow-sm">
          <h5>Total Animals</h5>
          <p className="fs-4">{summary.total_animals}</p>
        </Card>
        <Card className="col-md-4 p-3 m-2 bg-light shadow-sm">
          <h5>Total Orders</h5>
          <p className="fs-4">{summary.total_orders}</p>
        </Card>
      </div>

      <div className="mt-4 d-flex gap-3">
        <Button variant="primary" onClick={() => navigate("/animals")}>
          View All Animals
        </Button>
        <Button variant="secondary" onClick={() => navigate("/users")}>
          Manage Users
        </Button>
        <Button variant="success" onClick={() => navigate("/")}>
          Back to Homepage
        </Button>
      </div>

      {/* ✅ OrderList added below */}
      <OrderList />
    </div>
  );
}

export default AdminPage;
