import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Briefcase, Bell, Image as ImageIcon, CreditCard, BarChart3,
  Settings, LogOut, CheckCircle, Clock, Hourglass, TrendingUp, AlertCircle,
  Plus, Search, X, Download, ShieldCheck, Database, RefreshCcw, Heart, Send,
  Trash2, ShieldAlert, Award
} from "lucide-react";
import {
  Customer, ServiceItem, ApplicationRecord, AppBanner,
  NotificationItem, SupportMessage, FeedbackRecord, AppThemeConfig
} from "../types";

interface AdminPanelProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  applications: ApplicationRecord[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationRecord[]>>;
  banners: AppBanner[];
  setBanners: React.Dispatch<React.SetStateAction<AppBanner[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  supportMessages: SupportMessage[];
  setSupportMessages: React.Dispatch<React.SetStateAction<SupportMessage[]>>;
  feedbacks: FeedbackRecord[];
  onLogout: () => void;
  themeConfig: AppThemeConfig;
  setThemeConfig: (cfg: AppThemeConfig) => void;
}

type AdminTabs =
  | "overview"
  | "customers"
  | "services"
  | "applications"
  | "advertisements"
  | "notifications"
  | "payments-reports"
  | "support-feedback"
  | "settings-control";

export default function AdminPanel({
  customers,
  setCustomers,
  services,
  setServices,
  applications,
  setApplications,
  banners,
  setBanners,
  notifications,
  setNotifications,
  supportMessages,
  setSupportMessages,
  feedbacks,
  onLogout,
  themeConfig,
  setThemeConfig,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTabs>("overview");

  // Filter lists state
  const [custSearch, setCustSearch] = useState("");
  const [srvSearch, setSrvSearch] = useState("");
  const [appSearch, setAppSearch] = useState("");

  // Modals / New Inputs State
  const [showAddService, setShowAddService] = useState(false);
  const [newSrv, setNewSrv] = useState({
    name: "",
    nameMarathi: "",
    category: "G2C" as any,
    description: "",
    descriptionMarathi: "",
    fee: 100,
    documentsRequired: "",
    documentsRequiredMarathi: "",
    processingTime: "7 Days",
  });

  const [showAddBanner, setShowAddBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
    type: "Slider" as any,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    targetAudience: "All" as any,
  });

  const [newBroad, setNewBroad] = useState({
    title: "",
    message: "",
    type: "Broadcast" as any,
  });

  // Theme edit states
  const [editingTheme, setEditingTheme] = useState({ ...themeConfig });

  // Chat focus mobile
  const [activeChatMobile, setActiveChatMobile] = useState<string>("");
  const [adminReplyText, setAdminReplyText] = useState("");

  // Search Results
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
      c.mobile.includes(custSearch) ||
      c.city.toLowerCase().includes(custSearch.toLowerCase())
  );

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(srvSearch.toLowerCase()) ||
      s.nameMarathi.includes(srvSearch)
  );

  const filteredApps = applications.filter(
    (a) =>
      a.customerName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.customerMobile.includes(appSearch) ||
      a.id.includes(appSearch)
  );

  // Status Counts
  const totalCustomers = customers.length;
  const applicationsPending = applications.filter((a) => a.status === "Pending").length;
  const applicationsProcessing = applications.filter((a) => a.status === "Processing").length;
  const applicationsApproved = applications.filter((a) => a.status === "Approved").length;
  const applicationsRejected = applications.filter((a) => a.status === "Rejected").length;

  // Earnings
  const totalRevenue = applications
    .filter((a) => a.paymentStatus === "Paid")
    .reduce((sum, current) => sum + current.amountPaid, 0);

  const pendingRevenue = applications
    .filter((a) => a.paymentStatus === "Unpaid")
    .reduce((sum, current) => sum + current.amountPaid, 0);

  // Quick Action: Add Service Handler
  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrv.name || !newSrv.nameMarathi) return;

    const added: ServiceItem = {
      id: `SRV-${(services.length + 101).toString()}`,
      name: newSrv.name,
      nameMarathi: newSrv.nameMarathi,
      category: newSrv.category,
      description: newSrv.description,
      descriptionMarathi: newSrv.descriptionMarathi,
      fee: Number(newSrv.fee),
      documentsRequired: newSrv.documentsRequired.split(",").map((s) => s.trim()).filter(Boolean),
      documentsRequiredMarathi: newSrv.documentsRequiredMarathi.split(",").map((s) => s.trim()).filter(Boolean),
      processingTime: newSrv.processingTime,
    };

    const updated = [...services, added];
    setServices(updated);
    localStorage.setItem("csc_services", JSON.stringify(updated));

    // Reset Form
    setNewSrv({
      name: "",
      nameMarathi: "",
      category: "G2C",
      description: "",
      descriptionMarathi: "",
      fee: 100,
      documentsRequired: "",
      documentsRequiredMarathi: "",
      processingTime: "7 Days",
    });
    setShowAddService(false);
  };

  // Quick Action: Delete Service Handler
  const handleDeleteService = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    localStorage.setItem("csc_services", JSON.stringify(updated));
  };

  // Toggle Customer Status Block/Unblock
  const handleToggleCustomerStatus = (id: string) => {
    const updated = customers.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === "Active" ? ("Blocked" as const) : ("Active" as const),
        };
      }
      return c;
    });
    setCustomers(updated);
    localStorage.setItem("csc_customers", JSON.stringify(updated));
  };

  // Handle Application State Progress
  const handleApproveApp = (appId: string, status: "Pending" | "Processing" | "Approved" | "Rejected") => {
    const remark =
      status === "Approved"
        ? "तुमचा अर्ज यशस्वीरित्या मंजूर झाला आहे! (Your application is officially Approved!)"
        : status === "Rejected"
        ? "अपूर्ण कागदपत्रांमुळे किंवा शुल्काअभावी अर्ज नाकारला आहे. (Application Rejected due to incomplete details.)"
        : "प्रशासकीय प्रक्रियेसाठी फाईल पुढे पाठवली आहे. (Under bureaucratic process.)";

    const updated = applications.map((a) => {
      if (a.id === appId) {
        return {
          ...a,
          status,
          remarks: remark,
        };
      }
      return a;
    });
    setApplications(updated);
    localStorage.setItem("csc_applications", JSON.stringify(updated));
  };

  // Toggle Banner state
  const handleToggleBanner = (id: string) => {
    const updated = banners.map((b) => {
      if (b.id === id) {
        return { ...b, active: !b.active };
      }
      return b;
    });
    setBanners(updated);
    localStorage.setItem("csc_banners", JSON.stringify(updated));
  };

  // Add Banner Handler
  const handleAddBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bannerObject: AppBanner = {
      id: `BAN-${(banners.length + 101).toString()}`,
      title: newBanner.title || "Untitled Offer",
      imageUrl: newBanner.imageUrl,
      type: newBanner.type,
      active: true,
      startDate: newBanner.startDate,
      endDate: newBanner.endDate,
      targetAudience: newBanner.targetAudience,
    };

    const updated = [...banners, bannerObject];
    setBanners(updated);
    localStorage.setItem("csc_banners", JSON.stringify(updated));
    setShowAddBanner(false);
    setNewBanner({
      title: "",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
      type: "Slider",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      targetAudience: "All",
    });
  };

  // Delete Banner
  const handleDeleteBanner = (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    localStorage.setItem("csc_banners", JSON.stringify(updated));
  };

  // Send Broadcast Notification
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroad.title || !newBroad.message) return;

    const notif: NotificationItem = {
      id: `NOT-${(notifications.length + 101).toString()}`,
      title: newBroad.title,
      message: newBroad.message,
      date: new Date().toLocaleString("en-US", { hour12: true }),
      type: newBroad.type,
      sentTo: "All",
    };

    const updated = [notif, ...notifications];
    setNotifications(updated);
    localStorage.setItem("csc_notifications", JSON.stringify(updated));

    // Reset Form
    setNewBroad({
      title: "",
      message: "",
      type: "Broadcast",
    });
    alert("Live notification pushed successfully to all client app pages!");
  };

  // Clear Broadcast Notif
  const handleClearNotif = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("csc_notifications", JSON.stringify(updated));
  };

  // Save UI Customization
  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    setThemeConfig(editingTheme);
    localStorage.setItem("csc_theme", JSON.stringify(editingTheme));
    alert("System settings and Branding configs updated successfully!");
  };

  // Support Chat reply
  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText || !activeChatMobile) return;

    const chatName = customers.find((c) => c.mobile === activeChatMobile)?.name || "Customer";

    const reply: SupportMessage = {
      id: `MSG-${(supportMessages.length + 101).toString()}`,
      sender: "Admin",
      senderMobile: activeChatMobile,
      senderName: chatName,
      message: adminReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...supportMessages, reply];
    setSupportMessages(updated);
    localStorage.setItem("csc_support", JSON.stringify(updated));
    setAdminReplyText("");
  };

  // Database Backup / Restore simulation
  const handleBackupRestore = (action: "backup" | "restore") => {
    if (action === "backup") {
      const dbDump = {
        customers,
        services,
        applications,
        banners,
        notifications,
        themeConfig,
      };
      const blob = new Blob([JSON.stringify(dbDump, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SK-CSC-Database-Backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      if (confirm("Are you sure you want to restore all tables to original seeds? This resets active logs.")) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  // Mock Export system
  const handleModalExportSimulation = (type: "pdf" | "excel") => {
    const msg =
      type === "pdf"
        ? "Generating high-fidelity PDF earnings report with secure CSC cryptographic stamp...\nDownloaded file: SK_CSC_Financial_Report.pdf"
        : "Compiling Excel spreadsheet with all application statuses, user references, and GST/UTGST reports...\nDownloaded file: SK_CSC_Applications_Ledger.xlsx";
    alert(msg);
  };

  // Get color color-accent background helper
  const getColorAccent = () => {
    switch (themeConfig.primaryColor) {
      case "indigo": return "bg-indigo-600 hover:bg-indigo-700 text-white";
      case "emerald": return "bg-emerald-600 hover:bg-emerald-700 text-white";
      case "sky": return "bg-sky-600 hover:bg-sky-700 text-white";
      case "amber": return "bg-amber-600 hover:bg-amber-700 text-white";
      default: return "bg-indigo-600 hover:bg-indigo-700 text-white";
    }
  };

  const textAccent = () => {
    switch (themeConfig.primaryColor) {
      case "indigo": return "text-indigo-400";
      case "emerald": return "text-emerald-400";
      case "sky": return "text-sky-400";
      case "amber": return "text-amber-400";
      default: return "text-indigo-400";
    }
  };

  const borderAccent = () => {
    switch (themeConfig.primaryColor) {
      case "indigo": return "border-indigo-505/20 focus:border-indigo-500";
      case "emerald": return "border-emerald-505/20 focus:border-emerald-500";
      case "sky": return "border-sky-505/20 focus:border-sky-500";
      case "amber": return "border-amber-505/20 focus:border-amber-500";
      default: return "border-indigo-505/20 focus:border-indigo-500";
    }
  };

  const filteredCustomerChatMobiles = Array.from(
    new Set(supportMessages.map((m) => m.senderMobile))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* SIDE NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo Brand */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wide text-white font-mono block">
                  ADMIN PORTAL
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {themeConfig.centerName.slice(0, 20)}
                </span>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <button
              id="admin-nav-overview"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "overview"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview Analytics</span>
            </button>

            <button
              id="admin-nav-customers"
              onClick={() => setActiveTab("customers")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "customers"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Registry</span>
            </button>

            <button
              id="admin-nav-services"
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "services"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Services Directory</span>
            </button>

            <button
              id="admin-nav-applications"
              onClick={() => setActiveTab("applications")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "applications"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Applications Queue</span>
              {applicationsPending > 0 && (
                <span className="ml-auto bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                  {applicationsPending}
                </span>
              )}
            </button>

            <button
              id="admin-nav-advertisements"
              onClick={() => setActiveTab("advertisements")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "advertisements"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Banners & Marketing</span>
            </button>

            <button
              id="admin-nav-notifications"
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "notifications"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>App Notifications</span>
            </button>

            <button
              id="admin-nav-payments-reports"
              onClick={() => setActiveTab("payments-reports")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "payments-reports"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Earnings / Reports</span>
            </button>

            <button
              id="admin-nav-support-feedback"
              onClick={() => {
                setActiveTab("support-feedback");
                if (filteredCustomerChatMobiles.length > 0 && !activeChatMobile) {
                  setActiveChatMobile(filteredCustomerChatMobiles[0]);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "support-feedback"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Support Chat & feedback</span>
            </button>

            <button
              id="admin-nav-settings-control"
              onClick={() => setActiveTab("settings-control")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "settings-control"
                  ? "bg-slate-800 text-white border-l-4 border-indigo-500"
                  : "text-slate-400 hover:bg-slate-850 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Branding & Controls</span>
            </button>
          </nav>
        </div>

        {/* LOGOUT FOOTER */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-2 bg-slate-950/40">
          <div className="text-[10px] text-slate-500 font-mono text-center">
            LAST LOGIN: {new Date().toLocaleDateString()}
          </div>
          <button
            onClick={onLogout}
            id="admin-logout-btn"
            className="w-full bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Panel</span>
          </button>
        </div>
      </aside>

      {/* ADMIN MAIN CONTENT VIEW */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto max-h-screen">
        {/* Top bar header */}
        <header className="h-16 border-b border-slate-900 bg-slate-900/40 px-6 flex items-center justify-between sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-wide uppercase text-white font-mono">
              System Dashboard
            </h1>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-950/50 px-2.5 py-0.5 rounded border border-indigo-900/50 capitalize">
              {activeTab.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-white font-semibold">SK Admin</span>
              <span className="text-[10px] text-emerald-400 font-mono">ROOT VERIFIED</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black flex items-center justify-center font-mono">
              AD
            </div>
          </div>
        </header>

        {/* WORKSTAGE VIEWPORT */}
        <div className="p-6 space-y-6">
          
          {/* OVERVIEW ANALYTICS TAB */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Scorecard Widget Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                  <div className="flex justify-between items-start text-xs font-medium text-slate-400">
                    <span>Registered Customers</span>
                    <Users className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1.5 font-mono">{totalCustomers}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" /> +12% growth
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                  <div className="flex justify-between items-start text-xs font-medium text-slate-400">
                    <span>Pending Cases</span>
                    <Clock className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1.5 font-mono">
                    {applicationsPending + applicationsProcessing}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                    {applicationsPending} awaiting verification
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                  <div className="flex justify-between items-start text-xs font-medium text-slate-400">
                    <span>Successful Certificates</span>
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1.5 font-mono">{applicationsApproved}</div>
                  <div className="text-[10px] text-slate-400 flex items-center mt-1 font-mono">
                    Success rate: 98.4%
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                  <div className="flex justify-between items-start text-xs font-medium text-slate-400">
                    <span>Total Direct Revenue</span>
                    <CreditCard className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-1.5 font-mono">₹{totalRevenue}</div>
                  <div className="text-[10px] text-amber-400 flex items-center mt-1 font-mono">
                    ₹{pendingRevenue} outstanding ledger
                  </div>
                </div>
              </div>

              {/* Graphic charts section (Vector styled) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Chart 1 */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase text-white font-mono">
                        Monthly Application Volume & Revenue Trend
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Graph representing G2C vs Commercial filings
                      </p>
                    </div>
                    <span className="text-[10.5px] font-mono bg-indigo-950/50 text-indigo-400 border border-indigo-900/80 px-2 py-0.5 rounded">
                      Live Stats
                    </span>
                  </div>

                  {/* SVG Chart Visualization */}
                  <div className="h-48 flex items-end justify-between gap-1 pt-6 px-4 border-b border-l border-slate-800">
                    {[
                      { month: "Jan", count: 42, rev: 3500 },
                      { month: "Feb", count: 58, rev: 5200 },
                      { month: "Mar", count: 81, rev: 7100 },
                      { month: "Apr", count: 96, rev: 8900 },
                      { month: "May", count: 120, rev: 11200 },
                      { month: "Jun", count: 135, rev: 12800 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        {/* Interactive tooltip */}
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-950 border border-slate-800 p-1.5 rounded text-[10px] text-center font-mono pointer-events-none transition-all z-10 whitespace-nowrap">
                          Vol: {item.count} | ₹{item.rev}
                        </div>
                        
                        {/* Revenue Bar */}
                        <div 
                          style={{ height: `${(item.rev / 15000) * 100}%` }} 
                          className="w-4 bg-indigo-500 rounded-t shadow-lg group-hover:bg-indigo-400 transition-all"
                        ></div>
                        {/* Application volume line node */}
                        <div 
                          style={{ bottom: `${(item.count / 150) * 100}%` }}
                          className="absolute w-2 h-2 rounded-full referee-line bg-amber-400 ring-2 ring-slate-900"
                        ></div>

                        <span className="text-[10px] font-mono text-slate-500 mt-2">{item.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center gap-6 text-[10.5px] mt-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3 bg-indigo-500 rounded"></span>
                      <span>Income (₹) Ledger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span>Total Applications Count</span>
                    </div>
                  </div>
                </div>

                {/* Queue status breakdown */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-white font-mono mb-1">
                      Service Demands Profile
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Top chosen certificates this month
                    </p>
                  </div>

                  <div className="space-y-3.5 my-4">
                    {[
                      { name: "Income Certificate", count: 48, percentage: 40, color: "bg-indigo-500" },
                      { name: "Caste Certificate", count: 32, percentage: 26, color: "bg-emerald-500" },
                      { name: "Domicile & Nationality", count: 25, percentage: 20, color: "bg-sky-500" },
                      { name: "PAN / Financial", count: 15, percentage: 14, color: "bg-amber-400" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-300">{item.name}</span>
                          <span className="font-mono text-slate-400">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* System stats summary card */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-[10.5px] text-slate-400 leading-normal">
                      UIDAI / Aaple Sarkar Gateways connected and authenticated using dynamic biometric API stamps.
                    </p>
                  </div>
                </div>
              </div>

              {/* RECENT APPLICATIONS QUICK VIEW */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white font-mono">
                      Recent Activity Feed
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Applications submitted in the last 48 hours
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View Complete Queue →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      <tr>
                        <th className="p-3 rounded-l-lg">ID</th>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Fee Status</th>
                        <th className="p-3">Progress</th>
                        <th className="p-3 text-right rounded-r-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40">
                      {applications.slice(0, 4).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-850/20">
                          <td className="p-3 font-mono text-[11px] text-indigo-400">
                            {app.id}
                          </td>
                          <td className="p-3 font-semibold text-white">
                            {app.customerName}
                          </td>
                          <td className="p-3 text-slate-300">
                            {app.serviceName}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.paymentStatus === "Paid"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border border-amber-520/20"
                            }`}>
                              {app.paymentStatus === "Paid" ? "Paid (₹" + app.amountPaid + ")" : "Unpaid"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide capitalize ${
                              app.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : app.status === "Pending"
                                ? "bg-amber-500/10 text-amber-500 animate-pulse"
                                : app.status === "Processing"
                                ? "bg-sky-500/10 text-sky-400"
                                : "bg-rose-500/10 text-rose-400"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setActiveTab("applications");
                                setAppSearch(app.id);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-2.5 py-1 rounded text-[11px] transition"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* CUSTOMER REGISTRY TAB */}
          {activeTab === "customers" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-905 p-4 rounded-xl border border-slate-850/60">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    Registrations Profile Database ({filteredCustomers.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Find, filter, review documents, and configure access statuses for CSC users
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name, mobile, city..."
                    value={custSearch}
                    onChange={(e) => setCustSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  {custSearch && (
                    <button
                      onClick={() => setCustSearch("")}
                      className="absolute right-3 top-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of customer profile cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-5 hover:border-slate-800 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded">
                            {cust.id}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 ml-2">
                            Reg: {cust.joinedDate}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {cust.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">
                        {cust.name}
                      </h4>

                      <div className="space-y-1.5 my-3 text-xs text-slate-350 font-sans">
                        <div className="flex justify-between border-b border-slate-850/40 pb-1">
                          <span className="text-slate-500">Mobile No:</span>
                          <span className="font-mono font-medium">{cust.mobile}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-850/40 pb-1">
                          <span className="text-slate-500">Email:</span>
                          <span className="truncate max-w-[140px]">{cust.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-850/40 pb-1">
                          <span className="text-slate-500">Address Location:</span>
                          <span className="text-slate-400">{cust.address}, {cust.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Aadhaar (Ref):</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {cust.aadhaarNo || "Not uploaded"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-850/60">
                      <button
                        onClick={() => handleToggleCustomerStatus(cust.id)}
                        className={`flex-1 text-center py-1.5 rounded text-xs font-semibold cursor-pointer ${
                          cust.status === "Active"
                            ? "bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900/40"
                            : "bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/40"
                        }`}
                      >
                        {cust.status === "Active" ? "Block Access" : "Unblock User"}
                      </button>

                      {/* Administrative ID card simulator */}
                      <button
                        onClick={() => {
                          alert(`CSC DIGITAL ID CARD GENERATOR\n==============================\nName: ${cust.name}\nID: ${cust.id}\nRegistered: ${cust.joinedDate}\n==============================\nStamping complete. Saved file in download register!`);
                        }}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-2.5 py-1.5 rounded text-xs font-semibold border border-slate-700/60 cursor-pointer"
                      >
                        Print ID
                      </button>
                    </div>
                  </div>
                ))}

                {filteredCustomers.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-slate-900 border border-slate-850 rounded-xl">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs">No matching customer profile found in records.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SERVICES DIRECTORY TAB */}
          {activeTab === "services" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-905 p-4 rounded-xl border border-slate-850/60">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    Official Services Offered ({services.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control CSC client services, alter processing fees, or add new local certificate forms
                  </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-550" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={srvSearch}
                      onChange={(e) => setSrvSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddService(true)}
                    id="add-new-service-btn"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3.5 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Service
                  </button>
                </div>
              </div>

              {/* SERVICES LIST TABLE */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    <tr>
                      <th className="p-4">CODE</th>
                      <th className="p-4">Service Details</th>
                      <th className="p-4 text-right">Processing Fee</th>
                      <th className="p-4">Filing Time</th>
                      <th className="p-4">Required Documents Checklists</th>
                      <th className="p-4 text-center">Operation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/40">
                    {filteredServices.map((srv) => (
                      <tr key={srv.id} className="hover:bg-slate-850/10">
                        <td className="p-4 font-mono font-semibold text-indigo-400 align-top">
                          {srv.id}
                        </td>
                        <td className="p-4 max-w-sm align-top space-y-1">
                          <div className="font-bold text-white text-sm">
                            {srv.name}
                          </div>
                          <div className="text-xs text-indigo-300 font-semibold font-sans">
                            {srv.nameMarathi}
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {srv.description}
                          </p>
                        </td>
                        <td className="p-4 align-top text-right text-emerald-400 font-bold font-mono text-xs">
                          ₹{srv.fee}
                        </td>
                        <td className="p-4 align-top text-slate-300 text-xs">
                          {srv.processingTime}
                        </td>
                        <td className="p-4 align-top max-w-sm">
                          <div className="flex flex-wrap gap-1.5">
                            {srv.documentsRequired.map((doc, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-950 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-800"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 align-top text-center">
                          <button
                            onClick={() => handleDeleteService(srv.id)}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-1.5 rounded transition cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MODAL: ADD SERVICE */}
              {showAddService && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                        <Plus className="w-4 h-4 text-indigo-400" /> New Service Configuration Form
                      </h4>
                      <button
                        onClick={() => setShowAddService(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddNewService} className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Service Name (English) *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Caste Certificate"
                            value={newSrv.name}
                            onChange={(e) => setNewSrv({ ...newSrv, name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">सेवा नाव (Marathi) *</label>
                          <input
                            type="text"
                            required
                            placeholder="उदा. जातीचा दाखला"
                            value={newSrv.nameMarathi}
                            onChange={(e) => setNewSrv({ ...newSrv, nameMarathi: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Category</label>
                          <select
                            value={newSrv.category}
                            onChange={(e) => setNewSrv({ ...newSrv, category: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                          >
                            <option value="G2C">G2C (Govt to Citizen)</option>
                            <option value="B2C">B2C (Business to Citizen)</option>
                            <option value="Financial">Financial Service</option>
                            <option value="Other">Other Seva</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Service Fee (₹) *</label>
                          <input
                            type="number"
                            required
                            value={newSrv.fee}
                            onChange={(e) => setNewSrv({ ...newSrv, fee: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Filing Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 10 Days"
                            value={newSrv.processingTime}
                            onChange={(e) => setNewSrv({ ...newSrv, processingTime: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Service Description (English)</label>
                        <textarea
                          rows={2}
                          value={newSrv.description}
                          onChange={(e) => setNewSrv({ ...newSrv, description: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">सेवा वर्णन (Marathi)</label>
                        <textarea
                          rows={2}
                          value={newSrv.descriptionMarathi}
                          onChange={(e) => setNewSrv({ ...newSrv, descriptionMarathi: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white resize-none"
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <div>
                          <label className="block text-slate-400 mb-1">
                            Required Docs (Comma separated - English)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Aadhaar Card, Ration Card, Birth certificate"
                            value={newSrv.documentsRequired}
                            onChange={(e) => setNewSrv({ ...newSrv, documentsRequired: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">
                            आवश्यक कागदपत्रे (स्वल्पविराम देऊन प्रविष्ट करा - Marathi)
                          </label>
                          <input
                            type="text"
                            placeholder="उदा. आधार कार्ड, रेशन कार्ड, जन्म दाखला"
                            value={newSrv.documentsRequiredMarathi}
                            onChange={(e) => setNewSrv({ ...newSrv, documentsRequiredMarathi: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-[11px]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2.5 rounded-lg text-xs mt-2 transition cursor-pointer"
                      >
                        Create Official Service Listing
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* APPLICATION QUEUE TAB */}
          {activeTab === "applications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-905 p-4 rounded-xl border border-slate-850/60 font-sans">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    Official Applications Registry
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verify files, inspect payments, and transition review statuses from Desk to Approval.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by candidate name, mobile, app ID..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* APPLICATIONS QUEUE FEED */}
              <div className="space-y-4">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-5 hover:border-slate-805 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      
                      {/* Left: application outline */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span className="font-mono text-indigo-400 font-extrabold bg-indigo-950/40 border border-indigo-900/50 px-2.5 py-0.5 rounded">
                            {app.id}
                          </span>
                          <span className="text-slate-500 font-mono">
                            Filed on: {app.appliedDate}
                          </span>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.paymentStatus === "Paid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}>
                            {app.paymentStatus === "Paid" ? "₹" + app.amountPaid + " Paid" : "₹" + app.amountPaid + " Unpaid"}
                          </span>

                          {app.paymentReference && (
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">
                              Ref: {app.paymentReference}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white">
                            {app.customerName}
                          </h4>
                          <p className="text-xs text-indigo-300 font-sans mt-0.5">
                            Applying for: <strong className="text-white bg-indigo-900/50 px-1 py-0.5 rounded text-[10px] font-mono">{app.serviceName}</strong>
                          </p>
                          <p className="text-xs text-slate-400 font-mono mt-1">
                            Contact: {app.customerMobile}
                          </p>
                        </div>

                        {/* Uploads register */}
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-850/80">
                          <span className="text-[10px] font-bold font-mono text-slate-400 block mb-2 uppercase tracking-wide">
                            Attested Client Documents Registry:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(app.documentsUploaded).length > 0 ? (
                              Object.keys(app.documentsUploaded).map((doc, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] bg-slate-900 text-slate-200 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1.5"
                                >
                                  <span className="p-1 rounded-full bg-emerald-400/10 text-emerald-400 text-[8px] font-black">
                                    ✓
                                  </span>
                                  <span>{doc}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-amber-500 text-[11px] flex items-center gap-1 font-medium italic">
                                <AlertCircle className="w-3.5 h-3.5" /> No files submitted yet. Waiting.
                              </span>
                            )}
                          </div>
                        </div>

                        {app.remarks && (
                          <div className="text-xs text-slate-400 flex items-start gap-1.5 pt-1">
                            <span className="text-slate-500 shrink-0 font-medium">Remarks Log:</span>
                            <span className="italic">"{app.remarks}"</span>
                          </div>
                        )}
                      </div>

                      {/* Right: administrative actions */}
                      <div className="flex flex-col justify-between items-end gap-3 lg:w-60">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">
                            CURRENT STEP
                          </span>
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold font-mono tracking-wider uppercase mt-1 ${
                            app.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : app.status === "Pending"
                              ? "bg-amber-500/10 text-amber-500 animate-pulse border border-amber-500/20"
                              : app.status === "Processing"
                              ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        {/* State Controls Row */}
                        <div className="w-full space-y-2 lg:pt-4">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-right font-bold">
                            Transition Status:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleApproveApp(app.id, "Processing")}
                              className={`py-1.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                                app.status === "Processing"
                                  ? "bg-sky-600 text-white"
                                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
                              }`}
                            >
                              Under Review
                            </button>
                            <button
                              onClick={() => handleApproveApp(app.id, "Approved")}
                              className="bg-emerald-950/30 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-900/40 py-1.5 rounded text-[11px] font-semibold transition cursor-pointer"
                            >
                              Approve Certificate
                            </button>
                            <button
                              onClick={() => handleApproveApp(app.id, "Rejected")}
                              className="bg-rose-950/30 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-900/40 py-1.5 rounded text-[11px] font-semibold transition cursor-pointer"
                            >
                              Reject & Return
                            </button>
                            <button
                              onClick={() => {
                                const newRef = prompt(`Enter Transaction Reference manually (e.g., UPI1029312):`);
                                if (newRef) {
                                  const updated = applications.map((a) => {
                                    if (a.id === app.id) {
                                      return { ...a, paymentStatus: "Paid" as const, paymentReference: newRef };
                                    }
                                    return a;
                                  });
                                  setApplications(updated);
                                  localStorage.setItem("csc_applications", JSON.stringify(updated));
                                }
                              }}
                              className="bg-slate-800 hover:bg-slate-755 text-slate-300 py-1.5 rounded text-[11px] font-semibold transition cursor-pointer"
                            >
                              Force Paid
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}

                {filteredApps.length === 0 && (
                  <div className="p-12 text-center bg-slate-900 border border-slate-850 rounded-xl">
                    <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs">No matching application found in active registry.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ADVERTISEMENT SYSTEM */}
          {activeTab === "advertisements" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-905 p-4 rounded-xl border border-slate-850/60">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    Dynamic Banner Advertisement Systems
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control Home Slider notices, offering popups or side banners shown to clients
                  </p>
                </div>

                <button
                  onClick={() => setShowAddBanner(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3.5 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Banner
                </button>
              </div>

              {/* Advertisement grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((ban) => (
                  <div
                    key={ban.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-750 transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-40 bg-slate-950">
                      <img
                        src={ban.imageUrl}
                        alt={ban.title}
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                          ban.type === "Slider"
                            ? "bg-indigo-650 text-white"
                            : ban.type === "Popup"
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-650 text-white"
                        }`}>
                          {ban.type} Notice
                        </span>
                        <h4 className="text-sm font-black text-white mt-1 leading-tight line-clamp-2">
                          {ban.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 space-y-3.5 text-xs text-slate-350">
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-slate-500 block">START DATE</span>
                          <span className="text-slate-300">{ban.startDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">END DATE</span>
                          <span className="text-slate-300">{ban.endDate}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-850/60">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-mono">TARGET AUDIENCE</span>
                          <strong className="text-slate-300 capitalize">{ban.targetAudience} Applicants</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">
                            {ban.active ? "Status: Live" : "Status: Paused"}
                          </span>
                          <button
                            onClick={() => handleToggleBanner(ban.id)}
                            className={`w-10 h-6.5 rounded-full p-1.5 transition-colors cursor-pointer ${
                              ban.active ? "bg-indigo-505 bg-indigo-600" : "bg-slate-800"
                            }`}
                          >
                            <div className={`bg-white w-3.5 h-3.5 rounded-full transition-transform ${
                              ban.active ? "translate-x-3.5" : "translate-x-0"
                            }`} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-850/60 pt-3 text-[11px]">
                        <span className="text-slate-500 font-mono">ID: {ban.id}</span>
                        <button
                          onClick={() => handleDeleteBanner(ban.id)}
                          className="text-rose-450 text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" /> Remove Banner
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MODAL: ADD BANNER */}
              {showAddBanner && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-400" /> New Banner configuration
                      </h4>
                      <button
                        onClick={() => setShowAddBanner(false)}
                        className="text-slate-400 hover:text-white pointer-events-auto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddBannerSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Banner Title/Notification Headline *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Caste Certificate Discount Offer!"
                          value={newBanner.title}
                          onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Illustration/Image URL *</label>
                        <input
                          type="url"
                          required
                          value={newBanner.imageUrl}
                          onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Tip: Use Unsplash or static high-quality graphics values.
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">Adv Type</label>
                          <select
                            value={newBanner.type}
                            onChange={(e) => setNewBanner({ ...newBanner, type: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                          >
                            <option value="Slider">Ad Slider</option>
                            <option value="Popup">Popup Advertisement</option>
                            <option value="Offer">Exclusive Offer Page</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Target Client Group</label>
                          <select
                            value={newBanner.targetAudience}
                            onChange={(e) => setNewBanner({ ...newBanner, targetAudience: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                          >
                            <option value="All">All Users</option>
                            <option value="New">New Registrants</option>
                            <option value="Existing">Loyal Active Customers</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <label className="block text-slate-400 mb-1">START DATE</label>
                          <input
                            type="date"
                            value={newBanner.startDate}
                            onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">END DATE</label>
                          <input
                            type="date"
                            value={newBanner.endDate}
                            onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2.5 rounded-lg text-xs mt-2 transition cursor-pointer"
                      >
                        Publish Advertisement
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* APP BROADCAST NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Broadcast form */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 h-fit">
                  <h3 className="text-xs font-bold uppercase text-white font-mono mb-1">
                    Send Alert Broadcast
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4 font-sans">
                    Launch notifications instantly to our user portal dashboards.
                  </p>

                  <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-slate-400 mb-1">Broadcast Title (Marathi/English) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. आधार बँक लिंक आवश्यक नोटीस!"
                        value={newBroad.title}
                        onChange={(e) => setNewBroad({ ...newBroad, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Broadcast message body *</label>
                      <textarea
                        required
                        placeholder="उदा. प्रिय ग्राहक, आपल्या आधार कार्ड ला युपीआय पेमेंट सुरु करण्यासाठी..."
                        rows={4}
                        value={newBroad.message}
                        onChange={(e) => setNewBroad({ ...newBroad, message: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Notification Priority Mark</label>
                      <select
                        value={newBroad.type}
                        onChange={(e) => setNewBroad({ ...newBroad, type: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      >
                        <option value="Broadcast">Broadcast Notice (Standard)</option>
                        <option value="Update">App Core Update</option>
                        <option value="Alert">High Security Warning</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs mt-2 transition cursor-pointer"
                    >
                      Broadcast Message Now
                    </button>
                  </form>
                </div>

                {/* Notifications list feed */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-white font-mono mb-1">
                      Active Notifications Archive
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Currently visible alerts on customer dashboards
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 bg-slate-950 border border-slate-850 rounded-lg flex items-start gap-3 hover:border-slate-800 transition"
                      >
                        <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 uppercase font-mono text-[9px] font-bold ${
                          notif.type === "Alert"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : notif.type === "Update"
                            ? "bg-indigo-505/10 bg-indigo-950/40 text-indigo-400 border border-indigo-900/50"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {notif.type}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-white uppercase leading-normal">
                              {notif.title}
                            </h4>
                            <span className="font-mono text-[9.5px] text-slate-500 whitespace-nowrap">
                              {notif.date}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed font-sans">
                            {notif.message}
                          </p>
                          <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 font-mono">
                            <span>Target: {notif.sentTo} Users</span>
                            <button
                              onClick={() => handleClearNotif(notif.id)}
                              className="text-slate-500 hover:text-rose-400 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Alert
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {notifications.length === 0 && (
                      <p className="text-center py-10 text-slate-550 text-xs italic">
                        No notifications currently active.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* PAYMENTS & REPORTS TAB */}
          {activeTab === "payments-reports" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-slate-905 p-4 rounded-xl border border-slate-850/60 font-mono">
                <div>
                  <h3 className="text-sm font-bold uppercase text-white">
                    Official Financial Summary Ledger
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    Full GST breakdown and fee audit outputs for year {new Date().getFullYear()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleModalExportSimulation("excel")}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-1.5 px-3 rounded text-xs flex items-center gap-1 transition border border-slate-700/60 cursor-pointer"
                  >
                    <Download className="w-4.5 h-4.5" /> Export Excel
                  </button>
                  <button
                    onClick={() => handleModalExportSimulation("pdf")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-4.5 h-4.5" /> Export PDF
                  </button>
                </div>
              </div>

              {/* Transactions roster */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-white font-mono">
                  Attested Application Fee Ledgers
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      <tr>
                        <th className="p-3">Receipt Ref</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Service Name</th>
                        <th className="p-3">Application Fee</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Cryptographic Trace Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40">
                      {applications.map((app, idx) => (
                        <tr key={idx} className="hover:bg-slate-850/10">
                          <td className="p-3 font-mono font-black text-indigo-400">
                            {app.paymentReference || "N/A - PENDING"}
                          </td>
                          <td className="p-3 font-semibold text-white">
                            {app.customerName}
                          </td>
                          <td className="p-3">
                            {app.serviceName}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-300">
                            ₹{app.amountPaid}
                          </td>
                          <td className="p-3 font-mono">
                            {app.appliedDate}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.paymentStatus === "Paid"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-500"
                            }`}>
                              {app.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-500">
                            {app.paymentStatus === "Paid" ? "GATEWAY_VERIFIED" : "AWAITING_UPI_WEBHOOK"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUPPORT CHAT & FEEDBACK TAB */}
          {activeTab === "support-feedback" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chat Panel */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden lg:col-span-2 flex flex-col h-[500px]">
                  
                  {/* Chat header */}
                  <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                        CSC Helpdesk Support Tunnel
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Chatting with: <strong className="text-indigo-400">{activeChatMobile || "Select client below"}</strong>
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      SYSTEM_OK
                    </span>
                  </div>

                  {/* Chat logs render */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/20">
                    {supportMessages
                      .filter((m) => m.senderMobile === activeChatMobile)
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[80%] ${
                            msg.sender === "Admin" ? "ml-auto items-end" : "mr-auto items-start"
                          }`}
                        >
                          <div className={`p-3 rounded-lg text-xs leading-relaxed font-sans ${
                            msg.sender === "Admin"
                              ? "bg-indigo-600 text-white rounded-tr-none"
                              : "bg-slate-800 text-slate-200 rounded-tl-none"
                          }`}>
                            {msg.message}
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 font-mono">
                            {msg.sender === "Admin" ? "You" : msg.senderName} • {msg.timestamp}
                          </span>
                        </div>
                      ))}

                    {supportMessages.filter((m) => m.senderMobile === activeChatMobile).length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-550 font-sans italic text-xs gap-2">
                        <span>No chat selected. Select one from the side list to query.</span>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendAdminReply} className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2">
                    <input
                      type="text"
                      disabled={!activeChatMobile}
                      placeholder={activeChatMobile ? "Type reply..." : "Select client conversation..."}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!activeChatMobile}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Client chat select list & Feedbacks */}
                <div className="space-y-6 flex flex-col justify-between h-[500px]">
                  
                  {/* Select register */}
                  <div className="bg-slate-900 border border-slate-850 rounded-xl p-4.5 flex-1 overflow-y-auto">
                    <h5 className="text-[10.5px] font-bold font-mono text-slate-400 uppercase tracking-widest block mb-3">
                      Active Conversations List:
                    </h5>

                    <div className="space-y-1.5">
                      {filteredCustomerChatMobiles.map((mob, idx) => {
                        const count = supportMessages.filter((m) => m.senderMobile === mob).length;
                        const lastMsg = supportMessages.filter((m) => m.senderMobile === mob).slice(-1)[0]?.message || "";
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveChatMobile(mob)}
                            className={`w-full text-left p-3 rounded-lg text-xs flex flex-col gap-1 transition-all ${
                              activeChatMobile === mob
                                ? "bg-slate-800 text-white border-l-2 border-indigo-500"
                                : "bg-slate-950 text-slate-400 hover:bg-slate-850"
                            }`}
                          >
                            <div className="flex justify-between font-bold items-center">
                              <span>Customer +91 {mob}</span>
                              <span className="font-mono text-[9px] bg-slate-900 px-1.5 py-0.2 rounded">
                                {count} logs
                              </span>
                            </div>
                            <p className="truncate text-[11px] text-slate-500">"{lastMsg}"</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback registry quick reviews */}
                  <div className="bg-slate-900 border border-slate-850 rounded-xl p-4.5 max-h-[220px] overflow-y-auto">
                    <h5 className="text-[10.5px] font-bold font-mono text-slate-400 uppercase tracking-widest block mb-2.5">
                      Client Feedbacks ({feedbacks.length}):
                    </h5>

                    <div className="space-y-2">
                      {feedbacks.map((f) => (
                        <div key={f.id} className="p-2.5 bg-slate-950 rounded border border-slate-850">
                          <div className="flex justify-between items-center text-[10px]">
                            <strong className="text-slate-350">{f.customerName}</strong>
                            <span className="text-amber-400 font-mono">{"★".repeat(f.rating)}</span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 italic font-sans leading-normal mt-1">
                            "{f.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* BRANDING, THEME, & PORTAL CONTROLS TAB */}
          {activeTab === "settings-control" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Accent Customizer Theme Change */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-4 h-fit">
                  <div>
                    <h4 className="text-sm font-bold uppercase text-white font-mono flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-indigo-400" /> CSC Customizer & Branding
                    </h4>
                    <p className="text-xs text-slate-450 text-slate-400">
                      Alter text headings, support coordinates, UPI ID configurations and select accent colors.
                    </p>
                  </div>

                  <form onSubmit={handleSaveTheme} className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-slate-450 text-slate-400 mb-1">CSC Center Name (Official Display) *</label>
                      <input
                        type="text"
                        required
                        value={editingTheme.centerName}
                        onChange={(e) => setEditingTheme({ ...editingTheme, centerName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Support Phone No *</label>
                        <input
                          type="tel"
                          required
                          value={editingTheme.contactNumber}
                          onChange={(e) => setEditingTheme({ ...editingTheme, contactNumber: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Billing UPI ID *</label>
                        <input
                          type="text"
                          required
                          value={editingTheme.upiId}
                          onChange={(e) => setEditingTheme({ ...editingTheme, upiId: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Accent Color Palettes Selection */}
                    <div>
                      <span className="block text-slate-400 mb-2 font-bold uppercase tracking-wider text-[10px]">
                        Accent Color Theme:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { key: "indigo", name: "Royal Indigo", hex: "bg-indigo-600" },
                          { key: "emerald", name: "Green Mint", hex: "bg-emerald-600" },
                          { key: "sky", name: "Cyber Sky", hex: "bg-sky-600" },
                          { key: "amber", name: "Aaple Amber", hex: "bg-amber-600" },
                        ].map((c) => (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setEditingTheme({ ...editingTheme, primaryColor: c.key })}
                            className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1.5 justify-center cursor-pointer ${
                              editingTheme.primaryColor === c.key
                                ? "border-indigo-500 bg-indigo-950/20 text-white"
                                : "border-slate-800 bg-slate-950 text-slate-400"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${c.hex}`}></span>
                            <span className="text-[10px] font-medium scale-95">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2.5 rounded-lg text-xs mt-2 transition cursor-pointer"
                    >
                      Save & Apply Themes
                    </button>
                  </form>
                </div>

                {/* DB backups, updates registers, verification lists */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase text-white font-mono flex items-center gap-2">
                      <Database className="w-4 h-4 text-amber-400" /> Database Backup & Recovery
                    </h4>
                    <p className="text-xs text-slate-400">
                      Instantly clone, backup, or restore customer directory structures, banners, and fee logs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-2.5">
                      <span className="text-[10.5px] font-bold font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/45 px-2 py-0.5 rounded">
                        OFFLINE SAFE SQL CLONE
                      </span>
                      <p className="text-xs text-slate-350 leading-relaxed font-sans">
                        Saves active schema registries as standard encrypted JSON datasets. Compatible with manual recovery steps.
                      </p>
                      <button
                        onClick={() => handleBackupRestore("backup")}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition select-none cursor-pointer"
                      >
                        <RefreshCcw className="w-4 h-4" /> Download Db Backup
                      </button>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-2.5">
                      <span className="text-[10.5px] font-bold font-mono text-amber-400 bg-amber-950/40 border border-amber-900/45 px-2 py-0.5 rounded">
                        RESTORE SEED RECORDS
                      </span>
                      <p className="text-xs text-slate-350 leading-relaxed font-sans">
                        Clears corrupted browser cache registries and restores tables back onto fresh initial templates instantly.
                      </p>
                      <button
                        onClick={() => handleBackupRestore("restore")}
                        className="w-full bg-rose-950/30 text-rose-400 border border-rose-900/40 hover:bg-rose-600 hover:text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1 transition select-none cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Reset To Initial Seeds
                      </button>
                    </div>
                  </div>

                  {/* Quick verification guidelines */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg flex gap-3 text-xs leading-relaxed text-slate-400 font-sans">
                    <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Attention Administrator:</strong> Please double-check documents inside the Customer registry before approving applications. The Tahsildar biometric gateway flags incomplete filings.
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
