import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./SendMoney.css";

/* 🔒 REGISTERED INTERNAL ACCOUNTS (FALLBACK ONLY) */
// const registeredAccounts = {
//   "1087990341": "Lisa M Redd",
//   "1066099772": "Judith L Smith",
//   "1092001319": "Mason D Greg",
//   "1022780341": "General Electric LLC",
//   "1101347162": "Obire John",
//   "9147762707": "REDFIN LLC"
// };

function SendMoney() {
  const navigate = useNavigate();

  const [transferType, _setTransferType] = useState("ach");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [accountName, setAccountName] = useState("");
  const [checking, setChecking] = useState(false);

  const [recentRecipients, setRecentRecipients] = useState([]);

  /* 🔥 NEW LIMIT STATES */
  const [remainingLimit, setRemainingLimit] = useState(null);
  const [_dailyLimit, setDailyLimit] = useState(null);

  const [formData, setFormData] = useState({
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking",
    swiftCode: "",
    bankAddress: "",
    purpose: "",
    note: ""
  });

  /* 🔥 FETCH LIMIT + CALCULATE REMAINING */
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const [limitRes, txRes] = await Promise.all([
          api.get("/api/admin/settings/limits"),
          api.get("/api/transactions/history")
        ]);

        const limit = limitRes.data.dailyLimit || 0;
        setDailyLimit(limit);

        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);

        let spentToday = 0;

        txRes.data.forEach(tx => {
          if (tx.createdAt && new Date(tx.createdAt) >= todayStart && tx.status === "completed") {
            spentToday += Number(tx.amount || 0);
          }
        });

        setRemainingLimit(Math.max(0, limit - spentToday));

      } catch {
        console.log("Limit calculation failed");
      }
    };

    fetchLimits();
  }, []);

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

      } catch  {
        console.log("Recent fetch error");
      }
    };

    fetchRecent();
  }, []);

  /* 🔥 LIVE ACCOUNT VALIDATION */
  useEffect(() => {

    if (!formData.accountNumber || formData.accountNumber.length !== 10) {
      setAccountName("");
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setChecking(true);

        const res = await api.get(
          `/api/user/account/${formData.accountNumber}`
        );

        setAccountName(res.data.name);

        setErrors(prev => {
          const newErr = { ...prev };
          delete newErr.accountNumber;
          return newErr;
        });

      } catch {
        setAccountName("");

        setErrors(prev => ({
          ...prev,
          accountNumber: "Account not found"
        }));
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(delay);

  }, [formData.accountNumber]);

  const formatAmount = (value) => {
    const num = value.replace(/[^0-9]/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "accountNumber") {
      const digits = value.replace(/\D/g, "");

      if (!digits.startsWith("1011")) {
        newErrors.accountNumber = "Invalid bank account";
      } else if (digits.length < 10) {
        newErrors.accountNumber = "Account number must be 10 digits";
      } else if (digits.length > 10) {
        newErrors.accountNumber = "Invalid account number";
      } else {
        delete newErrors.accountNumber;
      }

      setFormData({ ...formData, accountNumber: digits });
      setErrors(newErrors);
      return;
    }

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

  const handleAmountChange = (e) => {
    setAmount(formatAmount(e.target.value));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.accountNumber)
      newErrors.accountNumber = "Account number required";

    if (!accountName)
      newErrors.accountNumber = "Account not found";

    if (!formData.routingNumber)
      newErrors.routingNumber = "Routing number required";

    if (!formData.bankName)
      newErrors.bankName = "Bank name required";

    if (!amount || Number(amount.replace(/,/g, "")) <= 0)
      newErrors.amount = "Enter valid amount";

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
        amount: amount.replace(/,/g, ""),
        recipientName: accountName,
        recipientAccount: formData.accountNumber,
        recipientBank: formData.bankName,
        formData,
      },
    });
  };

  return (
    <div className="send-container">

      {/* 🔥 WRAPPER YOU REQUESTED */}
      <div className="send-form-wrapper">

        {/* 🔥 LIMIT DISPLAY */}
        {remainingLimit !== null && (
          <div className="limit-box">
            Remaining Daily Limit: ${remainingLimit.toLocaleString()}
          </div>
        )}

        <div className="send-header">
          <button onClick={() => navigate(-1)}>← Back</button>
          <h2>Send Money</h2>
        </div>

        {/* EVERYTHING BELOW IS YOUR ORIGINAL CODE UNTOUCHED */}

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

        <div className="section">
          <h3>Transfer Type</h3>

          <div
            className={`option ${transferType === "ach" ? "active" : ""}`}
            onClick={() => _setTransferType("ach")}
          >
            ACH Transfer
            <span>1–2 business days</span>
          </div>

          <div
            className={`option ${transferType === "wire" ? "active" : ""}`}
            onClick={() => _setTransferType("wire")}
          >
            Wire Transfer
            <span>Same day delivery</span>
          </div>
        </div>

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

          {checking && <p>Checking account...</p>}

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
        </div>

        {transferType === "wire" && (
          <>
            <input
              name="swiftCode"
              placeholder="SWIFT Code"
              value={formData.swiftCode}
              onChange={handleChange}
              className={errors.swiftCode ? "input-error" : ""}
            />

            {errors.swiftCode && (
              <p className="error-text">{errors.swiftCode}</p>
            )}

            <input
              name="bankAddress"
              placeholder="Bank Address"
              value={formData.bankAddress}
              onChange={handleChange}
            />
          </>
        )}

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
    </div>
  );
}

export default SendMoney;