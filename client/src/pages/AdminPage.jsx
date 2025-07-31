import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import OrderList from "../components/OrderList";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function AdminPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total_users: 0,
    total_animals: 0,
    total_orders: 0,
  });

  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetch(`https://farmart-server-dcd6.onrender.com/api/admin/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch admin summary");
          return r.json();
        })
        .then(setSummary)
        .catch((err) => console.error("❌ Admin summary error:", err));
    }
  }, [user, token, navigate]);

  const fetchUsers = () => {
    fetch("https://farmart-server-dcd6.onrender.com/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch users");
        return r.json();
      })
      .then((data) => {
        setUsers(data);
        setShowUsers(true);
      })
      .catch((err) => console.error("❌ Users fetch error:", err));
  };

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
        <Button variant="secondary" onClick={fetchUsers}>
          Manage Users
        </Button>
        <Button variant="success" onClick={() => navigate("/")}>
          Back to Homepage
        </Button>
      </div>

      {/* ✅ OrderList */}
      <OrderList />

      {/* ✅ Users list (only shown when showUsers is true) */}
      {showUsers && (
        <div className="mt-5">
          <h3>👥 All Users</h3>
          <ul className="list-group mt-3">
            {users.map((u) => (
              <li key={u.id} className="list-group-item">
                {u.username} ({u.email}) — {u.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
