import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";
import AboutUs from "./components/AboutUs";
import Interview from "./pages/Interview";
import Codes from "./pages/Codes";
import Auth from "./AuthComponent.jsx/Auth";
import OtpVerify from "./AuthComponent.jsx/OtpVerify";
import ResetPassword from "./AuthComponent.jsx/ResetPassword";
import ForgotPassword from "./AuthComponent.jsx/ForgotPassword";
import Footer from "./components/footer";
import Features from "./HomeComponents/Features";
import InterviewEntry from "./InterviewComponent/Real/InterviewEntry";
import Host from "./InterviewComponent/Real/Host";
import Client from "./InterviewComponent/Real/Client";
import AIInterviewSetup from "./InterviewComponent/AI/AIInterviewSetup";
import AIInterviewPage from "./InterviewComponent/AI/AIInterviewPage";
// import UploadResume from "./pages/UploadResume";

function App() {
  const { isLoggedin, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col text-white bg-linear-to-b from-black  to-black overflow-x-hidden">
      
      
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-24 left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-24 right-24 w-65 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <Navbar />

      
      <main className="relative z-20 flex-1 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={!isLoggedin ? <Auth /> : <Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/code" element={<Codes />} />
          <Route path="/real/host/:roomId" element={<Host />} />
          <Route path="/real/client/:roomId" element={<Client />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/interview-entry" element={<InterviewEntry />} />
          <Route path="/ai-interview" element={<AIInterviewSetup />} />
          <Route path="/ai-interview/session" element={<AIInterviewPage />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
