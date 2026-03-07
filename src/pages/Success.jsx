import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./Success.css";

function Success(){

const navigate = useNavigate();
const location = useLocation();

const { name, amount, reference } = location.state || {};

const downloadReceipt = () => {

const doc = new jsPDF();

doc.setFontSize(18);
doc.text("SecureBank Payment Receipt",20,20);

doc.setFontSize(12);

doc.text(`Reference: ${reference}`,20,40);
doc.text(`Recipient: ${name}`,20,50);
doc.text(`Amount: $${Number(amount).toLocaleString(undefined,{
minimumFractionDigits:2,
maximumFractionDigits:2
})}`,20,60);

doc.text(`Date: ${new Date().toLocaleString()}`,20,70);

doc.text("Status: Completed",20,80);

doc.save(`receipt-${reference}.pdf`);

};

return(

<div className="success-page">

<div className="success-card">

<h2>Transfer Successful</h2>

<p className="success-reference">
Reference: {reference}
</p>

<p>
Sent to <strong>{name}</strong>
</p>

<h3>
$
{Number(amount).toLocaleString(undefined,{
minimumFractionDigits:2,
maximumFractionDigits:2
})}
</h3>

<div className="success-actions">

<button onClick={downloadReceipt}>
Download Receipt
</button>

<button onClick={()=>navigate("/dashboard")}>
Back to Dashboard
</button>

</div>

</div>

</div>

);

}

export default Success;