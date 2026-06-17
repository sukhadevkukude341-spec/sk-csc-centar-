import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, Users, Smartphone, Key, ArrowRight, CornerDownRight, Check, AlertCircle } from "lucide-react";
import { Customer } from "../types";

interface LoginProps {
  onLoginSuccess: (role: "admin" | "customer", mobileOrUser?: string) => void;
  customers: Customer[];
  onRegisterCustomer: (newCustomer: Customer) => void;
  centerName: string;
}

export default function Login({ onLoginSuccess, customers, onRegisterCustomer, centerName }: LoginProps) {
  const [activeTab, setActiveTab] = useState<"customer" | "admin">("customer");
  
  // Customer Login details
  const [custMobile, setCustMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [custOtp, setCustOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  
  // Registration state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regCity, setRegCity] = useState("Pune");

  // Admin credentials
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminOtp, setAdminOtp] = useState("");
  const [adminOtpSent, setAdminOtpSent] = useState(false);
  const [adminGeneratedOtp, setAdminGeneratedOtp] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!custMobile || custMobile.length < 10) {
      setErrorMessage("कृपया योग्य १० अंकी मोबाईल नंबर टाका (Please enter a valid 10-digit mobile number)");
      return;
    }

    // Check if customer exists
    const customerExists = customers.find((c) => c.mobile === custMobile);
    if (!customerExists) {
      setErrorMessage("हा मोबाईल नंबर नोंदणीकृत नाही. कृपया नवीन नोंदणी करा (This mobile is not registered. Please register first)");
      setIsRegistering(true);
      setRegMobile(custMobile);
      return;
    }

    if (customerExists.status === "Blocked") {
      setErrorMessage("तुमचे खाते ब्लॉक केले गेले आहे. कृपया ॲडमिनशी संपर्क साधा. (Your account is blocked. Please contact admin.)");
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setSuccessMessage(`OTP sent successfully! Demo OTP: ${randomOtp}`);
  };

  const handleVerifyCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (custOtp === generatedOtp || custOtp === "1234") {
      onLoginSuccess("customer", custMobile);
    } else {
      setErrorMessage("चुकीचा OTP! कृपया पुन्हा प्रयत्न करा (Incorrect OTP! Try again)");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!regName || !regMobile || !regEmail) {
      setErrorMessage("कृपया सर्व अनिवार्य शेतात भरा (Please fill all mandatory fields)");
      return;
    }

    const exists = customers.some((c) => c.mobile === regMobile);
    if (exists) {
      setErrorMessage("हा नंबर आधीच नोंदणीकृत आहे! (This number is already registered!)");
      return;
    }

    const newCustomer: Customer = {
      id: `CUST-0${customers.length + 1}`,
      name: regName,
      mobile: regMobile,
      email: regEmail,
      address: regAddress,
      city: regCity,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };

    onRegisterCustomer(newCustomer);
    setSuccessMessage("नोंदणी यशस्वी! तुम्ही आता लॉग इन करू शकता. (Registration complete! You can log in now.)");
    setIsRegistering(false);
    setCustMobile(regMobile);
    setOtpSent(false);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (adminUsername.toLowerCase() === "admin" && adminPassword === "admin123") {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setAdminGeneratedOtp(code);
      setAdminOtpSent(true);
      setSuccessMessage(`Two Factor Auth Enabled: Demo code is ${code}`);
    } else {
      setErrorMessage("अवैध युझरनेम किंवा पासवर्ड (Invalid Username or Password)");
    }
  };

  const handleAdminOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminOtp === adminGeneratedOtp || adminOtp === "1234") {
      onLoginSuccess("admin", "admin");
    } else {
      setErrorMessage("चुकीचा सुरक्षा कोड/OTP (Incorrect security code/OTP)");
    }
  };

  // Pre-fill utility helper
  const handlePrefillCustomer = (mobile: string) => {
    setCustMobile(mobile);
    setOtpSent(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handlePrefillAdmin = () => {
    setAdminUsername("admin");
    setAdminPassword("admin123");
    setAdminOtpSent(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative antialiased">
      {/* Decorative vectors */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl"></div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative z-10 transition-all">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-3 text-indigo-400">
            <span className="font-extrabold tracking-widest text-lg">SK</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            {centerName}
          </h2>
          <p className="text-xs text-slate-400">
            आपले सरकार सेवा केंद्र - डिजिटल गेटवे
          </p>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-850 mb-6">
          <button
            onClick={() => {
              setActiveTab("customer");
              setIsRegistering(false);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            id="cust-login-tab"
            className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
              activeTab === "customer"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ग्राहक (Customer)</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab("admin");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            id="admin-login-tab"
            className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
              activeTab === "admin"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>प्रशासक (Admin)</span>
          </button>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-start gap-2">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dynamic Views */}
        {activeTab === "customer" && !isRegistering && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {!otpSent ? (
              <form onSubmit={handleSendCustomerOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    मोबाईल नंबर / Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={custMobile}
                      onChange={(e) => setCustMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="मोबाईल क्रमांक टाका"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="send-cust-otp-btn"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/10 cursor-pointer"
                >
                  <span>OTP मिळवा (Send OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCustomerOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    सुरक्षा कोड (Demo OTP is shown in banner above)
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={4}
                      value={custOtp}
                      onChange={(e) => setCustOtp(e.target.value)}
                      placeholder="४ अंकी कोड टाका"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm text-center font-mono tracking-widest focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setCustOtp(""); }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    नंबर बदला (Change Number)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(randomOtp);
                      setSuccessMessage(`New Demo OTP Code: ${randomOtp}`);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    पुन्हा पाठवा (Resend)
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>प्रवेश करा (Login Securely)</span>
                  <Check className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Registration trigger */}
            <div className="pt-4 border-t border-slate-800/60 text-center">
              <p className="text-xs text-slate-400">
                नवीन ग्राहक आहात?{" "}
                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  id="open-register-btn"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  इथे नोंदणी करा (Register)
                </button>
              </p>
            </div>

            {/* Quick pre-fill simulator */}
            <div className="mt-6 bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-2">
                Quick Test Accounts:
              </span>
              <div className="space-y-1.5">
                {customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handlePrefillCustomer(c.mobile)}
                    className="w-full text-left text-xs bg-slate-900 hover:bg-slate-800 p-1.5 rounded flex justify-between items-center border border-slate-800"
                  >
                    <span className="text-slate-300 font-medium">{c.name}</span>
                    <span className="font-mono text-[11px] text-slate-400 flex items-center text-indigo-400">
                      Pre-fill: {c.mobile} <CornerDownRight className="w-3 h-3 ml-1 animate-pulse" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CUSTOMER REGISTRATION FORM */}
        {activeTab === "customer" && isRegistering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-white">
                नवीन ग्राहक नोंदणी (Customer Registration)
              </h3>
              <button
                onClick={() => setIsRegistering(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                मागे (Back)
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  पूर्ण नाव / Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="उदा. सुखदेव कुकुडे"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    मोबाईल / Mobile *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="उदा. 9420304050"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    ईमेल / Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="उदा. raj@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  पत्ता / Residential Address
                </label>
                <textarea
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="पूर्ण पत्ता प्रविष्ट करा"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  शहर / City
                </label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                id="submit-register-btn"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs transition mt-2"
              >
                नोंदणी पूर्ण करा (Register Customer)
              </button>
            </form>
          </motion.div>
        )}

        {/* ADMIN LOGIN */}
        {activeTab === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {!adminOtpSent ? (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    युझरनेम (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter admin name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    पासवर्ड / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setErrorMessage("Demo default credentials: Username: admin, Password: admin123")}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    पासवर्ड विसरलात? (Forgot Password)
                  </button>
                </div>

                <button
                  type="submit"
                  id="admin-login-btn"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>2FA लॉगिन करा (Login with 2FA)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminOtpVerify} className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                  <p className="text-[11px] text-amber-400 leading-relaxed text-center">
                    🔒 <strong>Two-Factor Authenticated Portal</strong>: <br />
                    We simulated a physical OTP key request. 
                    Your security token code is shown above.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 text-center">
                    २-घटक सुरक्षा कोड टाका (Security Code Requirement)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={adminOtp}
                    onChange={(e) => setAdminOtp(e.target.value)}
                    placeholder="सुरक्षा कोड"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 text-center text-white text-lg font-mono tracking-widest focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setAdminOtpSent(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    पासवर्ड दुरुस्त करा
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const code = Math.floor(1000 + Math.random() * 9000).toString();
                      setAdminGeneratedOtp(code);
                      setSuccessMessage(`New Admin security token is: ${code}`);
                    }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    नवीन कोड मिळवा
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
                >
                  सुरक्षित प्रवेश प्रक्रिया पूर्ण करा
                </button>
              </form>
            )}

            {/* Quick pre-fill tool to test Admin */}
            <div className="mt-6 bg-slate-950 p-3 rounded-lg border border-slate-850">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-2">
                Test Admin Account (No typing needed):
              </span>
              <button
                onClick={handlePrefillAdmin}
                className="w-full text-left text-xs bg-slate-900 hover:bg-slate-800 p-2.5 rounded flex justify-between items-center border border-slate-800 font-medium"
              >
                <div className="flex flex-col">
                  <span className="text-slate-300">User: admin</span>
                  <span className="text-[11px] text-slate-500">Pass: admin123</span>
                </div>
                <span className="font-mono text-[11px] text-indigo-400 flex items-center">
                  Auto-load <CornerDownRight className="w-3.5 h-3.5 ml-1 animate-pulse" />
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
