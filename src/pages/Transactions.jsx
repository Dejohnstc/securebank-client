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


  return(

    <div className="transactions-page">

      {/* HEADER */}

      <div className="transactions-header">

        <button onClick={()=>navigate("/dashboard")}>
          ← Back
        </button>

        <h2>Transaction History</h2>

      </div>


      {error && (
        <p className="error-message">{error}</p>
      )}


      {transactions.length === 0 && (
        <p className="no-transactions">No transactions found.</p>
      )}


      {transactions.map((tx)=>{

        const isSender =
          tx.sender?._id === user._id ||
          tx.sender?.name === user.name;

        return(

          <div key={tx._id} className="transaction-card">

            {/* LEFT */}

            <div className="tx-left">

              <strong>

                {isSender
                  ? `Sent to ${tx.receiver?.name || "Unknown"}`
                  : `Received from ${tx.sender?.name || "Unknown"}`
                }

              </strong>

              <p>

                {tx.createdAt &&
                  `${new Date(tx.createdAt).toLocaleDateString()} · ${new Date(tx.createdAt).toLocaleTimeString([],{
                    hour:"2-digit",
                    minute:"2-digit"
                  })}`
                }

              </p>

            </div>


            {/* RIGHT */}

            <div className="tx-right">

              <div
                className={`tx-amount ${
                  isSender ? "negative" : "positive"
                }`}
              >

                {isSender ? "-" : "+"}$

                {Number(tx.amount || 0).toLocaleString(undefined,{
                  minimumFractionDigits:2,
                  maximumFractionDigits:2
                })}

              </div>


              {/* STATUS */}

              <div className={`tx-status ${tx.status || "completed"}`}>
                {tx.status || "completed"}
              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default Transactions;