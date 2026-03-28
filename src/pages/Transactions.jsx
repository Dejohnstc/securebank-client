import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "./Transactions.css";

function Transactions() {

  const navigate = useNavigate();

  const [transactions,setTransactions] = useState([]);
  const [user,setUser] = useState(null);
  const [error,setError] = useState("");

  // FILTERS
  const [category,setCategory] = useState("all");
  const [status,setStatus] = useState("all");
  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");

  // SEARCH
  const [search,setSearch] = useState("");

  useEffect(()=>{

    const token = localStorage.getItem("token");

    if(!token){
      navigate("/");
      return;
    }

    const loadData = async ()=>{

      try{

        const profileRes = await api.get("/api/user/profile");
        const txRes = await api.get("/api/transactions/history");

        setUser(profileRes.data);
        setTransactions(txRes.data || []);

      }catch(err){

        console.log(err);
        setError("Unable to load transactions");

        localStorage.removeItem("token");
        navigate("/");

      }

    };

    loadData();

  },[navigate]);


  if(!user) return <Loader message="Loading transactions..." />;


  // FILTER + SEARCH
  const filteredTransactions = transactions.filter((tx)=>{

    const isSender =
      tx.sender?._id === user._id ||
      tx.sender?.name === user.name;

    const otherName = isSender
      ? tx.receiver?.name || "Unknown"
      : tx.sender?.name || "Unknown";

    if(category === "sent" && !isSender) return false;
    if(category === "received" && isSender) return false;

    if(status !== "all" && tx.status !== status) return false;

    const txDate = new Date(tx.createdAt);
    if(startDate && txDate < new Date(startDate)) return false;
    if(endDate && txDate > new Date(endDate)) return false;

    if(search && !otherName.toLowerCase().includes(search.toLowerCase())){
      return false;
    }

    return true;
  });


  // 🔥 LIGHT ANALYSIS (ONLY SUMMARY)
  const now = new Date();

  let totalIn = 0;
  let totalOut = 0;

  transactions.forEach((tx) => {

    const date = new Date(tx.createdAt);

    if (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {

      const isSender =
        tx.sender?._id === user._id ||
        tx.sender?.name === user.name;

      if (tx.status === "completed") {
        if (isSender) {
          totalOut += Number(tx.amount || 0);
        } else {
          totalIn += Number(tx.amount || 0);
        }
      }

    }

  });


  // GROUPING
  const groupTransactions = () => {

    const groups = {};

    filteredTransactions.forEach((tx) => {

      const date = new Date(tx.createdAt);
      const today = new Date();

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = "";

      if (date.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      } else {
        label = date.toLocaleDateString();
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
    });

    return groups;
  };

  const grouped = groupTransactions();


  return(

    <div className="transactions-page">

      {/* HEADER */}
      <div className="transactions-header">
        <button onClick={()=>navigate("/dashboard")}>
          ← Back
        </button>
        <h2>Transaction History</h2>
      </div>

      {/* SEARCH */}
      <input
        className="tx-search"
        placeholder="Search transactions..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div className="tx-filters">

        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="sent">Sent</option>
          <option value="received">Received</option>
        </select>

        <select value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />

      </div>

      {/* 🔥 ANALYSIS CARD (CLEAN) */}
      <div className="tx-analysis">

        <div className="tx-analysis-left">
          <h3>
            {new Date().toLocaleString("default", {
              month: "short",
              year: "numeric"
            })}
          </h3>

          <p>
            In: ₦{totalIn.toLocaleString(undefined,{minimumFractionDigits:2})}
            &nbsp;&nbsp;
            Out: ₦{totalOut.toLocaleString(undefined,{minimumFractionDigits:2})}
          </p>
        </div>

        <button
          className="tx-analysis-btn"
          onClick={()=>navigate("/analytics")}
        >
          Analysis
        </button>

      </div>


      {error && <p className="error-message">{error}</p>}

      {Object.keys(grouped).length === 0 && (
        <p className="no-transactions">No transactions found.</p>
      )}


      {/* GROUPED */}
      {Object.keys(grouped).map((group)=>(

        <div key={group}>

          <h4 className="tx-group-title">{group}</h4>

          {grouped[group].map((tx)=>{

            const isSender =
              tx.sender?._id === user._id ||
              tx.sender?.name === user.name;

            const displayName = isSender
              ? tx.receiver?.name || "Unknown"
              : tx.sender?.name || "Unknown";

            return(

              <div
                key={tx._id}
                className="transaction-card opay-style"
                onClick={()=>navigate("/transaction-details", { state: { tx } })}
              >

                <div className={`tx-icon ${isSender ? "sent" : "received"}`}>
                  {isSender ? "↗" : "↘"}
                </div>

                <div className="tx-left">
                  <strong>{displayName}</strong>

                  <p>
                    {new Date(tx.createdAt).toLocaleTimeString([],{
                      hour:"2-digit",
                      minute:"2-digit"
                    })}
                  </p>
                </div>

                <div className="tx-right">

                  <div className={`tx-amount ${isSender ? "negative" : "positive"}`}>
                    {isSender ? "-" : "+"}$
                    {Number(tx.amount || 0).toLocaleString(undefined,{
                      minimumFractionDigits:2,
                      maximumFractionDigits:2
                    })}
                  </div>

                  <div className={`tx-status ${tx.status || "completed"}`}>
                    {tx.status || "completed"}
                  </div>

                </div>

              </div>

            );

          })}

        </div>

      ))}

    </div>

  );

}

export default Transactions;