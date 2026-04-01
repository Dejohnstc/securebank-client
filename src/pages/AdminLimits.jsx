import { useEffect, useState } from "react";
import api from "../api/api"; // 🔥 FIXED
import "./AdminLimits.css";

function AdminLimits() {

  const [dailyLimit, setDailyLimit] = useState(0);
  const [singleLimit, setSingleLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ FETCH CURRENT LIMITS
  const fetchLimits = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/settings/limits");

      setDailyLimit(res.data.dailyLimit || 0);
      setSingleLimit(res.data.singleTransferLimit || 0);

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

    // 🔥 VALIDATION
    if (!dailyLimit || dailyLimit <= 0) {
      return alert("Invalid daily limit");
    }

    if (!singleLimit || singleLimit <= 0) {
      return alert("Invalid single transfer limit");
    }

    try {
      setSaving(true);

      await api.put("/api/admin/settings/limits", {
        dailyLimit: Number(dailyLimit),
        singleTransferLimit: Number(singleLimit)
      });

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
            onChange={(e) => setDailyLimit(Number(e.target.value))}
          />
        </div>

        <div className="limits-group">
          <label>Single Transfer Limit ($)</label>
          <input
            type="number"
            value={singleLimit}
            onChange={(e) => setSingleLimit(Number(e.target.value))}
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