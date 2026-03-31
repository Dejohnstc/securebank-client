import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import "./Success.css";

function Success(){

const navigate = useNavigate();
const location = useLocation();

const [user, setUser] = useState(null);
const [cardLast4, setCardLast4] = useState("****");

/* 🔥 RECEIVER STATE (NEW) */
const [receiver,setReceiver] = useState(null);

const data = location.state || {};

const name = data.name || "Recipient";
const email = data.email || "";
const amount = data.amount || 0;
const reference = data.reference || "TRX000000";

const today = new Date().toLocaleDateString();

/* 🔥 LOAD USER + CARD + RECEIVER */
useEffect(() => {
  const loadAll = async () => {
    try {

      // 🔥 LOAD SENDER
      const res = await api.get("/api/user/profile");
      setUser(res.data);

      const stored = localStorage.getItem(`card_${res.data._id}`);

      if (stored) {
        const parsed = JSON.parse(stored);
        setCardLast4(parsed.number.slice(-4));
      }

      // 🔥 LOAD RECEIVER FROM DB (IF EMAIL EXISTS)
      if(email){
        try{
          const r = await api.get(`/api/user/by-email/${email}`);
          setReceiver(r.data);
        }catch{
          setReceiver({ name }); // fallback
        }
      }

    } catch  {
      console.log("Load failed");
    }
  };

  loadAll();
}, [email, name]);

return(

<div className="receipt-page">

<div className="receipt-card" id="print-area">

<div className="receipt-header">

<h1>SECUREBANK</h1>
<p>Printed from SecureBank checking Online</p>

</div>

<hr/>

<div className="success-message">

<h3>✔ We've scheduled your wire.</h3>
<p>Please print and save this page for your records.</p>

</div>

<h4 className="section-title">Account details</h4>

<div className="receipt-row">
<span>Wire to</span>
<strong>
{receiver?.name || name} (...{String(receiver?.name || name).slice(-4)})
</strong>
</div>

<div className="receipt-row">
<span>Wire from</span>
<strong>
TOTAL CHECKING (...{cardLast4})
</strong>
</div>

<div className="receipt-row">
<span>Wire status</span>
<strong>In transit</strong>
</div>

<div className="receipt-row">
<span>Transaction number</span>
<strong>{reference}</strong>
</div>

<h4 className="section-title">Sender information</h4>

<div className="receipt-row">
<span>Sender</span>
<strong>{user ? user.name : "Loading..."}</strong>
</div>

{/* 🔥 REAL ADDRESS FROM DB */}
<div className="receipt-row">
<span>Address</span>
<strong>{user?.address || "Not available"}</strong>
</div>

<div className="receipt-row">
<span>City</span>
<strong>
{user?.city || ""} {user?.state || ""} {user?.zip || ""}
</strong>
</div>

<div className="receipt-row">
<span>Country</span>
<strong>{user?.country || "Not available"}</strong>
</div>

<div className="receipt-row">
<span>Wire tracking number</span>
<strong>{reference}</strong>
</div>

<div className="receipt-row">
<span>Wire date</span>
<strong>{today}</strong>
</div>

<div className="receipt-row">
<span>Exchange rate</span>
<strong>SCB rate $1.00 USD</strong>
</div>

<h4 className="section-title">Wire amount</h4>

<div className="receipt-row">
<span>Wire amount</span>
<strong>${Number(amount).toFixed(2)}</strong>
</div>

<div className="receipt-row">
<span>Amount debited</span>
<strong>${Number(amount).toFixed(2)}</strong>
</div>

<div className="receipt-row">
<span>Outgoing wire transfer fee</span>
<strong>$5.00 USD</strong>
</div>

<div className="receipt-row">
<span>Outgoing wire transfer tax</span>
<strong>$0.00 USD</strong>
</div>

<hr/>

<div className="receipt-total">
<span>Total</span>
<strong>${(Number(amount)+5).toFixed(2)} USD</strong>
</div>

<p className="receipt-note">
Your account activity will show separate charges for wire amount and wire transfer fee.
</p>

</div>

{/* 🔥 BUTTONS */}
<div className="receipt-buttons no-print">

<button onClick={()=>window.print()}>
Print Receipt
</button>

<button onClick={()=>navigate("/dashboard")}>
Back to Dashboard
</button>

</div>

</div>

);

}

export default Success;