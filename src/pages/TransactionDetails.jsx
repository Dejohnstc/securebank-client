import { useLocation, useNavigate } from "react-router-dom";
import "./TransactionDetails.css";

function TransactionDetails() {

  const navigate = useNavigate();
  const location = useLocation();

  const tx = location.state?.tx;

  if (!tx) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Transaction not found</h3>
        <button onClick={() => navigate("/transactions")}>
          Back
        </button>
      </div>
    );
  }

  return (

    <div className="tx-details-page">

      <div className="tx-details-card">

        {/* HEADER */}
        <div className="tx-header">
          <button onClick={() => navigate(-1)}>←</button>
          <h2>Transaction Details</h2>
        </div>

        {/* STATUS ICON */}
        <div className={`tx-status-icon ${tx.status}`}>
          {tx.status === "completed" && "✔"}
          {tx.status === "failed" && "✖"}
          {tx.status === "pending" && "⏳"}
        </div>

        {/* AMOUNT */}
        <h1 className="tx-amount-big">
          ${Number(tx.amount).toFixed(2)}
        </h1>

        <p className="tx-sub">
          {tx.sender?.name} → {tx.receiver?.name}
        </p>

        {/* DETAILS */}
        <div className="tx-details-box">

          <div className="tx-row">
            <span>Status</span>
            <strong className={tx.status}>{tx.status}</strong>
          </div>

          <div className="tx-row">
            <span>Reference</span>
            <strong>{tx.reference}</strong>
          </div>

          <div className="tx-row">
            <span>Date</span>
            <strong>
              {new Date(tx.createdAt).toLocaleString()}
            </strong>
          </div>

          <div className="tx-row">
            <span>Sender</span>
            <strong>{tx.sender?.name}</strong>
          </div>

          <div className="tx-row">
            <span>Receiver</span>
            <strong>{tx.receiver?.name}</strong>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="tx-actions">

          <button onClick={() => navigate("/transactions")}>
            Back to Transactions
          </button>

          <button onClick={() => window.print()}>
            Print
          </button>

        </div>

      </div>

    </div>

  );
}

export default TransactionDetails;