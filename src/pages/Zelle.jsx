import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // ✅ IMPORTANT
import "./Zelle.css";

function Zelle() {
  const navigate = useNavigate();

  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {

    if (!recipientEmail || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 CALL BACKEND
      const res = await api.get(`/api/user/by-email/${recipientEmail}`);

      const user = res.data;

      navigate("/zelle-review", {
        state: {
          email: user.email,
          name: user.name,
          amount: Number(amount)
        }
      });

    } catch (err) {
      setError(
        err.response?.data?.message || "Zelle user not found."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zelle-wrapper">

      <div className="zelle-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h2>Zelle®</h2>
        <div />
      </div>

      <div className="zelle-card">

        <label>Send to</label>
        <input
          type="email"
          placeholder="Email or mobile number"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />

        <label>Amount</label>
        <input
          type="number"
          placeholder="$0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error && <div className="zelle-error">{error}</div>}

        <button
          className="zelle-send-btn"
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? "Checking..." : "Continue"}
        </button>

      </div>

    </div>
  );
}

export default Zelle;