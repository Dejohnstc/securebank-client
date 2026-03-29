import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API = "https://securebank-api-ixis.onrender.com";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [editDate, setEditDate] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updatePassword = async (userId) => {
    try {
      if (!newPassword) return alert("Enter new password");

      await axios.put(
        `${API}/api/admin/users/${userId}/password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewPassword("");
      alert("Password updated");

    } catch  {
      alert("Failed");
    }
  };

  const updateCreatedAt = async (userId) => {
    try {
      if (!editDate) return alert("Select date");

      await axios.put(
        `${API}/api/admin/users/${userId}/createdAt`,
        { createdAt: editDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditDate("");
      fetchUsers();

    } catch  {
      alert("Failed");
    }
  };

  useEffect(() => {
    fetchUsers().then(() => setLoading(false));
  }, []);

  const updateBalance = async (action) => {
    try {
      if (!selectedUser) return alert("Select user");

      await axios.put(
        `${API}/api/admin/users/${selectedUser}/balance`,
        { amount: Number(amount), action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAmount("");
      fetchUsers();

    } catch {
      alert("Failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      setDeletingId(id);

      await axios.delete(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();

    } finally {
      setDeletingId(null);
    }
  };

  const suspendUser = async (id) => {
    await axios.put(`${API}/api/admin/users/${id}/suspend`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  if (loading) return <p className="admin-loading">Loading...</p>;

  return (

    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">

        <h1>Admin Dashboard</h1>

        <div className="admin-actions">
          <button onClick={() => navigate("/admin/limits")}>
            Limits
          </button>

          <button
            className={registrationEnabled ? "active" : "off"}
            onClick={() => setRegistrationEnabled(!registrationEnabled)}
          >
            {registrationEnabled ? "Registration ON" : "Registration OFF"}
          </button>
        </div>

      </div>

      {/* STATS */}
      <div className="admin-stats">

        <div className="stat-card">
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>

        <div className="stat-card">
          <p>Total Balance</p>
          <h2>
            ${users.reduce((s, u) => s + (u.balance || 0), 0).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* USERS */}
      <div className="admin-grid">

        {users.map(user => (

          <div key={user._id} className="user-card">

            <h3>{user.name}</h3>
            <p>{user.email}</p>

            <p>
              Status:
              <span className={user.status}>
                {user.status}
              </span>
            </p>

            <p>Balance: ${user.balance || 0}</p>

            <p>
              Registered:
              {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </p>

            <input
              type="date"
              onChange={(e) => {
                setSelectedUser(user._id);
                setEditDate(e.target.value);
              }}
            />

            <button onClick={() => updateCreatedAt(user._id)}>
              Update Date
            </button>

            <input
              type="number"
              placeholder="Amount"
              onChange={(e) => {
                setSelectedUser(user._id);
                setAmount(e.target.value);
              }}
            />

            <div className="btn-row">
              <button onClick={() => updateBalance("add")}>+</button>
              <button onClick={() => updateBalance("subtract")}>-</button>
              <button onClick={() => updateBalance("set")}>Set</button>
            </div>

            {/* 🔥 PASSWORD */}
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => {
                setSelectedUser(user._id);
                setNewPassword(e.target.value);
              }}
            />

            <button onClick={() => updatePassword(user._id)}>
              Change Password
            </button>

            <div className="btn-row">

              {user.role !== "admin" && (
                <button
                  disabled={deletingId === user._id}
                  onClick={() => deleteUser(user._id)}
                  className="danger"
                >
                  Delete
                </button>
              )}

              <button onClick={() => suspendUser(user._id)}>
                Suspend
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}