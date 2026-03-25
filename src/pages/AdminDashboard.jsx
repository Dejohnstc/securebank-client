import { useEffect, useState } from 'react';
import axios from 'axios';

const API = "https://securebank-api-ixis.onrender.com";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('token');

  // 🔄 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchUsers();
      setLoading(false);
    };
    load();
  }, []);

  // 💰 UPDATE BALANCE (FIXED)
  const updateBalance = async (action) => {
    try {
      if (amount === "" || selectedUser === null) {
        alert("Enter amount first");
        return;
      }

      await axios.put(
        `${API}/api/admin/users/${selectedUser}/balance`,
        {
          amount: Number(amount), // ✅ FIXED
          action
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAmount("");
      setSelectedUser(null);
      fetchUsers();

    } catch (err) {
      console.error("BALANCE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Balance update failed");
    }
  };

  // ❌ DELETE
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  // 🚫 SUSPEND
  const suspendUser = async (id) => {
    try {
      await axios.put(`${API}/api/admin/users/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();
    } catch (err) {
      console.error("SUSPEND ERROR:", err.response?.data || err.message);
    }
  };

  // 📊 STATS
  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: "30px", background: "#0f172a", minHeight: "100vh", color: "white" }}>

      <h1 style={{ marginBottom: "20px" }}>🏦 Admin Dashboard</h1>

      {/* 📊 STATS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p style={statNumber}>{totalUsers}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Balance</h3>
          <p style={statNumber}>${totalBalance}</p>
        </div>
      </div>

      {/* 👥 USERS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {users.map(user => (
          <div key={user._id} style={userCard}>

            <h3>{user.name}</h3>
            <p>{user.email}</p>

            <p>Status: 
              <span style={{ color: user.status === "active" ? "lime" : "red" }}>
                {user.status}
              </span>
            </p>

            <p>Balance: <strong>${user.balance}</strong></p>

            {/* 💰 BALANCE CONTROL */}
            <div style={{ marginTop: "10px" }}>
              <input
                type="number"
                placeholder="Amount"
                value={selectedUser === user._id ? amount : ""}
                onChange={(e) => {
                  setSelectedUser(user._id);
                  setAmount(e.target.value);
                }}
                style={inputStyle}
              />

              <div style={{ marginTop: "5px" }}>
                <button style={btnGreen} onClick={() => updateBalance("add")}>➕</button>
                <button style={btnYellow} onClick={() => updateBalance("subtract")}>➖</button>
                <button style={btnBlue} onClick={() => updateBalance("set")}>Set</button>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ marginTop: "15px" }}>
              <button style={btnRed} onClick={() => deleteUser(user._id)}>Delete</button>
              <button style={btnOrange} onClick={() => suspendUser(user._id)}>Suspend</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 STYLES
const cardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px"
};

const userCard = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
};

const statNumber = {
  fontSize: "24px",
  fontWeight: "bold"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "none"
};

const btnGreen = { background: "green", color: "white", marginRight: 5 };
const btnYellow = { background: "gold", color: "black", marginRight: 5 };
const btnBlue = { background: "blue", color: "white" };
const btnRed = { background: "red", color: "white", marginRight: 5 };
const btnOrange = { background: "orange", color: "white" };