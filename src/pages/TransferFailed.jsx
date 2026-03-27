import { useLocation, useNavigate } from "react-router-dom";
import "./TransferFailed.css";

function TransferFailed(){

  const navigate = useNavigate();
  const location = useLocation();

  const message = location.state?.message || "Transaction failed";

  // 🔥 SMART ERROR DETECTION
  let title = "Transfer Failed";
  let description = message;
  let suggestion = "";

  if (message.toLowerCase().includes("limit")) {
    title = "Transfer Limit Reached";
    description = "You have exceeded your daily transfer limit.";
    suggestion = "Please try again tomorrow or send a smaller amount.";
  }

  else if (message.toLowerCase().includes("insufficient")) {
    title = "Insufficient Balance";
    description = "You do not have enough funds to complete this transfer.";
    suggestion = "Try sending a lower amount or fund your account.";
  }

  return(

    <div className="failed-page">

      <div className="failed-card">

        {/* ❌ ICON */}
        <div className="failed-circle">
          <span className="failed-icon">✖</span>
        </div>

        {/* TITLE */}
        <h2>{title}</h2>

        {/* MESSAGE */}
        <p className="failed-message">{description}</p>

        {/* SUGGESTION */}
        {suggestion && (
          <p className="failed-suggestion">{suggestion}</p>
        )}

        {/* ACTIONS */}
        <div className="failed-actions">

          <button
            className="primary-btn"
            onClick={()=>navigate("/send-money")}
          >
            Try Again
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

export default TransferFailed;