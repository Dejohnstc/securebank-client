import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register(){

const navigate = useNavigate();

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

/* 🔥 HANDLE CHANGE */
const handleChange = (e)=>{
  const {name,value} = e.target;

  setForm({
    ...form,
    [name]: value
  });
};

/* 🔥 VALIDATION */
const validate = ()=>{

  if(!form.name || !form.email || !form.password){
    return "Name, email and password are required";
  }

  if(form.password.length < 6){
    return "Password must be at least 6 characters";
  }

  if(form.phone && form.phone.length < 7){
    return "Invalid phone number";
  }

  return null;
};

/* 🔥 REGISTER */
const handleRegister = async (e)=>{

  e.preventDefault();

  const validationError = validate();

  if(validationError){
    setError(validationError);
    return;
  }

  try{

    setLoading(true);
    setError("");

    await api.post("/api/auth/register",{
      name: form.name,
      email: form.email,
      password: form.password,

      // 🔥 EXTRA DATA (SAFE FOR NOW)
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      zip: form.zip
    });

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

<form onSubmit={handleRegister}>

{/* NAME */}
<label>Full Name</label>
<input
type="text"
name="name"
placeholder="Enter your full name"
value={form.name}
onChange={handleChange}
/>

{/* EMAIL */}
<label>Email</label>
<input
type="email"
name="email"
placeholder="Enter your email"
value={form.email}
onChange={handleChange}
/>

{/* PASSWORD */}
<label>Password</label>
<input
type="password"
name="password"
placeholder="Create password"
value={form.password}
onChange={handleChange}
/>

{/* PHONE */}
<label>Phone Number</label>
<input
type="tel"
name="phone"
placeholder="+1 234 567 890"
value={form.phone}
onChange={handleChange}
/>

{/* ADDRESS */}
<label>Address</label>
<input
type="text"
name="address"
placeholder="Street address"
value={form.address}
onChange={handleChange}
/>

{/* CITY */}
<label>City</label>
<input
type="text"
name="city"
placeholder="City"
value={form.city}
onChange={handleChange}
/>

{/* STATE */}
<label>State</label>
<input
type="text"
name="state"
placeholder="State"
value={form.state}
onChange={handleChange}
/>

{/* COUNTRY */}
<label>Country</label>
<input
type="text"
name="country"
placeholder="Country"
value={form.country}
onChange={handleChange}
/>

{/* ZIP */}
<label>ZIP / Postal Code</label>
<input
type="text"
name="zip"
placeholder="ZIP code"
value={form.zip}
onChange={handleChange}
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