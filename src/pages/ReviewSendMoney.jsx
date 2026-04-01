import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api"; // 🔥 FIXED
import "./ReviewSendMoney.css";

function ReviewSendMoney() {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, email, amount } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // 🔥 NEW

  /* 🔥 LOAD CURRENT USER */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/api/user/profile");
        setUser(res.data);
      } catch {
        console.log("User load failed");
      }
    };

    loadUser();
  }, []);

  const handleConfirm = async () => {
    if (!email || !amount) {
      alert("Missing transfer details.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/transactions/transfer", {
        receiverEmail: email,
        amount: Number(amount)
      });

      navigate("/success", {
        state: { name, email, amount } // 🔥 IMPORTANT FIX
      });

    } catch (error) {
      alert(error.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zelle-review">
      <div className="zelle-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h2>Review</h2>
      </div>

      <div className="review-card">

        <div className="review-recipient">
          <div className="zelle-avatar">Z</div>
          <div>
            <h3>{name}</h3>
            <p>{email}</p>
          </div>
        </div>

        <div className="review-amount">
          ${Number(amount).toLocaleString()}
        </div>

        {/* 🔥 FIXED SENDER */}
        <div className="review-info">
          <p>From</p>
          <strong>
            {user ? user.name : "Loading..."}
          </strong>
        </div>

      </div>

      <button
        className="confirm-btn"
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Processing..." : "Confirm Transfer"}
      </button>
    </div>
  );
}

export default ReviewSendMoney;