import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [formData, setFormData] = useState({
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking",
    swiftCode: "",
    bankAddress: "",
    purpose: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "accountNumber") {
      const detectedName = registeredAccounts[value];
      setAccountName(detectedName || "");
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* 🔥 VALIDATION */
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

    if (!amount || Number(amount) <= 0)
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
        amount,
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

        {/* 1️⃣ Account Number FIRST */}
        <input
          name="accountNumber"
          placeholder="Account Number"
          onChange={handleChange}
          className={errors.accountNumber ? "input-error" : ""}
        />
        {errors.accountNumber && (
          <p className="error-text">{errors.accountNumber}</p>
        )}

        {/* 🔥 Auto Display Name */}
        {accountName && (
          <div className="detected-name">
            Account Holder: <strong>{accountName}</strong>
          </div>
        )}

        {/* 2️⃣ Routing Number */}
        <input
          name="routingNumber"
          placeholder="Routing Number"
          onChange={handleChange}
          className={errors.routingNumber ? "input-error" : ""}
        />
        {errors.routingNumber && (
          <p className="error-text">{errors.routingNumber}</p>
        )}

        {/* 3️⃣ Bank Name */}
        <input
          name="bankName"
          placeholder="Bank Name"
          onChange={handleChange}
          className={errors.bankName ? "input-error" : ""}
        />
        {errors.bankName && (
          <p className="error-text">{errors.bankName}</p>
        )}

        {transferType === "ach" && (
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        )}

        {transferType === "wire" && (
          <>
            <input
              name="bankAddress"
              placeholder="Bank Address"
              onChange={handleChange}
              className={errors.bankAddress ? "input-error" : ""}
            />
            {errors.bankAddress && (
              <p className="error-text">{errors.bankAddress}</p>
            )}

            <input
              name="swiftCode"
              placeholder="SWIFT / BIC Code"
              onChange={handleChange}
              className={errors.swiftCode ? "input-error" : ""}
            />
            {errors.swiftCode && (
              <p className="error-text">{errors.swiftCode}</p>
            )}

            <input
              name="purpose"
              placeholder="Purpose of Transfer"
              onChange={handleChange}
              className={errors.purpose ? "input-error" : ""}
            />
            {errors.purpose && (
              <p className="error-text">{errors.purpose}</p>
            )}
          </>
        )}
      </div>

      {/* Amount */}
      <div className="section">
        <h3>Amount</h3>
        <input
          type="number"
          placeholder="$0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={errors.amount ? "input-error" : ""}
        />
        {errors.amount && (
          <p className="error-text">{errors.amount}</p>
        )}
      </div>

      <button className="send-btn" onClick={handleReview}>
        Review Transfer
      </button>
    </div>
  );
}

export default SendMoney;