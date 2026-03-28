import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./SendMoney.css";

/* 🔒 REGISTERED INTERNAL ACCOUNTS */
const registeredAccounts = {
  "1087990341": "Lisa M Redd",
  "1066099772": "Judith L Smith",
  "1092001319": "Mason D Greg",
  "1022780341": "General Electric LLC",
  "1101347162": "Obire John",
  "9147762707": "REDFIN LLC"
};

function SendMoney() {
  const navigate = useNavigate();

  const [transferType, setTransferType] = useState("ach");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [accountName, setAccountName] = useState("");

  const [recentRecipients, setRecentRecipients] = useState([]);

  const [formData, setFormData] = useState({
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking",
    swiftCode: "",
    bankAddress: "",
    purpose: "",
    note: "" // 🔥 ADDED (no conflict)
  });

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get("/api/transactions/history");

        const unique = {};

        res.data.forEach((tx) => {
          if (tx.receiver?.accountNumber) {
            unique[tx.receiver.accountNumber] = tx.receiver;
          }
        });

        setRecentRecipients(Object.values(unique).slice(0, 5));

      } catch (err) {
        console.log("Recent fetch error", err);
      }
    };

    fetchRecent();
  }, []);

  /* 🔥 FORMAT AMOUNT */
  const formatAmount = (value) => {
    const num = value.replace(/[^0-9]/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newErrors = { ...errors };

    /* 🔥 ACCOUNT VALIDATION */
    if (name === "accountNumber") {
      const digits = value.replace(/\D/g, "");

      const detectedName = registeredAccounts[digits];
      setAccountName(detectedName || "");

      if (digits.length < 10) {
        newErrors.accountNumber = "Account number must be 10 digits";
      } else if (digits.length > 10) {
        newErrors.accountNumber = "Invalid account number";
      } else if (!registeredAccounts[digits]) {
        newErrors.accountNumber = "Account not found";
      } else {
        delete newErrors.accountNumber;
      }

      setFormData({ ...formData, accountNumber: digits });
      setErrors(newErrors);
      return;
    }

    /* 🔥 ROUTING VALIDATION */
    if (name === "routingNumber") {
      const digits = value.replace(/\D/g, "");

      if (digits.length < 9) {
        newErrors.routingNumber = "Routing number must be 9 digits";
      } else if (digits.length > 9) {
        newErrors.routingNumber = "Routing number does not exist";
      } else {
        delete newErrors.routingNumber;
      }

      setFormData({ ...formData, routingNumber: digits });
      setErrors(newErrors);
      return;
    }

    /* 🔥 SWIFT VALIDATION */
    if (name === "swiftCode") {
      if (value && value !== "SBIUS6SXXX") {
        newErrors.swiftCode = "Invalid SWIFT code";
      } else {
        delete newErrors.swiftCode;
      }
    }

    setErrors(newErrors);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* 🔥 AMOUNT HANDLER */
  const handleAmountChange = (e) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  /* 🔥 VALIDATION (UNCHANGED BUT SAFE) */
  const validate = () => {
    let newErrors = {};

    if (!formData.accountNumber.trim())
      newErrors.accountNumber = "Account number is required";

    if (!registeredAccounts[formData.accountNumber])
      newErrors.accountNumber = "Account not found";

    if (!formData.routingNumber.trim())
      newErrors.routingNumber = "Routing number is required";

    if (!formData.bankName.trim())
      newErrors.bankName = "Bank name is required";

    if (!amount || Number(amount.replace(/,/g, "")) <= 0)
      newErrors.amount = "Enter a valid amount";

    if (transferType === "wire") {
      if (!formData.swiftCode.trim())
        newErrors.swiftCode = "SWIFT code is required";

      if (!formData.bankAddress.trim())
        newErrors.bankAddress = "Bank address is required";

      if (!formData.purpose.trim())
        newErrors.purpose = "Purpose is required for wire transfer";
    }

    return newErrors;
  };

  const handleReview = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    navigate("/review-transfer", {
      state: {
        transferType,
        amount: amount.replace(/,/g, ""), // 🔥 FIXED
        recipientName: registeredAccounts[formData.accountNumber],
        recipientAccount: formData.accountNumber,
        recipientBank: formData.bankName,
        formData,
      },
    });
  };

  return (
    <div className="send-container">

      <div className="send-header">
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>Send Money</h2>
      </div>

      {/* RECENTS (UNCHANGED) */}
      {recentRecipients.length > 0 && (
        <div className="recent-section">
          <h4>Recent</h4>

          <div className="recent-list">
            {recentRecipients.map((user, i) => (
              <div
                key={i}
                className="recent-item"
                onClick={() => {
                  setFormData({
                    ...formData,
                    accountNumber: user.accountNumber
                  });

                  setAccountName(registeredAccounts[user.accountNumber] || "");
                }}
              >
                <div className="avatar">
                  {user.name?.charAt(0)}
                </div>

                <div>
                  <strong>{user.name}</strong>
                  <p>{user.accountNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
{/* Transfer Type */}
<div className="section">
  <h3>Transfer Type</h3>

  <div
    className={`option ${transferType === "ach" ? "active" : ""}`}
    onClick={() => setTransferType("ach")}
  >
    ACH Transfer
    <span>1–2 business days</span>
  </div>

  <div
    className={`option ${transferType === "wire" ? "active" : ""}`}
    onClick={() => setTransferType("wire")}
  >
    Wire Transfer
    <span>Same day delivery</span>
  </div>
</div>
      {/* Recipient */}
      <div className="section">
        <h3>Recipient Details</h3>

        <input
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={handleChange}
          maxLength={10}
          className={errors.accountNumber ? "input-error" : ""}
        />

        {errors.accountNumber && (
          <p className="error-text">{errors.accountNumber}</p>
        )}

        {accountName && (
          <div className="detected-name">
            Account Holder: <strong>{accountName}</strong>
          </div>
        )}

        <input
          name="routingNumber"
          placeholder="Routing Number"
          value={formData.routingNumber}
          onChange={handleChange}
          maxLength={9}
          className={errors.routingNumber ? "input-error" : ""}
        />

        {errors.routingNumber && (
          <p className="error-text">{errors.routingNumber}</p>
        )}

        <input
          name="bankName"
          placeholder="Bank Name"
          onChange={handleChange}
          className={errors.bankName ? "input-error" : ""}
        />

        {errors.bankName && (
          <p className="error-text">{errors.bankName}</p>
        )}

        {transferType === "wire" && (
          <>
            <input
              name="swiftCode"
              placeholder="SWIFT Code"
              maxLength={11}
              onChange={handleChange}
              className={errors.swiftCode ? "input-error" : ""}
            />

            {errors.swiftCode && (
              <p className="error-text">{errors.swiftCode}</p>
            )}
          </>
        )}
      </div>

      {/* AMOUNT */}
      <div className="section">
        <h3>Amount</h3>

        <input
          placeholder="$0.00"
          value={amount}
          onChange={handleAmountChange}
          className={errors.amount ? "input-error" : ""}
        />

        {errors.amount && (
          <p className="error-text">{errors.amount}</p>
        )}
      </div>

      {/* 🔥 NOTE FIELD (ADDED SAFELY) */}
      <div className="section">
        <h3>Note (Optional)</h3>
        <input
          name="note"
          placeholder="Add a note (e.g Rent, Gift)"
          onChange={handleChange}
        />
      </div>

      <button className="send-btn" onClick={handleReview}>
        Review Transfer
      </button>

    </div>
  );
}

export default SendMoney;