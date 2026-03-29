import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Zelle.css";

function Zelle() {
  const navigate = useNavigate();

  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [checking, setChecking] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  /* 🔥 LIVE EMAIL CHECK */
  useEffect(() => {

    if (!recipientEmail) {
      setFoundUser(null);
      return;
    }

    const delay = setTimeout(async () => {

      try {
        setChecking(true);
        setError("");

        const res = await api.get(`/api/user/by-email/${recipientEmail}`);

        setFoundUser(res.data);

      } catch {
        setFoundUser(null);
      } finally {
        setChecking(false);
      }

    }, 600); // debounce

    return () => clearTimeout(delay);

  }, [recipientEmail]);



  const handleContinue = async () => {

    if (!recipientEmail || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    if (!foundUser) {
      setError("Zelle user not found.");
      return;
    }

    try {

      setLoading(true);

      navigate("/zelle-review", {
        state: {
          email: foundUser.email,
          name: foundUser.name,
          amount: Number(amount)
        }
      });

    } catch  {
      setError("Something went wrong");
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

        {/* 🔥 LIVE STATUS */}
        {checking && (
          <p className="zelle-checking">Checking user...</p>
        )}

        {foundUser && (
          <div className="zelle-user-found">
            ✅ {foundUser.name}
          </div>
        )}

        {!checking && recipientEmail && !foundUser && (
          <div className="zelle-user-error">
            ❌ User not found
          </div>
        )}

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
          {loading ? "Processing..." : "Continue"}
        </button>

      </div>

    </div>
  );
}

export default Zelle;