import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/api";
import "./Cards.css";

function Cards() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [cardFrozen, setCardFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [limit, setLimit] = useState(5000);

  const [cardData, setCardData] = useState(null); // 🔥 NEW

  const correctPin = "070362";

  /* =========================
     GENERATE CARD
  ========================= */

  const generateCard = () => {
    const randomDigits = () =>
      Math.floor(1000 + Math.random() * 9000);

    const number = `5${randomDigits()} ${randomDigits()} ${randomDigits()} ${randomDigits()}`;

    const expiryYear = new Date().getFullYear() + 3;
    const expiry = `12/${expiryYear.toString().slice(-2)}`;

    const cvv = Math.floor(100 + Math.random() * 900);

    return {
      number,
      expiry,
      cvv
    };
  };

  /* =========================
     LOAD USER + CARD
  ========================= */

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/user/profile");
        setUser(res.data);

        // 🔥 LOAD OR CREATE CARD
        const stored = localStorage.getItem(`card_${res.data._id}`);

        if (stored) {
          setCardData(JSON.parse(stored));
        } else {
          const newCard = generateCard();
          localStorage.setItem(
            `card_${res.data._id}`,
            JSON.stringify(newCard)
          );
          setCardData(newCard);
        }

      } catch  {
        console.error("Failed to load user");
      }
    };

    load();
  }, []);

  const handleFreeze = () => {
    setCardFrozen(!cardFrozen);
  };

  const handleReveal = () => {
    setShowPinModal(true);
  };

  const confirmPin = () => {
    if (pin === correctPin) {
      setShowDetails(true);
      setShowPinModal(false);
      setPin("");
    } else {
      alert("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <div className="cards-page">

      {/* HEADER */}
      <div className="cards-header">
        <button onClick={() => navigate("/dashboard")}>←</button>
        <h2>My Cards</h2>
        <div />
      </div>

      {/* CARD */}
      <div className="card-visual">

        <div className="card-bank">SecureBank</div>

        <div className="card-network">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
          />
        </div>

        <div className="card-chip"></div>

        <div className="card-number">
          {cardData
            ? showDetails
              ? cardData.number
              : "•••• •••• •••• " + cardData.number.slice(-4)
            : "Loading..."}
        </div>

        <div className="card-bottom">

          <div>
            <span>Card Holder</span>
            <p>{user ? user.name : "Loading..."}</p>
          </div>

          <div>
            <span>Expires</span>
            <p>
              {showDetails && cardData
                ? cardData.expiry
                : "**/**"}
            </p>
          </div>

          <div>
            <span>CVV</span>
            <p>
              {showDetails && cardData
                ? cardData.cvv
                : "***"}
            </p>
          </div>

        </div>

      </div>

      {/* STATUS */}
      <div className="card-status">
        Status:
        <span className={cardFrozen ? "frozen" : "active"}>
          {cardFrozen ? " Frozen" : " Active"}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="card-actions">

        <button onClick={handleFreeze}>
          {cardFrozen ? "Unfreeze Card" : "Freeze Card"}
        </button>

        <button onClick={handleReveal}>
          View Card Details
        </button>

        <button>Change Card PIN</button>
        <button>Report Lost Card</button>
        <button>Request Replacement</button>

      </div>

      {/* LIMIT */}
      <div className="limit-section">

        <h3>Daily Spending Limit</h3>

        <input
          type="range"
          min="500"
          max="20000"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />

        <p>${Number(limit).toLocaleString()}</p>

      </div>

      {/* VIRTUAL */}
      <div className="virtual-card">

        <h3>Virtual Card</h3>

        <p>Use your virtual card for secure online purchases.</p>

        <button>Generate Virtual Card</button>

      </div>

      {/* WALLET */}
      <div className="wallet-section">

        <h3>Digital Wallet</h3>

        <button>Add to Apple Pay</button>
        <button>Add to Google Pay</button>

      </div>

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
                  onClick={() => pin.length < 6 && setPin(pin + num)}
                >
                  {num}
                </button>
              ))}

              <button onClick={() => setPin(pin.slice(0,-1))}>⌫</button>

              <button onClick={() => pin.length < 6 && setPin(pin + "0")}>
                0
              </button>

              <button onClick={confirmPin}>
                OK
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cards;