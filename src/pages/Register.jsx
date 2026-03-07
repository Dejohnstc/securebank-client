import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register(){

const navigate = useNavigate();

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const handleRegister = async (e)=>{

e.preventDefault();

if(!name || !email || !password){
setError("Please fill all fields");
return;
}

try{

setLoading(true);
setError("");

await api.post("/api/auth/register",{name,email,password});

alert("Account created successfully");

navigate("/");

}catch(err){

setError(err.response?.data?.message || "Registration failed");

}finally{

setLoading(false);

}

};

return(

<div className="register-page">

<div className="register-card">

<h2>Create Account</h2>

<form onSubmit={handleRegister}>

<label>Full Name</label>
<input
type="text"
placeholder="Enter your full name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<label>Email</label>
<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<label>Password</label>
<input
type="password"
placeholder="Create password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

{error && <div className="register-error">{error}</div>}

<button className="register-btn" disabled={loading}>
{loading ? "Creating..." : "Create Account"}
</button>

</form>

<p className="register-back">
Already have an account?
<span onClick={()=>navigate("/")}> Login</span>
</p>

</div>

</div>

);

}

export default Register;