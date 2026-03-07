import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Zelle.css";

function ZelleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    if (!state) navigate("/dashboard");
  }, [state, navigate]);

  if (!state) return null;

  const { name, amount, reference } = state;

  const today = new Date().toLocaleDateString();

  return (
    <div className="zelle-success-container">

      <div className="zelle-success-card">

        <div className="zelle-check">✔</div>

        <h3>Your payment is scheduled</h3>

        <div className="zelle-success-row">
          <span>To</span>
          <strong>{name}</strong>
        </div>

        <div className="zelle-success-row">
          <span>From</span>
          <strong>My Checking ••••8509</strong>
        </div>

        <div className="zelle-success-row">
          <span>Amount</span>
          <strong>${Number(amount).toFixed(2)}</strong>
        </div>

        <div className="zelle-success-row">
          <span>Date</span>
          <strong>{today}</strong>
        </div>

        <div className="zelle-success-row">
          <span>Confirmation Number</span>
          <strong>{reference}</strong>
        </div>

        <button
          className="zelle-done-btn"
          onClick={() => navigate("/dashboard")}
        >
          DONE
        </button>

      </div>

    </div>
  );
}

export default ZelleSuccess;