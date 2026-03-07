import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Zelle.css";

const zelleUsers = {
  "kewilson785@gmail.com": "Kevin Wilson",
  "davebarry7766@gmail.com": "Dave Barry",
  "debarrysrentals87@gmail.com": "Clinton Duke",
  "lisa@bank.com": "Lisa M Redd",
  "redfin@gmail.com": "REDFIN LLC"
};

function Zelle() {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!recipientEmail || !amount) {
      setError("Please fill in all fields.");
      return;
    }

    if (!zelleUsers[recipientEmail]) {
      setError("Zelle user not found.");
      return;
    }
    if (!recipientEmail || !amount) {
  alert("Missing transfer details");
  return;
}

    navigate("/zelle-review", {
      state: {
        email: recipientEmail,
        name: zelleUsers[recipientEmail],
        amount: Number(amount)
      }
    });
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

        <button className="zelle-send-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Zelle;