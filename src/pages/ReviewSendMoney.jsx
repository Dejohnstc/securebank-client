import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./ReviewSendMoney.css";

function ReviewSendMoney() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const { name, email, amount } = location.state || {};

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!email || !amount) {
      alert("Missing transfer details.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://127.0.0.1:5000/api/transactions/transfer",
        {
          receiverEmail: email,
          amount: Number(amount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      navigate("/success", {
        state: { name, amount }
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

        <div className="review-info">
          <p>From</p>
          <strong>ALEX MARTINS</strong>
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