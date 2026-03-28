import { useLocation, useNavigate } from "react-router-dom";
import "./Success.css";

function Success(){

const navigate = useNavigate();
const location = useLocation();

const data = location.state || {};

const name = data.name || "Recipient";
const amount = data.amount || 0;
const reference = data.reference || "TRX000000";

const today = new Date().toLocaleDateString();

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
<strong>{name} (...0304)</strong>
</div>

<div className="receipt-row">
<span>Wire from</span>
<strong>TOTAL CHECKING (...2281)</strong>
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
<strong>ALEX MARTINS</strong>
</div>

<div className="receipt-row">
<span>Address</span>
<strong>3825 Scott St 304,</strong>
</div>

<div className="receipt-row">
<span>City</span>
<strong>San Francisco, CA 94123</strong>
</div>

<div className="receipt-row">
<span>Country</span>
<strong>United States of America</strong>
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
<br/>
{/* 🔥 BUTTONS OUTSIDE PRINT AREA */}
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