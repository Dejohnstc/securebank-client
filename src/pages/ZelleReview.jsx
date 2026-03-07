import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import "./Zelle.css";

function ZelleReview() {

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");

  const state = location.state;

  useEffect(() => {
    if (!state) {
      navigate("/zelle");
    }
  }, [state, navigate]);

  if (!state) return null;

  const { name, email, amount } = state;

  const numericAmount = Number(amount || 0);

  const reference = "ZEL" + Date.now().toString().slice(-8);

  const handleConfirm = async () => {

    if (pin !== "070362") {
      alert("Incorrect PIN");
      setPin("");
      return;
    }

    try {

      setLoading(true);

      await api.post("/api/transactions/transfer", {
        receiverEmail: email,
        amount: numericAmount
      });

      navigate("/zelle-success", {
        state: {
          name,
          amount: numericAmount,
          reference
        }
      });

    } catch (error) {

      alert(error.response?.data?.message || "Zelle payment failed");

    } finally {

      setLoading(false);
      setShowPinModal(false);

    }

  };

  return (

    <div className="zelle-review-container">

      <div className="zelle-header">
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Review Payment</h2>
      </div>

      <div className="zelle-review-card">

        <div className="zelle-row">
          <span>From</span>
          <strong>ALEX MARTINS •••• 8509</strong>
        </div>

        <div className="zelle-row">
          <span>To</span>
          <strong>{name}</strong>
        </div>

        <div className="zelle-row">
          <span>Email</span>
          <strong>{email}</strong>
        </div>

        <div className="zelle-row">
          <span>Amount</span>
          <strong>${numericAmount.toFixed(2)}</strong>
        </div>

        <div className="zelle-row">
          <span>Reference</span>
          <strong>{reference}</strong>
        </div>

      </div>

      <button
        className="zelle-confirm-btn"
        onClick={() => setShowPinModal(true)}
      >
        Send Payment
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

              <button onClick={() => setPin(pin.slice(0,-1))}>
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

export default ZelleReview;