import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cards from "./pages/Cards";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import SendMoney from "./pages/SendMoney";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLimits from "./pages/AdminLimits";
import Zelle from "./pages/Zelle";
import PayBills from "./pages/PayBills";
import ZelleReview from "./pages/ZelleReview";
import ZelleSuccess from "./pages/ZelleSuccess";
import ReviewTransfer from "./pages/ReviewTransfer";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import TransferFailed from "./pages/TransferFailed";
import TransferSuccess from "./pages/TransferSuccess";




function App() {
  return (
    
    <Router>

      

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Wire Transfer */}
        <Route
          path="/send-money"
          element={
            <ProtectedRoute>
              <SendMoney />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review-transfer"
          element={
            <ProtectedRoute>
              <ReviewTransfer />
            </ProtectedRoute>
          }
        />

        {/* Zelle */}
        <Route
          path="/zelle"
          element={
            <ProtectedRoute>
              <Zelle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/zelle-review"
          element={
            <ProtectedRoute>
              <ZelleReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/zelle-success"
          element={
            <ProtectedRoute>
              <ZelleSuccess />
            </ProtectedRoute>
          }
        />

        {/* Success */}
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/transfer-success" element={<TransferSuccess />} />
<Route path="/transfer-failed" element={<TransferFailed />} />
<Route path="/admin/limits" element={<AdminLimits />} />

        {/* Transactions */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Cards */}
        <Route
          path="/cards"
          element={
            <ProtectedRoute>
              <Cards />
            </ProtectedRoute>
          }
        />

        {/* Pay Bills */}
        <Route
          path="/pay-bills"
          element={
            <ProtectedRoute>
              <PayBills />
            </ProtectedRoute>
          }
        />
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;