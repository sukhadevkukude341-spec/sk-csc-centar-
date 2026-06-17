import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Grid, CreditCard, Heart, MessageSquare, User, Bell, FileText,
  AlertCircle, CheckCircle, Search, HelpCircle, Send, ArrowRight, ShieldCheck,
  Download, Award, Eye, Navigation, Phone, Smartphone, Clock
} from "lucide-react";
import {
  Customer, ServiceItem, ApplicationRecord, AppBanner,
  NotificationItem, SupportMessage, FeedbackRecord, AppThemeConfig
} from "../types";

interface CustomerDashboardProps {
  currentMobile: string;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  services: ServiceItem[];
  applications: ApplicationRecord[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationRecord[]>>;
  banners: AppBanner[];
  notifications: NotificationItem[];
  supportMessages: SupportMessage[];
  setSupportMessages: React.Dispatch<React.SetStateAction<SupportMessage[]>>;
  feedbacks: FeedbackRecord[];
  setFeedbacks: React.Dispatch<React.SetStateAction<FeedbackRecord[]>>;
  onLogout: () => void;
  themeConfig: AppThemeConfig;
}

type CustomerTabs = "home" | "services" | "applications" | "notifications" | "idcard" | "chat" | "feedback";

export default function CustomerDashboard({
  currentMobile,
  customers,
  setCustomers,
  services,
  applications,
  setApplications,
  banners,
  notifications,
  supportMessages,
  setSupportMessages,
  feedbacks,
  setFeedbacks,
  onLogout,
  themeConfig,
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<CustomerTabs>("home");
  const [language, setLanguage] = useState<"mr" | "en">("mr");

  // Retrieve current customer details
  const customer = customers.find((c) => c.mobile === currentMobile) || {
    id: "CUST-NEW",
    name: "Guest User",
    mobile: currentMobile,
    email: "guest@example.com",
    address: "At Post Pune",
    city: "Pune",
    joinedDate: new Date().toISOString().split("T")[0],
    status: "Active" as const,
  };

  // State for filing new application
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [appDetails, setAppDetails] = useState({
    fatherName: "",
    annualIncome: "",
    remarks: "",
  });
  const [checklistConfirmed, setChecklistConfirmed] = useState<{ [doc: string]: boolean }>({});

  // Payment portal state
  const [payingApp, setPayingApp] = useState<ApplicationRecord | null>(null);
  const [paymentTimer, setPaymentTimer] = useState(300); // 5 mins
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [simulatedRef, setSimulatedRef] = useState("");

  // Chat message input
  const [chatInput, setChatInput] = useState("");

  // Feedback input
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState("");
  const [fbStatus, setFbStatus] = useState("");

  // Search filter
  const [srvQuery, setSrvQuery] = useState("");

  // Active user applications
  const myApplications = applications.filter((a) => a.customerMobile === currentMobile);

  // Active advertisements banners
  const sliderBanners = banners.filter((b) => b.active && b.type === "Slider");
  const popupBanner = banners.find((b) => b.active && b.type === "Popup");
  const [dismissPopup, setDismissPopup] = useState(false);

  // Timer run loop for live simulated QR scan gate
  useEffect(() => {
    let interval: any;
    if (payingApp) {
      setSimulatedRef("UPI" + Math.floor(1000000000 + Math.random() * 9000000000).toString());
      interval = setInterval(() => {
        setPaymentTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [payingApp]);

  const handleStartFiling = (srv: ServiceItem) => {
    setSelectedService(srv);
    setAppDetails({ fatherName: "", annualIncome: "", remarks: "" });
    // reset doc checklists
    const initialChecklist: any = {};
    const list = language === "en" ? srv.documentsRequired : srv.documentsRequiredMarathi;
    list.forEach((doc) => {
      initialChecklist[doc] = false;
    });
    setChecklistConfirmed(initialChecklist);
  };

  // Submit dynamic application form
  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    // Verify all checklists checked
    const unChecked = Object.values(checklistConfirmed).includes(false);
    if (unChecked) {
      alert(
        language === "en"
          ? "Please attest all required documents checklist before filing your file!"
          : "कृपया अर्ज दाखल करण्यापूर्वी सर्व आवश्यक कागदपत्रांची यादी तपासा!"
      );
      return;
    }

    const docUploadRecord: any = {};
    Object.keys(checklistConfirmed).forEach((doc) => {
      docUploadRecord[doc] = "attested_verified";
    });

    const newApp: ApplicationRecord = {
      id: `APP-50${(applications.length + 1).toString()}`,
      customerMobile: customer.mobile,
      customerName: customer.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      amountPaid: selectedService.fee,
      paymentStatus: "Unpaid",
      documentsUploaded: docUploadRecord,
      remarks: "Awaiting instant UPI payment registration to initialize desk audit.",
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem("csc_applications", JSON.stringify(updated));

    setSelectedService(null);
    setPayingApp(newApp);
    setPaymentTimer(300);
    setActiveTab("applications");
  };

  // Complete Simulated Instant Payment
  const handleCompletePaymentSimulated = () => {
    if (!payingApp) return;

    const updated = applications.map((a) => {
      if (a.id === payingApp.id) {
        return {
          ...a,
          paymentStatus: "Paid" as const,
          paymentReference: simulatedRef,
          remarks: "Payment received. Desk officer will verify certificates in 2-3 working days.",
        };
      }
      return a;
    });

    setApplications(updated);
    localStorage.setItem("csc_applications", JSON.stringify(updated));

    setShowPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentSuccess(false);
      setPayingApp(null);
    }, 2500);
  };

  // Submit rating
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbComment) return;

    const record: FeedbackRecord = {
      id: `FED-0${(feedbacks.length + 1).toString()}`,
      customerName: customer.name,
      mobile: customer.mobile,
      rating: fbRating,
      comment: fbComment,
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [record, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("csc_feedback", JSON.stringify(updated));
    setFbComment("");
    setFbStatus(
      language === "en"
        ? "Thank you for rating our service केंद्र!"
        : "आपला अभिप्राय यशस्वीरित्या नोंदविला गेला! धन्यवाद."
    );
    setTimeout(() => setFbStatus(""), 4000);
  };

  // Send communication helpdesk chat message
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;

    const msg: SupportMessage = {
      id: `MSG-${(supportMessages.length + 1).toString()}`,
      sender: "Customer",
      senderMobile: customer.mobile,
      senderName: customer.name,
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...supportMessages, msg];
    setSupportMessages(updated);
    localStorage.setItem("csc_support", JSON.stringify(updated));
    setChatInput("");

    // Automated helpful responder
    setTimeout(() => {
      const autoResp: SupportMessage = {
        id: `MSG-${(supportMessages.length + 2).toString()}`,
        sender: "Admin",
        senderMobile: customer.mobile,
        senderName: customer.name,
        message:
          language === "en"
            ? "Your inquiry is registered on the administrator's console. We will reach you shortly on WhatsApp!"
            : "आपली चौकशी ॲडमिन कंट्रोल पॅनेलवर वर्ग केली आहे, लवकरच आपणास WhatsApp वर उत्तर मिळेल!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const appended = [...updated, autoResp];
      setSupportMessages(appended);
      localStorage.setItem("csc_support", JSON.stringify(appended));
    }, 1500);
  };

  // Mock Receipt Download generator
  const downloadReceiptSimulation = (app: ApplicationRecord) => {
    const filename = `SK_CSC_Receipt_${app.id}.pdf`;
    alert(
      language === "en"
        ? `🔐 SECURE CSC PAYMENT RECEIPT GENERATOR\n=================================\nCenter Name: ${themeConfig.centerName}\nReceipt Ref: ${app.paymentReference}\nCandidate: ${app.customerName}\nService: ${app.serviceName}\nAmount Paid: ₹${app.amountPaid}\nStatus: STAMP_AUTHENTICATED_SUCCESS\n=================================\nSaved system transcript file: ${filename}`
        : `🔐 अधिकृत भरणा पावती जनरेटर\n=================================\nकेंद्र नाव: ${themeConfig.centerName}\nसंदर्भ ID: ${app.paymentReference}\nअर्जदार: ${app.customerName}\nसेवा: ${app.serviceName}\nभरलेले शुल्क: ₹${app.amountPaid}\nस्थिती: यशस्वीरित्या प्रमाणित\n=================================\nपावती डाउनलोड पूर्ण झाली: ${filename}`
    );
  };

  // Search Results
  const filteredServices = services.filter((s) => {
    const term = srvQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.nameMarathi.includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* BRAND HEADER BAR */}
      <header className="bg-slate-900 border-b border-slate-800 py-3 px-4.5 sticky top-0 z-30 backdrop-blur flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-sm">
            CSC
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white block">
              {themeConfig.centerName}
            </h1>
            <span className="text-[10px] text-slate-400 block font-mono">
              Aaple Sarkar Seva - Digital India Direct
            </span>
          </div>
        </div>

        {/* Translation Option & Logout Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle selectors */}
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-850 flex items-center gap-1">
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                language === "mr" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                language === "en" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={onLogout}
            id="cust-logout-btn"
            className="bg-slate-850 hover:bg-rose-955/20 hover:text-rose-400 text-slate-350 p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-800 cursor-pointer"
          >
            ❌ <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* POPUP ANNOUNCEMENT CONFIGURATION */}
      {popupBanner && !dismissPopup && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4.5 z-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
          >
            <div className="relative h-44">
              <img
                src={popupBanner.imageUrl}
                alt="Popup banner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setDismissPopup(true)}
                className="absolute top-2.5 right-2.5 bg-slate-950/80 hover:bg-slate-950 text-white w-7 h-7 rounded-full flex items-center justify-center border border-slate-800 cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>
            <div className="p-5 space-y-3">
              <span className="text-[10px] bg-amber-500/10 text-amber-500 font-black border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                अतिशय महत्वाची सूचना (Important Update)
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                {popupBanner.title}
              </h3>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                {language === "en"
                  ? "Attest required certificates from customer registry and apply before standard target date."
                  : "या योजनेचा लाभ मिळवण्यासाठी आवश्यक कागदपत्रे जोडून आपल्या CSC ॲप द्वारे त्वरित अर्ज सबमिट करा."}
              </p>
              <button
                onClick={() => {
                  setDismissPopup(true);
                  setActiveTab("services");
                }}
                className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer"
              >
                {language === "en" ? "Explore Service Offered" : "सेवांची माहिती पहा"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CLIENT DECK CONTENT VIEW */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDE BAR NAVIGATION CLIENT */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Welcome profile widget */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold font-mono">
                {customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-500 font-mono block">WELCOME BACK</span>
                <h4 className="text-sm font-bold text-white truncate">{customer.name}</h4>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-850/60 space-y-2 text-[11px] text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Member ID:</span>
                <span className="font-bold text-slate-300">{customer.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile Ref:</span>
                <span className="text-slate-300">+91 {customer.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span>City Location:</span>
                <span className="text-slate-300 capitalize">{customer.city}</span>
              </div>
            </div>
          </div>

          {/* Tab Control links */}
          <nav className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 flex flex-wrap lg:flex-col gap-1">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "home"
                  ? "bg-indigo-650 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{language === "en" ? "My Desk" : "माझे डेस्क"}</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "services"
                  ? "bg-indigo-650 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>{language === "en" ? "Services Offered" : "सेवांची यादी"}</span>
            </button>

            <button
              onClick={() => setActiveTab("applications")}
              id="cust-nav-app-btn"
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === "applications"
                  ? "bg-indigo-650 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{language === "en" ? "My Applications" : "माझे अर्ज"}</span>
              {myApplications.length > 0 && (
                <span className="absolute right-2.5 top-3.5 bg-indigo-500 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-full leading-none">
                  {myApplications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-indigo-650 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{language === "en" ? "Alert Bulletins" : "केंद्र सूचना"}</span>
            </button>

            <button
              onClick={() => setActiveTab("idcard")}
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "idcard"
                  ? "bg-indigo-650 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{language === "en" ? "Digital ID Card" : "डिजिटल आयडी कार्ड"}</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-indigo-650 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === "en" ? "CSC Helpdesk Chat" : "ॲडमिन चॅट सपोर्ट"}</span>
            </button>

            <button
              onClick={() => setActiveTab("feedback")}
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "feedback"
                  ? "bg-indigo-650 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{language === "en" ? "Rate Us/Feedback" : "अभिप्राय नोंदवा"}</span>
            </button>
          </nav>
        </div>

        {/* WORKSTAGE VIEWPORT CLIENT */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* HOME DESK VIEW */}
          {activeTab === "home" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Marketing notice slider */}
              {sliderBanners.length > 0 && (
                <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden relative">
                  <div className="relative h-44 sm:h-52 bg-slate-950">
                    <img
                      src={sliderBanners[0].imageUrl}
                      alt={sliderBanners[0].title}
                      className="w-full h-full object-cover opacity-75"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-5 right-5 space-y-1.5">
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wide leading-none uppercase">
                        {language === "en" ? "Active Offer Bulletin" : "विशेष शासकीय योजना"}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                        {sliderBanners[0].title}
                      </h3>
                      <button
                        onClick={() => setActiveTab("services")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-md text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === "en" ? "Apply Now via Portal" : "सेवांचा लाभ घ्या आणि अर्ज करा"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status scorecard summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    {language === "en" ? "Filed Applications" : "दाखल केलेले अर्ज"}
                  </span>
                  <div className="text-xl font-black text-white mt-1 font-mono">
                    {myApplications.length}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    {language === "en" ? "Approved Certificates" : "मंजूर झालेले दाखले"}
                  </span>
                  <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
                    {myApplications.filter((a) => a.status === "Approved").length}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    {language === "en" ? "Action Needed" : "प्रलंबित शुल्क प्रकरणे"}
                  </span>
                  <div className="text-xl font-black text-amber-400 mt-1 font-mono">
                    {myApplications.filter((a) => a.paymentStatus === "Unpaid").length}
                  </div>
                </div>
              </div>

              {/* My Applications Quick Summary list */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-5">
                <h4 className="text-xs font-extrabold uppercase text-white font-mono mb-3 tracking-wider">
                  {language === "en" ? "My Desktop Status Feed" : "माझ्या प्रमाणपत्रांचीद्य सद्यस्थिती"}
                </h4>

                <div className="space-y-3.5">
                  {myApplications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 bg-slate-950 border border-slate-850 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-indigo-400">
                            {app.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {app.appliedDate}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-white mt-1">{app.serviceName}</h5>
                        {app.remarks && (
                          <p className="text-[11px] text-slate-450 text-slate-400 italic mt-0.5">
                            "{app.remarks}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black capitalize ${
                          app.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : app.status === "Pending"
                            ? "bg-amber-500/10 text-amber-500 animate-pulse"
                            : app.status === "Processing"
                            ? "bg-sky-505/10 text-sky-400"
                            : "bg-rose-500/10 text-rose-450"
                        }`}>
                          {app.status}
                        </span>

                        {app.paymentStatus === "Unpaid" ? (
                          <button
                            onClick={() => {
                              setSelectedService(null);
                              setPayingApp(app);
                              setPaymentTimer(300);
                              setActiveTab("applications");
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1 rounded text-xs transition cursor-pointer"
                          >
                            ₹{app.amountPaid} {language === "en" ? "Pay Now" : "शुल्क भरा"}
                          </button>
                        ) : (
                          <button
                            onClick={() => downloadReceiptSimulation(app)}
                            className="bg-slate-800 hover:bg-slate-755 text-slate-300 p-1.5 rounded transition cursor-pointer"
                            title="Download Official Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {myApplications.length === 0 && (
                    <div className="text-center py-8 text-slate-500 italic text-xs">
                      {language === "en"
                        ? "You haven't applied for any certificates yet."
                        : "तुम्ही अद्याप कोणत्याही दाखल्यासाठी अर्ज केलेला नाही."}
                      <button
                        onClick={() => setActiveTab("services")}
                        className="text-indigo-400 hover:text-indigo-300 underline block mt-2 text-xs font-bold"
                      >
                        {language === "en" ? "Browse G2C Services" : "शासकीय सेवांची यादी पहा"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Service center helper box */}
              <div className="p-4 bg-indigo-950/20 border border-indigo-900/60 rounded-xl flex gap-3.5 items-start text-xs text-slate-300 font-sans">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h5 className="font-bold text-white mb-0.5">
                    {language === "en" ? "Official CSC Certified Support" : "अधिकृत आपले सरकार केंद्र प्रमुख"}
                  </h5>
                  <p className="leading-relaxed text-slate-400">
                    {language === "en"
                      ? `Our common services platform connects natively to Government Tahsildar biometric ports. Call support desk: +91 ${themeConfig.contactNumber} for quick audits.`
                      : `आपले सरकार डिजिटल सर्व्हिस प्लॅटफॉर्म थेट शासकीय तहसीलदार कार्यालयाशी जोडलेला आहे. तातडीच्या मदतीसाठी केंद्र प्रमुखांशी संपर्क साधा: +91 ${themeConfig.contactNumber}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* CENTRE SERVICES CATALOUGUE VIEW */}
          {activeTab === "services" && !selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-905 p-4 rounded-xl border border-slate-850/60">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    {language === "en" ? "CSC Services Catalog" : "अधिकृत सेतू सेवांची माहिती"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === "en"
                      ? "Select a service, view mandatory document checklist and apply online"
                      : "योग्य सेवा निवडा, आवश्यक कागदपत्रांची पडताळणी करा आणि थेट ऑनलाईन अर्ज दाखल करा"}
                  </p>
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder={language === "en" ? "Search services..." : "उदा. उत्पन्न दाखला..."}
                    value={srvQuery}
                    onChange={(e) => setSrvQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid of services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-5 hover:border-slate-800 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2.5">
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">
                          {srv.id}
                        </span>
                        <span className="text-emerald-400 font-bold text-xs font-mono">
                          ₹{srv.fee}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">
                        {language === "en" ? srv.name : srv.nameMarathi}
                      </h4>

                      <p className="text-[11px] text-slate-400 leading-relaxed mt-2.5 font-sans">
                        {language === "en" ? srv.description : srv.descriptionMarathi}
                      </p>

                      <div className="my-3.5 pt-3.5 border-t border-slate-850/60 font-sans space-y-2">
                        <span className="text-[10.5px] uppercase font-mono font-bold text-slate-500 block">
                          {language === "en" ? "Required Attachments:" : "लागणारे महत्वाचे पुरावे:"}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(language === "en" ? srv.documentsRequired : srv.documentsRequiredMarathi).map((doc, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-950 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-850"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-3 border-t border-slate-850/60 items-center justify-between mt-2.5">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{srv.processingTime}</span>
                      </div>
                      <button
                        onClick={() => handleStartFiling(srv)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3.5 rounded-lg text-xs transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === "en" ? "Apply Online" : "ऑनलाईन अर्ज करा"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ONLINE APPLICATION FILING FORM PAGE */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-5"
            >
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-850">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">
                    {selectedService.id} Form filing
                  </span>
                  <h4 className="text-base font-bold text-white mt-1 capitalize leading-snug">
                    {language === "en" ? selectedService.name : selectedService.nameMarathi}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {language === "en" ? "Cancel Filing" : "रद्द करा"}
                </button>
              </div>

              {/* Informational Alert info */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs flex gap-2 font-sans">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <p>
                  {language === "en"
                    ? "Mandatory Documents Attestation Check: You must tick the checklists below to verify you hold physical copies before submittal."
                    : "अर्जाच्या पडताळणीसाठी खालील सर्व कागदपत्रांचे स्वयं-घोषणापत्र टिक करणे अनिवार्य आहे."}
                </p>
              </div>

              <form onSubmit={handleFormSubmission} className="space-y-4 text-xs">
                
                {/* Standard general details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      {language === "en" ? "Father / Spouse's Full Name *" : "वडिलांचे / पतीचे पूर्ण नाव *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. सुनील विठ्ठल कुकुडे"
                      value={appDetails.fatherName}
                      onChange={(e) => setAppDetails({ ...appDetails, fatherName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      {language === "en" ? "Annual Certified Income (INR) *" : "वार्षिक कौटुंबिक उत्पन्न (रुपये) *"}
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 85000"
                      value={appDetails.annualIncome}
                      onChange={(e) => setAppDetails({ ...appDetails, annualIncome: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    {language === "en" ? "Filing Remarks / Notes" : "अतिरिक्त टिपणी / शेरा"}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="..."
                    value={appDetails.remarks}
                    onChange={(e) => setAppDetails({ ...appDetails, remarks: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white resize-none"
                  />
                </div>

                {/* Checklist verifying uploads */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-3 font-sans">
                  <span className="text-[10px] font-extrabold uppercase font-mono text-slate-500 block tracking-wider">
                    {language === "en" ? "ATTESST MANDATORY PHYSICAL DOCUMENTS" : "दस्तावेज पडताळणी घोषणापत्र"}
                  </span>

                  <div className="space-y-2.5">
                    {(language === "en" ? selectedService.documentsRequired : selectedService.documentsRequiredMarathi).map((doc, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white"
                      >
                        <input
                          type="checkbox"
                          required
                          checked={checklistConfirmed[doc] || false}
                          onChange={(e) => setChecklistConfirmed({
                            ...checklistConfirmed,
                            [doc]: e.target.checked
                          })}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-0 cursor-pointer h-4 w-4"
                        />
                        <span className="leading-snug select-none">{doc} {' '}
                          <strong className="text-[10px] text-emerald-400 font-mono font-medium">(Physically Available)</strong>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-3.5 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 bg-slate-805 bg-slate-800 text-slate-305 text-xs font-semibold py-2.5 rounded-lg text-center"
                  >
                    {language === "en" ? "Back to Services list" : "यादी कडे जा"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-605 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg text-center cursor-pointer"
                  >
                    {language === "en" ? "Submit Application File" : "अर्ज सादर करा आणि पुढे जा"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* MY APPLICATIONS & RECEIPTS REGISTER VIEW */}
          {activeTab === "applications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-slate-905 p-4 rounded-xl border border-slate-850/60">
                <h3 className="text-base font-bold text-white uppercase tracking-tight font-mono">
                  {language === "en" ? "Attested Applications Logs" : "माझ्या प्रमाणपत्रांच्या अर्जांचा इतिहास"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === "en"
                    ? "Review status desk reviews, clear payments, or download secure legal receipts"
                    : "अर्जाची सद्यस्थिती तपासा, प्रलंबित शुल्क भरा आणि डिजिटल पावती डाउनलोड करा"}
                </p>
              </div>

              {/* PAYMENT INTERFACE DIRECT POPUP */}
              {payingApp && (
                <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/50 rounded-2xl p-5 space-y-4 shadow-xl">
                  {showPaymentSuccess ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="py-12 text-center space-y-3"
                    >
                      <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                      <h4 className="text-lg font-bold text-white uppercase tracking-wider">
                        {language === "en" ? "Payment Confirmed!" : "भरणा यशस्वी!"}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        Transaction ledger complete. Recipient ID: <strong>{simulatedRef}</strong>.<br />
                        Updating application status desks...
                      </p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-6 relative">
                      
                      {/* Left: UPI details qr scan code */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center flex flex-col justify-center items-center gap-3 w-full md:w-56 shrink-0 relative">
                        <span className="text-[9px] font-mono bg-indigo-950/50 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/60 block">
                          SCAN TO PAY WITH ANY UPI APP
                        </span>
                        
                        {/* Realistic Mock QR Code */}
                        <div className="w-36 h-36 bg-white p-2.5 rounded-lg flex items-center justify-center relative shadow-inner">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${themeConfig.upiId}&pn=${encodeURIComponent(themeConfig.centerName)}&am=${payingApp.amountPaid}&tn=CSC${payingApp.id}`}
                            alt="UPI QR Code"
                            className="w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                            <ShieldCheck className="w-12 h-12 text-slate-950" />
                          </div>
                        </div>

                        <div className="space-y-0.5 text-xs">
                          <p className="font-bold text-white">₹{payingApp.amountPaid}.00</p>
                          <span className="text-[10px] text-slate-500 font-mono">UPI: {themeConfig.upiId}</span>
                        </div>
                      </div>

                      {/* Right: Payment instructions and simulation buttons */}
                      <div className="flex-1 space-y-4 text-xs font-sans">
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                          <div>
                            <span className="text-[9.5px] font-mono text-slate-500">BILLING INVOICE FOR:</span>
                            <h4 className="text-sm font-bold text-white mt-0.5">{payingApp.serviceName}</h4>
                            <p className="text-[10.5px] text-slate-400 font-mono mt-0.5">Reference ID: {payingApp.id}</p>
                          </div>
                          <span className="font-mono text-xs text-amber-400 font-bold bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded">
                            {Math.floor(paymentTimer / 60)}:{(paymentTimer % 60).toString().padStart(2, "0")} Sec Left
                          </span>
                        </div>

                        <div className="space-y-1.5 leading-relaxed text-slate-400 text-[11px]">
                          <p>1. Open GooglePay, PhonePe, Paytm, or BHIM.</p>
                          <p>2. Scan the QR code displayed or pay directly to the billing UPI handle.</p>
                          <p>3. Do not close this billing gateway. The webhook updates automatically once processed.</p>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded border border-slate-850 text-indigo-400 text-[11px] leading-relaxed flex items-start gap-1.5 font-sans">
                          <Eye className="w-4 h-4 shrink-0" />
                          <p><strong>Demo Guide:</strong> Since there are no real merchant terminals on dry-previews, please click <strong>"Complete Payment Simulation"</strong> inside this card to simulate successful bank webhooks.</p>
                        </div>

                        <div className="flex gap-2.5 pt-2">
                          <button
                            onClick={() => setPayingApp(null)}
                            className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2 px-3.5 rounded-lg cursor-pointer"
                          >
                            {language === "en" ? "Pay Later" : "नंतर भरा"}
                          </button>
                          <button
                            onClick={handleCompletePaymentSimulated}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2 px-3 rounded-lg text-center cursor-pointer"
                          >
                            {language === "en" ? "Complete Payment Simulation" : "अँक्टिवेट भरणा (सिम्युलेटर)"}
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* COMPLETE ARCHIVE CARDS */}
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-5 hover:border-slate-800 transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                            {app.id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Filed on: {app.appliedDate}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-white mt-1 leading-snug">
                          {app.serviceName}
                        </h4>

                        <div className="mt-3.5 flex flex-wrap gap-2 text-[10.5px] items-center">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-wide capitalize ${
                            app.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : app.status === "Pending"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : app.status === "Processing"
                              ? "bg-sky-505/10 text-sky-400 border border-sky-500/20"
                              : "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                          }`}>
                            Status: {app.status}
                          </span>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            app.paymentStatus === "Paid"
                              ? "bg-emerald-505/10 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40"
                              : "bg-amber-955/10 bg-amber-900/20 text-amber-500 border border-amber-800/40"
                          }`}>
                            Invoice: {app.paymentStatus}
                          </span>

                          {app.paymentReference && (
                            <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-[10px]">
                              TXN Ref: {app.paymentReference}
                            </span>
                          )}
                        </div>

                        {app.remarks && (
                          <div className="text-xs text-slate-400 italic mt-3 pt-3 border-t border-slate-850/60 flex items-start gap-1.5 font-sans">
                            <span className="text-slate-500 shrink-0 font-medium">Remarks Notification:</span>
                            <span>"{app.remarks}"</span>
                          </div>
                        )}
                      </div>

                      {/* Right actions */}
                      <div className="sm:text-right shrink-0">
                        {app.paymentStatus === "Unpaid" ? (
                          <button
                            onClick={() => {
                              setSelectedService(null);
                              setPayingApp(app);
                              setPaymentTimer(300);
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2 px-4 rounded-lg text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>₹{app.amountPaid} {language === "en" ? "Complete Payment" : "ऑनलाईन शुल्क भरा"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            {app.status === "Approved" && (
                              <button
                                onClick={() => {
                                  alert(`DOWNLOADING MANDATORY CERTIFICATE\n=================================\nCenter: ${themeConfig.centerName}\nCertificate Ref: CERT-${app.id}\nIssued to: ${app.customerName}\nStatus: Officially Stamped & Certified by Tahsildar Port.\n=================================\nSaved certificate: Issued_Certificate_${app.id}.pdf`);
                                }}
                                className="bg-emerald-650 bg-emerald-600 hover:bg-emerald-705 text-white font-bold py-1.5 px-3 rounded text-xs transition inline-flex items-center gap-1 cursor-pointer"
                              >
                                {language === "en" ? "Get Certificate" : "दाखला मिळवा"}
                              </button>
                            )}
                            <button
                              onClick={() => downloadReceiptSimulation(app)}
                              className="bg-slate-800 hover:bg-slate-755 text-slate-350 py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1 transition border border-slate-700/60 cursor-pointer text-white"
                            >
                              <Download className="w-4 h-4" />
                              <span>{language === "en" ? "Tax Slip" : "पावती"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}

                {myApplications.length === 0 && (
                  <div className="text-center py-12 bg-slate-900 border border-slate-850 rounded-xl">
                    <FileText className="w-10 h-10 text-slate-655 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs">You haven't filed any certificates yet on our portal.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ACTIVE ALERTS BULLETINS TAB */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-slate-905 p-4 rounded-xl border border-slate-850/60 font-mono">
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  {language === "en" ? "Center Alerts & Live Notifications" : "आपले सरकार केंद्र प्रमुख सूचना"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === "en"
                    ? "Read important announcements, portal changes, and scheduled maintenance bulletins."
                    : "केंद्र संचालकांकडून जारी करण्यात आलेल्या महत्वाच्या शासकीय सुचना आणि अपडेट्स पहा."}
                </p>
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 bg-slate-900 border border-slate-850 rounded-xl hover:border-slate-800 transition flex items-start gap-3.5"
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 text-[10px] uppercase font-mono font-black ${
                      notif.type === "Alert"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : notif.type === "Update"
                        ? "bg-indigo-505/10 bg-indigo-950/40 text-indigo-400 border border-indigo-900/50"
                        : "bg-emerald-505/10 bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                    }`}>
                      {notif.type}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-black text-white uppercase leading-tight font-sans">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                          {notif.date}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed font-sans pt-1">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-center text-slate-500 italic py-10 text-xs">
                    No newsletters published in this billing cycle.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* DIGITAL SIGNED MEMBER ID CARD GENERATOR */}
          {activeTab === "idcard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-slate-905 p-4 rounded-xl border border-slate-850/60 font-mono">
                <h3 className="text-base font-bold text-white">
                  {language === "en" ? "Secured CSC digital Member ID Card" : "प्रमाणित डिजिटल सदस्य ओळखीपत्र"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 uppercase">
                  {language === "en"
                    ? "Cryptographically stamped membership reference ID. Print or download copy."
                    : "अर्जाच्या प्रक्रियेसाठी आणि केंद्र सवलतींसाठी ग्राहकाचे डिजिटल ओळखपत्र."}
                </p>
              </div>

              {/* ID Card Visual graphic */}
              <div className="relative max-w-sm mx-auto bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-[2px] rounded-2xl shadow-xl border border-slate-850/80">
                <div className="bg-slate-950 rounded-2xl p-5 relative overflow-hidden font-mono text-[11px] text-slate-300">
                  {/* Grid lines decorative background */}
                  <div className="absolute inset-x-0 bottom-0 top-1/2 opacity-5" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px)`,
                    backgroundSize: "100% 8px"
                  }}></div>

                  <div className="flex justify-between items-start border-b border-indigo-900/80 pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-indigo-505 bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">SK</div>
                      <span className="font-extrabold text-[10px] text-white tracking-widest">{themeConfig.centerName.slice(0, 18)}</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black tracking-widest px-1.5 py-0.2 rounded border border-emerald-900/50">
                      SECURED MEMBER
                    </span>
                  </div>

                  <div className="flex gap-4">
                    {/* Mock Photo */}
                    <div className="w-20 h-24 rounded bg-slate-900 border border-slate-850 overflow-hidden flex flex-col items-center justify-center relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-slate-805 bg-slate-800 flex items-center justify-center text-slate-400">
                        M
                      </div>
                      <span className="text-[7.5px] scale-90 font-bold tracking-widest text-slate-500 mt-1 block">BIO_OK</span>
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1 relative z-10 font-sans">
                      <div>
                        <span className="text-[7.5px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Candidate Name</span>
                        <strong className="text-xs text-white truncate block font-medium uppercase font-sans leading-none mt-0.5">{customer.name}</strong>
                      </div>
                      <div>
                        <span className="text-[7.5px] font-mono text-slate-500 block uppercase font-bold tracking-wider">Registered Cell No</span>
                        <span className="text-slate-300 font-mono text-xs">+91 {customer.mobile}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <span className="text-[7.5px] font-mono text-slate-500 block uppercase font-bold">MEMBER ID</span>
                          <span className="text-[10px] text-slate-350 font-mono font-medium">{customer.id}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] font-mono text-slate-500 block uppercase font-bold">ISSUE DATE</span>
                          <span className="text-[10px] text-slate-350 font-mono font-medium">{customer.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-indigo-900/40 flex justify-between items-center text-[9px] text-slate-500">
                    <span className="font-mono">VALID UNTIL: DEC {new Date().getFullYear() + 2}</span>
                    <span className="text-[10px] font-bold text-slate-450 text-indigo-400 font-sans">SK CENTER HEAD SIGN</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    alert(`ID CARD EXPORT SUCCESS\n=================================\nCandidate: ${customer.name}\nReference: ${customer.id}\nPrinting dynamic Cryptostamp... File saved: SK_CSC_Identity_${customer.id}.pdf`);
                  }}
                  className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg text-xs tracking-wide transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === "en" ? "Download Identity PDF" : "डिजिटल आयडी कार्ड डाउनलोड करा"}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ACTIVE SUPPORT HELPDESK CHAT WITH ADMIN */}
          {activeTab === "chat" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-slate-905 p-3.5 rounded-xl border border-slate-850/60 flex items-center justify-between font-sans">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    {language === "en" ? "Support Helpdesk Chat" : "आपले सरकार मदत केंद्र प्रमुख चॅट"}
                  </h3>
                  <p className="text-xs text-slate-450 text-slate-400">
                    {language === "en"
                      ? "Have certificate queries? Send a note directly to our admin panel."
                      : "कागदपत्रांविषयी शंका आहे? थेट केंद्र प्रमुखांशी लिखित संवाद साधा आणि उत्तर मिळवा."}
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-900/40 text-[9px] font-mono px-2 py-0.5 rounded">
                  OFFICIAL_HELP_OPEN
                </span>
              </div>

              {/* Chat Thread */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden flex flex-col h-[400px]">
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/25">
                  {supportMessages
                    .filter((m) => m.senderMobile === customer.mobile)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          msg.sender === "Customer" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div className={`p-3 rounded-lg text-xs leading-normal font-sans ${
                          msg.sender === "Customer"
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-slate-850 text-slate-200 rounded-tl-none border border-slate-800"
                        }`}>
                          {msg.message}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 font-mono">
                          {msg.sender === "Customer" ? "You" : "CSC Operator"} • {msg.timestamp}
                        </span>
                      </div>
                    ))}

                  {supportMessages.filter((m) => m.senderMobile === customer.mobile).length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-550 text-xs italic text-center text-slate-500 px-4">
                      <span>{language === "en" ? "No messaging history found." : "अद्याप संभाषण सुरू झालेले नाही."}</span>
                    </div>
                  )}
                </div>

                {/* Send Console */}
                <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={language === "en" ? "Send message to admin..." : "तुमचा संदेश इथे लिहा..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-710 text-white px-4.5 rounded-lg flex items-center justify-center transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* CUSTOMER REVIEWS & FEEDBACK FORM SUBMITTAL */}
          {activeTab === "feedback" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-4"
            >
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-tight">
                  {language === "en" ? "Rate Our Service" : "आपला अभिप्राय नोंदवा (Customer Feedback)"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === "en"
                    ? "Leave a public rating and reviews to help us refine your digital portal experience."
                    : "आपला अमूल्य अभिप्राय आमच्या सेतू सुविधा केंद्र सुधारण्यासाठी नक्की नोंदवा."}
                </p>
              </div>

              {fbStatus && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-xs text-center font-bold font-sans">
                  {fbStatus}
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="block text-slate-400 mb-2 font-bold uppercase tracking-wider text-[10px]">
                    {language === "en" ? "Select Star Rating:" : "स्टार मानांकन निवडा:"}
                  </span>
                  
                  <div className="flex gap-2 text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFbRating(star)}
                        className={`transition cursor-pointer ${
                          star <= fbRating ? "text-amber-400" : "text-slate-700"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5">
                    {language === "en" ? "Write comprehensive comment *" : "तुमची प्रतिक्रिया प्रविष्ट करा *"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={language === "en" ? "Your review..." : "उदा. अतिशय जलद आणि उत्तम कार्य पद्धती..."}
                    value={fbComment}
                    onChange={(e) => setFbComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white resize-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  {language === "en" ? "Submit Feedback Data" : "अभिप्राय सादर करा"}
                </button>
              </form>

              {/* Feedbacks list summary */}
              <div className="mt-6 pt-5 border-t border-slate-850/60">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-3">
                  {language === "en" ? "Recent user reviews" : "इतर ग्राहकांचे अभिप्राय:"}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 font-sans">
                  {feedbacks.map((f, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-850/60 leading-normal">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <strong className="text-slate-300">{f.customerName}</strong>
                        <span className="text-amber-400 font-mono">{"★".repeat(f.rating)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic mt-1 font-sans">"{f.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
