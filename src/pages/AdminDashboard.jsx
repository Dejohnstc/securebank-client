import { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ BASE URL (VERY IMPORTANT)
const API = "https://securebank-api-ixis.onrender.com";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  // ✅ FETCH USERS
  const fetchUsers = async () => {
    try {
      if (!token) return;

      const res = await axios.get(`${API}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  // ✅ DELETE USER
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ✅ SUSPEND USER
  const suspendUser = async (id) => {
    try {
      await axios.put(`${API}/api/admin/users/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchUsers();
    } catch (err) {
      console.error('Suspend error:', err);
    }
  };

  // ✅ LOAD USERS
  useEffect(() => {
    const loadUsers = async () => {
      try {
        if (!token) return;

        const res = await axios.get(`${API}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(res.data);
      } catch (err) {
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token]);

  // ✅ SEARCH USERS
  const handleSearch = async (value) => {
    setSearch(value);

    try {
      if (!token) return;

      if (value.trim() === '') {
        fetchUsers();
        return;
      }

      const res = await axios.get(`${API}/api/admin/users/search?query=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading users...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid gray"
        }}
      />

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map(user => (
          <div
            key={user._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "15px",
              padding: "15px",
              borderRadius: "10px",
              background: "#f9f9f9"
            }}
          >
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Balance:</strong> ${user.balance}</p>

            <button
              onClick={() => deleteUser(user._id)}
              style={{
                marginRight: "10px",
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>

            <button
              onClick={() => suspendUser(user._id)}
              style={{
                background: "orange",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Suspend
            </button>
          </div>
        ))
      )}
    </div>
  );
}