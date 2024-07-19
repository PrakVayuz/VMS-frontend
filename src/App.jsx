import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SignIn } from "@/pages/auth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SignUp from "./pages/auth/sign-up";
import SignInVendor from "./pages/auth/sign-in-vendor";
import VendorDashboard from "./pages/dashboard/VendorDashboard";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/vendor/dashboard/" element={<VendorDashboard />} />
      
      <Route path="/auth/*" element={<Auth />} />
       <Route path="/auth/sign-in" element={<SignIn />} /> 
       <Route path="/vendor/sign-in" element={<SignInVendor />} /> 
       <Route path="/auth/sign-up" element={<SignUp />} /> 
       <Route path="/auth/forgot-password" element={<ForgotPassword />} /> 
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
