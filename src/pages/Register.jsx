import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register(){

const navigate = useNavigate();

/* STEP CONTROL */
const [step,setStep] = useState(1);

const [form,setForm] = useState({
name:"",
email:"",
password:"",
phone:"",
address:"",
city:"",
state:"",
country:"",
zip:""
});

const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

/* HANDLE INPUT */
const handleChange = (e)=>{
const {name,value} = e.target;

setForm({
...form,
[name]:value
});
};

/* VALIDATION */
const validateStep = ()=>{

if(step === 1){
if(!form.name || !form.email || !form.password){
return "Fill all required fields";
}
}

if(step === 2){
if(!form.phone || !form.address || !form.city){
return "Complete address details";
}
}

return null;
};

/* NEXT STEP */
const nextStep = ()=>{
const err = validateStep();
if(err){
setError(err);
return;
}
setError("");
setStep(step+1);
};

/* PREVIOUS */
const prevStep = ()=> setStep(step-1);

/* SUBMIT */
const handleRegister = async ()=>{

try{

setLoading(true);
setError("");

await api.post("/api/auth/register",form);

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

<h2>Create SecureBank Account</h2>

{/* 🔥 PROGRESS BAR */}
<div className="progress-container">
  <div
    className="progress-bar"
    style={{ width: `${(step / 3) * 100}%` }}
  ></div>
</div>

{/* 🔥 STEP INDICATOR */}
<div style={{marginBottom:"15px",fontSize:"13px",color:"#666"}}>
Step {step} of 3
</div>

{/* 🔥 ANIMATED STEP CONTAINER */}
<div className="step-container">

{/* STEP 1 */}
{step === 1 && (
<div className="step fade">

<label>Full Name</label>
<input name="name" value={form.name} onChange={handleChange}/>

<label>Email</label>
<input name="email" value={form.email} onChange={handleChange}/>

<label>Password</label>
<input type="password" name="password" value={form.password} onChange={handleChange}/>

</div>
)}

{/* STEP 2 */}
{step === 2 && (
<div className="step fade">

<label>Phone</label>
<input name="phone" value={form.phone} onChange={handleChange}/>

<label>Address</label>
<input name="address" value={form.address} onChange={handleChange}/>

<label>City</label>
<input name="city" value={form.city} onChange={handleChange}/>

<label>State</label>
<input name="state" value={form.state} onChange={handleChange}/>

<label>Country</label>
<input name="country" value={form.country} onChange={handleChange}/>

<label>ZIP</label>
<input name="zip" value={form.zip} onChange={handleChange}/>

</div>
)}

{/* STEP 3 */}
{step === 3 && (
<div className="step fade">

<h4>Review Details</h4>

<p><strong>Name:</strong> {form.name}</p>
<p><strong>Email:</strong> {form.email}</p>
<p><strong>Phone:</strong> {form.phone}</p>
<p><strong>Address:</strong> {form.address}, {form.city}</p>

</div>
)}

</div>

{/* ERROR */}
{error && <div className="register-error">{error}</div>}

{/* BUTTONS */}
<div style={{display:"flex",gap:"10px",marginTop:"20px"}}>

{step > 1 && (
<button onClick={prevStep} className="register-btn">
Back
</button>
)}

{step < 3 ? (
<button onClick={nextStep} className="register-btn">
Next
</button>
) : (
<button onClick={handleRegister} className="register-btn" disabled={loading}>
{loading ? "Creating..." : "Create Account"}
</button>
)}

</div>

<p className="register-back">
Already have an account?
<span onClick={()=>navigate("/")}> Login</span>
</p>

</div>

</div>

);

}

export default Register;