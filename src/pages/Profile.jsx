import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "./Profile.css";

function Profile() {

const navigate = useNavigate();

const [user,setUser] = useState(null);
const [photo,setPhoto] = useState(null);

const [showPasswordModal,setShowPasswordModal] = useState(false);
const [newPassword,setNewPassword] = useState("");

const [faceIdEnabled,setFaceIdEnabled] = useState(
localStorage.getItem("faceId") === "true"
);

const [notifications,setNotifications] = useState({
transactions:true,
security:true,
deposits:true
});


/* LOAD PROFILE */

useEffect(()=>{

const loadProfile = async ()=>{

try{

const res = await api.get("/api/user/profile");

setUser(res.data);

/* LOAD SAVED PHOTO */

const savedPhoto = localStorage.getItem(`profilePhoto_${res.data._id}`);

if(savedPhoto){
setPhoto(savedPhoto);
}

}catch(err){

console.error(err);

localStorage.removeItem("token");
navigate("/");

}

};

loadProfile();

},[navigate]);



/* PHOTO UPLOAD */

const handlePhoto = (e)=>{

const file = e.target.files[0];
if(!file || !user) return;

const reader = new FileReader();

reader.onloadend = ()=>{

const imageData = reader.result;

setPhoto(imageData);

/* SAVE PHOTO PER USER */

localStorage.setItem(
`profilePhoto_${user._id}`,
imageData
);

};

reader.readAsDataURL(file);

};



/* DELETE PHOTO */

const deletePhoto = ()=>{

if(!user) return;

setPhoto(null);

localStorage.removeItem(`profilePhoto_${user._id}`);

};



/* CHANGE PASSWORD */

const changePassword = async ()=>{

if(!newPassword){
alert("Enter new password");
return;
}

try{

await api.post("/api/auth/change-password",{
password:newPassword
});

alert("Password updated");

setShowPasswordModal(false);
setNewPassword("");

}catch{

alert("Password update failed");

}

};



/* TOGGLE FACE ID */

const toggleFaceId = ()=>{

const state = !faceIdEnabled;

setFaceIdEnabled(state);
localStorage.setItem("faceId",state);

};



/* TOGGLE NOTIFICATIONS */

const toggleNotification = (type)=>{

setNotifications(prev=>({
...prev,
[type]:!prev[type]
}));

};



if(!user) return <Loader message="Loading profile..." />;



return(

<div className="profile-page">

{/* HEADER */}

<div className="profile-header">

<button  onClick={()=>navigate("/dashboard")}>
←
</button>

<h2>Profile</h2>

<div/>

</div>


{/* PROFILE CARD */}

<div className="profile-card">

<div className="profile-photo-section">

<div className="profile-photo">

{photo ? (
<img src={photo} alt="profile"/>
):(
<span>{user.name?.charAt(0)}</span>
)}

</div>

<div className="photo-buttons">

<label className="upload-btn">
Upload
<input
type="file"
accept="image/*"
onChange={handlePhoto}
hidden
/>
</label>

<button
className="delete-photo"
onClick={deletePhoto}
>
Delete
</button>

</div>

</div>


<div className="profile-info">

<div className="profile-row">
<span>Full Name</span>
<strong>{user.name}</strong>
</div>

<div className="profile-row">
<span>Email</span>
<strong>{user.email}</strong>
</div>

<div className="profile-row">
<span>Account Number</span>
<strong>{user.accountNumber}</strong>
</div>

<div className="profile-row">
<span>Routing Number</span>
<strong>{user.routingNumber}</strong>
</div>

<div className="profile-row">
<span>Account Type</span>
<strong>Total Checking</strong>
</div>

<div className="profile-row">
<span>Balance</span>
<strong>
${Number(user.balance).toLocaleString(undefined,{
minimumFractionDigits:2,
maximumFractionDigits:2
})}
</strong>
</div>

</div>

</div>



{/* ACCOUNT INFORMATION */}

<div className="profile-section">

<h3>Account Information</h3>

<div className="profile-row">
{/* <span>Member Since</span>
<strong>{new Date(user.createdAt).toLocaleDateString()}</strong> */}
</div>

<div className="profile-row">
<span>Account Status</span>
<strong>Active</strong>
</div>

<div className="profile-row">
<span>Branch Routing</span>
<strong>{user.routingNumber}</strong>
</div>

</div>



{/* SECURITY */}

<div className="profile-section">

<h3>Security Center</h3>

<button
className="profile-action"
onClick={()=>{

const newPin = prompt("Enter new 6 digit PIN");

if(!newPin) return;

api.post("/api/user/change-pin",{pin:newPin})
.then(()=>alert("Transaction PIN updated"))
.catch(()=>alert("PIN update failed"));

}}
>
Change Transaction PIN
</button>

<div className="toggle-row">

<span>Enable Face ID / Biometrics</span>

<input
type="checkbox"
checked={faceIdEnabled}
onChange={toggleFaceId}
/>

</div>

<button className="profile-action">
View Device Login History
</button>

</div>



{/* LOGIN ACTIVITY */}

<div className="profile-section">

<h3>Login Activity</h3>

<div className="profile-row">
<span>Last Login</span>
<strong>{new Date().toLocaleString()}</strong>
</div>

<div className="profile-row">
<span>Device</span>
<strong>
{navigator.userAgent.includes("Chrome")
? "Chrome Browser"
: "Browser"}
</strong>
</div>

<div className="profile-row">
<span>Location</span>
<strong>SecureBank Online</strong>
</div>

</div>



{/* NOTIFICATIONS */}

<div className="profile-section">

<h3>Notifications</h3>

<div className="toggle-row">

<span>Transaction Alerts</span>

<input
type="checkbox"
checked={notifications.transactions}
onChange={()=>toggleNotification("transactions")}
/>

</div>

<div className="toggle-row">

<span>Security Alerts</span>

<input
type="checkbox"
checked={notifications.security}
onChange={()=>toggleNotification("security")}
/>

</div>

<div className="toggle-row">

<span>Deposit Alerts</span>

<input
type="checkbox"
checked={notifications.deposits}
onChange={()=>toggleNotification("deposits")}
/>

</div>

</div>



{/* DOCUMENTS */}

<div className="profile-section">

<h3>Documents</h3>

<button
className="profile-action"
onClick={()=>window.open(
"https://www.chase.com/content/dam/chase-ux/documents/personal/checking/sample-statement.pdf"
)}
>
Download Account Statement
</button>

<button className="profile-action">
Account Verification Letter
</button>

</div>



{/* LOGOUT */}

<button
className="logout-btn-profile"
onClick={()=>{

localStorage.removeItem("token");
navigate("/");

}}
>
Logout
</button>



{/* PASSWORD MODAL */}

{showPasswordModal && (

<div className="modal-overlay">

<div className="password-modal">

<h3>Change Password</h3>

<input
type="password"
placeholder="New password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
/>

<button onClick={changePassword}>
Update Password
</button>

<button
className="cancel-btn"
onClick={()=>setShowPasswordModal(false)}
>
Cancel
</button>

</div>

</div>

)}

</div>

);

}

export default Profile;