import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import "./SendMoney.css";

function ReviewTransfer() {

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");

  const state = location.state;

  useEffect(() => {
    if (!state) {
      navigate("/send-money");
    }
  }, [state, navigate]);

  if (!state) return null;

  const {
    transferType,
    amount,
    recipientName,
    recipientAccount,
    recipientBank,
    speed
  } = state;

  const numericAmount = Number(amount || 0);

  const wireFee = transferType === "wire" ? 25 : 0;
  const instantFee = speed === "instant" ? 2.99 : 0;

  const total = numericAmount + wireFee + instantFee;

  const reference = "TRX" + Date.now().toString().slice(-8);

  const estimatedDelivery =
    transferType === "wire"
      ? "Same business day"
      : speed === "instant"
      ? "Within minutes"
      : "1–2 business days";

  const handleConfirm = async () => {

    if (pin !== "070362") {
      alert("Incorrect PIN");
      setPin("");
      return;
    }

    try {

      setLoading(true);

      await api.post("/api/transactions/transfer", {
        accountNumber: recipientAccount,
        amount: numericAmount,
      });

      navigate("/success", {
        state: {
          name: recipientName,
          amount: numericAmount,
          reference
        }
      });

    } catch (error) {

      alert(error.response?.data?.message || "Transfer failed");

    } finally {

      setLoading(false);
      setShowPinModal(false);

    }

  };

  return (

    <div className="review-container">

      <div className="review-header">
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Review Transfer</h2>
      </div>

      <div className="review-card">

        <div className="review-section">
          <h4>From</h4>
          <p className="review-main">ALEX MARTINS</p>
          <p className="review-sub">Total Checking •••• 8509</p>
        </div>

        <div className="review-section">
          <h4>To</h4>
          <p className="review-main">{recipientName}</p>
          <p className="review-sub">
            {recipientBank} •••• {recipientAccount?.slice(-4)}
          </p>

          <span
            className="edit-link"
            onClick={() => navigate(-1)}
          >
            Edit
          </span>
        </div>

        <div className="review-section">

          <h4>Transfer Details</h4>

          <div className="review-row">
            <span>Reference</span>
            <strong>{reference}</strong>
          </div>

          <div className="review-row">
            <span>Transfer Type</span>
            <strong>{transferType.toUpperCase()}</strong>
          </div>

          <div className="review-row">
            <span>Delivery</span>
            <strong>{estimatedDelivery}</strong>
          </div>

          <div className="review-row">
            <span>Amount</span>
            <strong>${numericAmount.toFixed(2)}</strong>
          </div>

          {wireFee > 0 && (
            <div className="review-row">
              <span>Wire Fee</span>
              <strong>${wireFee.toFixed(2)}</strong>
            </div>
          )}

          {instantFee > 0 && (
            <div className="review-row">
              <span>Instant Fee</span>
              <strong>${instantFee.toFixed(2)}</strong>
            </div>
          )}

          <div className="review-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

        </div>

      </div>

      <button
        className="confirm-btnn"
        onClick={() => setShowPinModal(true)}
      >
        Confirm Transfer
      </button>

      {/* PIN MODAL */}

      {showPinModal && (

        <div className="pin-overlay">

          <div className="pin-modal">

            <h3>Enter 6-Digit PIN</h3>

            <div className="pin-display">
              {pin.split("").map((_, i) => (
                <span key={i}>•</span>
              ))}
            </div>

            <div className="pin-keypad">

              {[1,2,3,4,5,6,7,8,9].map(num => (
                <button
                  key={num}
                  onClick={() =>
                    pin.length < 6 && setPin(pin + num)
                  }
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setPin(pin.slice(0,-1))}
              >
                ⌫
              </button>

              <button
                onClick={() =>
                  pin.length < 6 && setPin(pin + "0")
                }
              >
                0
              </button>

              <button
                onClick={handleConfirm}
                disabled={pin.length !== 6 || loading}
              >
                OK
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ReviewTransfer;