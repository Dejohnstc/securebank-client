import "./PayBills.css";

function PayBills() {
  const bills = [
    { name: "Electricity", icon: "💡" },
    { name: "Water", icon: "🚿" },
    { name: "Internet", icon: "🌐" },
    { name: "Mobile", icon: "📱" },
    { name: "TV Subscription", icon: "📺" },
    { name: "Insurance", icon: "🛡️" }
  ];

  return (
    <div className="bills-container">
      <h2>Pay Bills</h2>

      <div className="bills-grid">
        {bills.map((bill, index) => (
          <div key={index} className="bill-card">
            <div className="bill-icon">{bill.icon}</div>
            <div className="bill-name">{bill.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PayBills;