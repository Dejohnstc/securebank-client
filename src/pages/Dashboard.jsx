import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideBalance,setHideBalance] = useState(false);

  useEffect(() => {

  window.scrollTo(0,0); // scroll page to top

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

    const loadData = async () => {
      try {
        const profileRes = await api.get("/api/user/profile");

        const txRes = await api.get("/api/transactions/history");

        setUser(profileRes.data);
        setTransactions(txRes.data.slice(0, 2));
      } catch {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    loadData();
  }, [navigate]);

  if (!user) return <Loader message="Loading your accounts..." />;

  const hour = new Date().getHours();
  let greetingText;

  if (hour < 12) greetingText = "Good morning";
  else if (hour < 17) greetingText = "Good afternoon";
  else greetingText = "Good evening";

  return (
    <div className="dashboard">

      {/* HEADER */}
      
      <div className="top-navbar">
        <div className="greeting">
          {greetingText} {user.name}
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDE MENU */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>

  <button
    className="menu-item"
    onClick={() => {
      setMenuOpen(false);
      navigate("/dashboard");
    }}
  >
    Dashboard
  </button>

  <button
    className="menu-item"
    onClick={() => {
      setMenuOpen(false);
      navigate("/send-money");
    }}
  >
    Send Money
  </button>

  <button
    className="menu-item"
    onClick={() => {
      setMenuOpen(false);
      navigate("/pay-bills");
    }}
  >
    Pay Bills
  </button>

  <button
    className="menu-item"
    onClick={() => {
      setMenuOpen(false);
      navigate("/zelle");
    }}
  >
    Send with Zelle
  </button>

  <button
    className="menu-item"
    onClick={() => {
      setMenuOpen(false);
      navigate("/transactions");
    }}
  >
    Transactions History
  </button>

  <button
    className="menu-item logout"
    onClick={() => {
      localStorage.removeItem("token");
      navigate("/");
    }}
  >
    Logout
  </button>

</div>

      {/* ACCOUNT CARD */}
      <div className="account-card">
        <div className="account-header">
  <span className="fonter">
    SECUREBANK <span className="cch"></span> CHECKING
  </span>

  <span>
    •••• {user.accountNumber?.slice(-4)}
  </span>
</div>

        <div className="balance">
          <h3 className="balance-row">

            <button
              className="eye-btn"
              onClick={() => setHideBalance(!hideBalance)}
            >
              {hideBalance ? "👁‍🗨" : "👁"}
            </button>

            {hideBalance
              ? "••••••••"
              : `$${user.balance.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2
              })}`
            }

          </h3>
        </div>

        <div className="balance-label">
          Available balance
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="actions">
        <button onClick={() => navigate("/send-money")}>
          Send money
        </button>

        <button>
          Deposit checks
        </button>

        <button onClick={() => navigate("/pay-bills")}>
          Pay a bill
        </button>
      </div>

      {/* SPENDING SUMMARY */}
      <div className="summary">

        <div className="summary-top">
          <span>Spending summary</span>

          <span
            className="view-all"
            onClick={() => navigate("/transactions")}
          >
            View all
          </span>
        </div>

        {transactions.map((tx) => {

          const isSender = tx.sender?.name === user.name;

          return (
            <div key={tx._id} className="summary-row">

              <div>
                <div className="tx-title">
                  {isSender
                    ? `Sent to ${tx.receiver?.name}`
                    : `Received from ${tx.sender?.name}`}
                </div>

                <div className="tx-date">
                  {new Date(tx.createdAt).toLocaleDateString()} ·{" "}
                  {new Date(tx.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div
                className={`amount ${
                  isSender ? "negative" : "positive"
                }`}
              >
                {isSender ? "-" : "+"}${tx.amount}
              </div>

            </div>
          );

        })}
      </div>

      {/* BOTTOM NAVIGATION */}

      <div className="bottom-nav">

        <div
          className={`nav-item ${
            window.location.pathname === "/dashboard"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/dashboard")}
        >
          <span>🏠</span>
          <p>Home</p>
        </div>

        <div
          className={`nav-item ${
            window.location.pathname === "/zelle"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/zelle")}
        >
          <span>💸</span>
          <p>Zelle</p>
        </div>

        <div
          className={`nav-item ${
            window.location.pathname === "/cards"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/cards")}
        >
          <span>💳</span>
          <p>Cards</p>
        </div>

        <div
          className={`nav-item ${
            window.location.pathname === "/profile"
              ? "active"
              : ""
          }`}
          onClick={() => navigate("/profile")}
        >
          <span>👤</span>
          <p>Profile</p>
        </div>

      </div>

      {/* FINANCIAL SERVICES */}

      <div className="services-section">

        <h3>Explore Financial Services</h3>

        <div className="services-grid">

          <div className="service-card">
            <h4>Open an Account</h4>
            <p>Open savings, credit card or business account.</p>

            <button onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>

          <div className="service-card">
            <h4>Invest with J.P. Morgan</h4>
            <p>Grow your money with guided investing.</p>

            <button
              onClick={() =>
                window.open(
                  "https://www.jpmorgan.com/investments",
                  "_blank"
                )
              }
            >
              Invest Now
            </button>
          </div>

          <div className="service-card">
            <h4>Check Your Credit Score</h4>
            <p>Monitor and improve your credit health.</p>

            <button
              onClick={() =>
                window.open(
                  "https://www.experian.com/consumer-products/free-credit-report.html",
                  "_blank"
                )
              }
            >
              View Score
            </button>
          </div>

          <div className="service-card">
            <h4>Rewards Center</h4>
            <p>Redeem cashback and rewards.</p>

            <button
              onClick={() =>
                window.open(
                  "https://www.chase.com/personal/credit-cards/rewards",
                  "_blank"
                )
              }
            >
              View Rewards
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;