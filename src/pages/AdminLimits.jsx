import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLimits.css";

function AdminLimits() {

  const token = localStorage.getItem("token");

  const [dailyLimit, setDailyLimit] = useState("");
  const [singleLimit, setSingleLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ FETCH CURRENT LIMITS
  const fetchLimits = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://securebank-api-ixis.onrender.com/api/admin/settings/limits",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDailyLimit(res.data.dailyLimit);
      setSingleLimit(res.data.singleTransferLimit);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load limits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  // ✅ SAVE LIMITS
  const handleSave = async () => {
    try {
      setSaving(true);

      await axios.put(
        "https://securebank-api-ixis.onrender.com/api/admin/settings/limits",
        {
          dailyLimit,
          singleTransferLimit: singleLimit
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Limits updated successfully");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update limits");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading limits...</p>;

  return (

    <div className="limits-page">

      <div className="limits-card">

        <h2>⚙️ Transfer Limits Control</h2>

        <div className="limits-group">
          <label>Daily Transfer Limit ($)</label>
          <input
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
          />
        </div>

        <div className="limits-group">
          <label>Single Transfer Limit ($)</label>
          <input
            type="number"
            value={singleLimit}
            onChange={(e) => setSingleLimit(e.target.value)}
          />
        </div>

        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>

  );
}

export default AdminLimits;