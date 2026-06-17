/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Splash from "./components/Splash";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import CustomerDashboard from "./components/CustomerDashboard";
import { loadLocalStorage } from "./data";
import {
  Customer,
  ServiceItem,
  ApplicationRecord,
  AppBanner,
  NotificationItem,
  SupportMessage,
  FeedbackRecord,
  AppThemeConfig
} from "./types";

export default function App() {
  const [splashActive, setSplashActive] = useState(true);
  const [sessionRole, setSessionRole] = useState<"admin" | "customer" | null>(null);
  const [currentMobile, setCurrentMobile] = useState<string | null>(null);

  // Core synchronized application states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [banners, setBanners] = useState<AppBanner[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>({
    primaryColor: "indigo",
    centerName: "SK CSC DIGITAL CENTER",
    contactNumber: "9420304050",
    upiId: "9420304050@ybl"
  });

  // Load database seeds on first run
  useEffect(() => {
    setCustomers(loadLocalStorage.customers());
    setServices(loadLocalStorage.services());
    setApplications(loadLocalStorage.applications());
    setBanners(loadLocalStorage.banners());
    setNotifications(loadLocalStorage.notifications());
    setSupportMessages(loadLocalStorage.support());
    setFeedbacks(loadLocalStorage.feedback());
    setThemeConfig(loadLocalStorage.theme());
  }, []);

  const handleLoginSuccess = (role: "admin" | "customer", mobileOrUser?: string) => {
    setSessionRole(role);
    if (role === "customer" && mobileOrUser) {
      setCurrentMobile(mobileOrUser);
    }
  };

  const handleRegisterCustomer = (newCustomer: Customer) => {
    const updated = [...customers, newCustomer];
    setCustomers(updated);
    loadLocalStorage.save("csc_customers", updated);
  };

  const handleLogout = () => {
    setSessionRole(null);
    setCurrentMobile(null);
  };

  // Render main routing stage with transition effects
  return (
    <div className="font-sans antialiased text-slate-200">
      {splashActive ? (
        <Splash
          centerName={themeConfig.centerName}
          onComplete={() => setSplashActive(false)}
        />
      ) : sessionRole === null ? (
        <Login
          centerName={themeConfig.centerName}
          customers={customers}
          onLoginSuccess={handleLoginSuccess}
          onRegisterCustomer={handleRegisterCustomer}
        />
      ) : sessionRole === "admin" ? (
        <AdminPanel
          customers={customers}
          setCustomers={setCustomers}
          services={services}
          setServices={setServices}
          applications={applications}
          setApplications={setApplications}
          banners={banners}
          setBanners={setBanners}
          notifications={notifications}
          setNotifications={setNotifications}
          supportMessages={supportMessages}
          setSupportMessages={setSupportMessages}
          feedbacks={feedbacks}
          onLogout={handleLogout}
          themeConfig={themeConfig}
          setThemeConfig={setThemeConfig}
        />
      ) : (
        <CustomerDashboard
          currentMobile={currentMobile || ""}
          customers={customers}
          setCustomers={setCustomers}
          services={services}
          applications={applications}
          setApplications={setApplications}
          banners={banners}
          notifications={notifications}
          supportMessages={supportMessages}
          setSupportMessages={setSupportMessages}
          feedbacks={feedbacks}
          setFeedbacks={setFeedbacks}
          onLogout={handleLogout}
          themeConfig={themeConfig}
        />
      )}
    </div>
  );
}
