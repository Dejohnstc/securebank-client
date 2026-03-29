import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API = "https://securebank-api-ixis.onrender.com";

export default function AdminDashboard() {

  const navigate = useNavigate();
  const [editDate, setEditDate] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // 🔥 NEW: REGISTRATION CONTROL
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

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

  const updateCreatedAt = async (userId) => {
  try {

    if (!editDate) {
      alert("Select a date");
      return;
    }

    await axios.put(
      `${API}/api/admin/users/${userId}/createdAt`,
      { createdAt: editDate },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditDate("");
    fetchUsers();

  } catch (err) {
    console.error(err);
    alert("Failed to update date");
  }
};

  useEffect(() => {
    const load = async () => {
      await fetchUsers();
      setLoading(false);
    };
    load();
  }, []);

  // 🔥 TOGGLE REGISTRATION (FRONTEND SIMULATION)
  const toggleRegistration = () => {
    setRegistrationEnabled(!registrationEnabled);
  };

  // 💰 UPDATE BALANCE
  const updateBalance = async (action) => {
    try {

      if (!selectedUser) {
        alert("Select a user first");
        return;
      }

      if (amount === "" || isNaN(amount)) {
        alert("Enter a valid number");
        return;
      }

      const numericAmount = Number(amount);

      await axios.put(
        `${API}/api/admin/users/${selectedUser}/balance`,
        { amount: numericAmount, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAmount("");
      setSelectedUser(null);
      fetchUsers();

    } catch (err) {
      console.error("BALANCE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Balance update failed");
    }
  };

  // DELETE
  const deleteUser = async (id) => {

    if (deletingId) return;

    if (!window.confirm("Delete this user?")) return;

    try {
      setDeletingId(id);

      await axios.delete(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();

    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // SUSPEND
  const suspendUser = async (id) => {
    try {
      await axios.put(`${API}/api/admin/users/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (

    <div style={pageStyle}>

      {/* HEADER */}
      <div style={headerStyle}>
        <h1>Admin Dashboard</h1>

        <div style={{ display: "flex", gap: 10 }}>

          {/* 🔥 LIMIT BUTTON */}
          <button style={btnPrimary} onClick={() => navigate("/admin/limits")}>
            Limits
          </button>

          {/* 🔥 REGISTRATION CONTROL */}
          <button
            style={{
              ...btnPrimary,
              background: registrationEnabled ? "#16a34a" : "#dc2626"
            }}
            onClick={toggleRegistration}
          >
            {registrationEnabled ? "Registration ON" : "Registration OFF"}
          </button>

        </div>
      </div>

      {/* STATS */}
      <div style={statsWrap}>
        <div style={card}>
          <p>Total Users</p>
          <h2>{totalUsers}</h2>
        </div>

        <div style={card}>
          <p>Total Balance</p>
          <h2>${totalBalance.toLocaleString()}</h2>
        </div>
      </div>

      {/* USERS */}
      <div style={grid}>

        {users.map(user => (

          <div key={user._id} style={userCard}>

            <h3>{user.name}</h3>
            <p>{user.email}</p>

            <p>
              Status:
              <span style={{ color: user.status === "active" ? "#16a34a" : "#dc2626" }}>
                {" "}{user.status}
              </span>
            </p>

            <p>Balance: <strong>${user.balance || 0}</strong></p>

            <p>
  Registered:
  <strong>
    {user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "N/A"}
  </strong>
</p>

<input
  type="date"
  value={selectedUser === user._id ? editDate : ""}
  onChange={(e) => {
    setSelectedUser(user._id);
    setEditDate(e.target.value);
  }}
  style={input}
/>

<button
  style={{ ...btnBlue, marginTop: 5 }}
  onClick={() => updateCreatedAt(user._id)}
>
  Update Date
</button>

            {/* BALANCE */}
            <input
              type="number"
              placeholder="Amount"
              value={selectedUser === user._id ? amount : ""}
              onChange={(e) => {
                setSelectedUser(user._id);
                setAmount(e.target.value.replace(/[^0-9.]/g, ""));
              }}
              style={input}
            />

            <div style={{ marginTop: 8 }}>
              <button style={btnGreen} onClick={() => updateBalance("add")}>+</button>
              <button style={btnYellow} onClick={() => updateBalance("subtract")}>-</button>
              <button style={btnBlue} onClick={() => updateBalance("set")}>Set</button>
            </div>

            {/* ACTIONS */}
            <div style={{ marginTop: 12 }}>

              {user.role !== "admin" && (
                <button
                  style={btnRed}
                  disabled={deletingId === user._id}
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              )}

              <button style={btnOrange} onClick={() => suspendUser(user._id)}>
                Suspend
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

/* 🔥 CLEAN STYLES */
const pageStyle = {
  padding: 20,
  background: "#0f172a",
  minHeight: "100vh",
  color: "white"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20
};

const statsWrap = {
  display: "flex",
  gap: 15,
  marginBottom: 25
};

const card = {
  flex: 1,
  background: "#1e293b",
  padding: 20,
  borderRadius: 12
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
  gap: 15
};

const userCard = {
  background: "#1e293b",
  padding: 16,
  borderRadius: 14
};

const input = {
  width: "100%",
  padding: 8,
  borderRadius: 8,
  border: "none",
  marginTop: 10
};

const btnPrimary = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const btnGreen = { background: "#16a34a", color: "white", marginRight: 5 };
const btnYellow = { background: "#facc15", color: "black", marginRight: 5 };
const btnBlue = { background: "#3b82f6", color: "white" };
const btnRed = { background: "#dc2626", color: "white", marginRight: 5 };
const btnOrange = { background: "#f97316", color: "white" };