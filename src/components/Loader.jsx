import "./Loader.css";

function Loader({ message = "SecureBank is processing your request..." }) {

return (

<div className="secure-loader">

<div className="loader-card">

<div className="loader-spinner"></div>

<h3>SecureBank</h3>

<p>{message}</p>

</div>

</div>

);

}

export default Loader;