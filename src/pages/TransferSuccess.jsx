import { useLocation, useNavigate } from "react-router-dom";
import "./TransferSuccess.css";

function TransferSuccess(){

  const navigate = useNavigate();
  const location = useLocation();

  const { name, amount, reference } = location.state || {};

  return(

    <div className="success-page">

      <div className="success-card">

        {/* ✅ ANIMATED CHECK */}
        <div className="checkmark-circle">
          <div className="checkmark">✔</div>
        </div>

        <h2>Transfer Completed</h2>

        <p className="success-sub">
          Your transfer was processed successfully
        </p>

        <h1 className="success-amount">
          ${Number(amount).toFixed(2)}
        </h1>

        <p className="success-recipient">
          Sent to <strong>{name}</strong>
        </p>

        <div className="success-details">
          <div>
            <span>Reference</span>
            <strong>{reference}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong className="success-status">Completed</strong>
          </div>
        </div>

        <div className="success-actions">

          {/* ✅ FIXED → GOES TO RECEIPT PAGE */}
          <button
            className="primary-btn"
            onClick={() =>
              navigate("/success", {
                state: { name, amount, reference }
              })
            }
          >
            View Receipt
          </button>

          <button
            className="secondary-btn"
            onClick={()=>navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>

  );
}

export default TransferSuccess;