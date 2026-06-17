import { ServiceItem, Customer, ApplicationRecord, AppBanner, NotificationItem, SupportMessage, FeedbackRecord, AppThemeConfig } from "./types";

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "SRV-001",
    name: "Income Certificate",
    nameMarathi: "उत्पन्नाचा दाखला",
    category: "G2C",
    description: "Official certificate verifying annual household income Issued by Tahsildar Office.",
    descriptionMarathi: "तहसीलदार कार्यालयामार्फत जारी करण्यात येणारे वार्षिक कौटुंबिक उत्पन्नाचे प्रमाणपत्र.",
    fee: 150,
    documentsRequired: ["Aadhaar Card", "Ration Card", "Identity/Address Proof", "Land Receipt / 7/12 (if agricultural)", "Talathi Income Report", "Self Declaration Form"],
    documentsRequiredMarathi: ["आधार कार्ड", "रेशन कार्ड", "ओळख/पत्ता पुरावा", "जमीन महसूल पावती / ७/१२ उतारा", "तलाठी उत्पन्न अहवाल", "स्वयं घोषणापत्र"],
    processingTime: "7 to 15 Days"
  },
  {
    id: "SRV-002",
    name: "Caste Certificate",
    nameMarathi: "जातीचे प्रमाणपत्र",
    category: "G2C",
    description: "Official certificate verifying community and caste category for education and government benefits.",
    descriptionMarathi: "शिक्षण आणि शासकीय सवलतींसाठी जात आणि प्रवर्ग सिद्ध करणणारे अधिकृत प्रमाणपत्र.",
    fee: 180,
    documentsRequired: ["Aadhaar Card", "School Leaving Certificate", "Father's Caste Proof", "Ration Card", "Affidavit for Caste", "1950/1967/1978 Address Proof of ancestry"],
    documentsRequiredMarathi: ["आधार कार्ड", "शाळा सोडल्याचा दाखला", "वडिलांच्या जातीचा पुरावा", "रेशन कार्ड", "जातीचा प्रतिज्ञापत्र", "पूर्वजांचा महाराष्ट्र रहिवासी पुरावा (१९५०/१९६७/१९७८)"],
    processingTime: "15 to 21 Days"
  },
  {
    id: "SRV-003",
    name: "Non-Creamy Layer",
    nameMarathi: "नॉन-क्रिमी लेयर प्रमाणपत्र",
    category: "G2C",
    description: "Certificate certifying household income falls below standard non-creamy layer threshold for OBC/VJNT quotas.",
    descriptionMarathi: "इतर मागासवर्गीय (OBC) आणि विमुक्त जाती व भटक्या जमाती (VJNT) प्रवर्गातील आरक्षणासाठी आवश्यक प्रमाणपत्र.",
    fee: 200,
    documentsRequired: ["Caste Certificate", "Previous 3 Years Income Certificate", "Aadhaar Card", "Ration Card", "Affidavit", "School Leaving Certificate"],
    documentsRequiredMarathi: ["जात प्रमाणपत्र", "मागील ३ वर्षाचे उत्पन्न प्रमाण पत्र", "आधार कार्ड", "रेशन कार्ड", "प्रतिज्ञापत्र", "शाळा सोडल्याचा दाखला"],
    processingTime: "15 to 30 Days"
  },
  {
    id: "SRV-004",
    name: "New PAN Card Application",
    nameMarathi: "नवीन पॅन कार्ड नोंदणी",
    category: "Financial",
    description: "Permanent Account Number card application for tax-related filings, bank account openings, and ID proof.",
    descriptionMarathi: "कर भरणे, बँक खाते उघडणे आणि ओळख पुराव्यासाठी स्थायी खाते क्रमांक (PAN) अर्ज.",
    fee: 120,
    documentsRequired: ["Aadhaar Card with full DOB check", "Two Passport-Sized Photographs", "Signature Sample on Form-49A"],
    documentsRequiredMarathi: ["पूर्ण जन्मतारखेसह आधार कार्ड", "दोन पासपोर्ट आकाराचे फोटो", "अर्ज ४९ए वर स्वाक्षरी नमुना"],
    processingTime: "7 to 10 Days"
  },
  {
    id: "SRV-005",
    name: "Aadhaar Card Upgradation Service",
    nameMarathi: "आधार कार्ड दुरुस्ती",
    category: "G2C",
    description: "Address update, Mobile number linking, Name correction, and Date of Birth editing support.",
    descriptionMarathi: "पत्ता दुरुस्ती, मोबाईल नंबर जोडणे, नावातील चूक आणि जन्मतारीख दुरुस्ती सहाय्य.",
    fee: 80,
    documentsRequired: ["Aadhaar Card copy", "Supporting Document for correction (Voter Card/Passport/Leaving Cert)", "Active Mobile for OTP verification"],
    documentsRequiredMarathi: ["आधार कार्ड नमुना प्रत", "दुरुस्तीसाठी सहाय्यक अधिकृत पुरावा (मतदान कार्ड/पासपोर्ट/शाळा सोडल्याचा दाखला)", "ओटीपीसाठी सक्रिय मोबाईल नंबर"],
    processingTime: "5 to 7 Days"
  },
  {
    id: "SRV-006",
    name: "Domicile & Nationality",
    nameMarathi: "रहिवासी आणि राष्ट्रीयत्व प्रमाणपत्र",
    category: "G2C",
    description: "Certificate proving continuous residence of 15 years in Maharashtra State and Indian Citizenship.",
    descriptionMarathi: "महाराष्ट्र राज्यात १५ वर्षे सलग वास्तव्याचा पुरावा आणि भारतीय राष्ट्रीयत्व सिद्ध करणारे प्रमाणपत्र.",
    fee: 150,
    documentsRequired: ["Aadhaar Card", "Ration Card", "School Leaving Certificate", "Age Proof (Birth Certificate/LC)", "Residence Proof (Electric Bill/Tax Receipt)", "Affidavit of 15-year residence"],
    documentsRequiredMarathi: ["आधार कार्ड", "रेशन कार्ड", "शाळा सोडल्याचा दाखला", "वयाचा पुरावा (जन्म दाखला / एल.सी.)", "रहिवासी पुरावा (वीज बिल/घरपट्टी)", "१५ वर्षे वास्तव्याचे प्रतिज्ञापत्र"],
    processingTime: "15 to 21 Days"
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001",
    name: "Sukhadev Kukude",
    mobile: "9420304050",
    email: "sukhadev.kukude@gmail.com",
    address: "At Post Malegaon, Taluka Haveli",
    city: "Pune",
    joinedDate: "2026-01-10",
    status: "Active",
    aadhaarNo: "4567 8901 2345",
    panNo: "ABCDE1234F"
  },
  {
    id: "CUST-002",
    name: "Rahul Vitthal Patil",
    mobile: "8888999901",
    email: "rahul.patil@outlook.com",
    address: "Shaniwar Peth, Lane 4",
    city: "Kolhapur",
    joinedDate: "2026-03-15",
    status: "Active",
    aadhaarNo: "9012 3456 7890",
    panNo: "XYZW9876K"
  },
  {
    id: "CUST-003",
    name: "Priyanka Sunil Mane",
    mobile: "7777123456",
    email: "priyanka.mane@yahoo.com",
    address: "Vikas Nagar, Near Water Tank",
    city: "Satara",
    joinedDate: "2026-05-20",
    status: "Active",
    aadhaarNo: "1122 3344 5566"
  }
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "APP-5001",
    customerMobile: "9420304050",
    customerName: "Sukhadev Kukude",
    serviceId: "SRV-001",
    serviceName: "Income Certificate",
    appliedDate: "2026-06-10",
    status: "Approved",
    amountPaid: 150,
    paymentStatus: "Paid",
    paymentReference: "UPI9028340129",
    documentsUploaded: {
      "Aadhaar Card": "uploaded_base64_demo",
      "Ration Card": "uploaded_base64_demo",
    },
    remarks: "Your income certificate has been issued. Click 'Download Certificate' from receipt."
  },
  {
    id: "APP-5002",
    customerMobile: "8888999901",
    customerName: "Rahul Vitthal Patil",
    serviceId: "SRV-002",
    serviceName: "Caste Certificate",
    appliedDate: "2026-06-14",
    status: "Processing",
    amountPaid: 180,
    paymentStatus: "Paid",
    paymentReference: "UPI7710294812",
    documentsUploaded: {
      "Aadhaar Card": "uploaded",
      "School Leaving Certificate": "uploaded"
    },
    remarks: "Under review at Tahsildar office. Document verification is ongoing."
  },
  {
    id: "APP-5003",
    customerMobile: "9420304050",
    customerName: "Sukhadev Kukude",
    serviceId: "SRV-004",
    nameMarathi: "नवीन पॅन कार्ड नोंदणी",
    serviceName: "New PAN Card Application",
    appliedDate: "2026-06-15",
    status: "Pending",
    amountPaid: 120,
    paymentStatus: "Unpaid",
    documentsUploaded: {},
    remarks: "Please complete the payment of ₹120 to start processing."
  }
];

export const INITIAL_BANNERS: AppBanner[] = [
  {
    id: "BAN-001",
    title: "Pradhan Mantri Shram Yogi Maandhan Scheme (PMSYM)",
    imageUrl: "https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=1200",
    type: "Slider",
    active: true,
    link: "https://maandhan.in",
    startDate: "2026-06-01",
    endDate: "2026-07-30",
    targetAudience: "All"
  },
  {
    id: "BAN-002",
    title: "Special Offer: Apply for Domicile + Income Together & Get ₹50 Discount!",
    imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1200",
    type: "Offer",
    active: true,
    startDate: "2026-06-10",
    endDate: "2026-06-25",
    targetAudience: "Existing"
  },
  {
    id: "BAN-003",
    title: "Attention: Aadhaar Mobile Linking is mandatory for college admissions!",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600",
    type: "Popup",
    active: true,
    startDate: "2026-06-12",
    endDate: "2026-06-20",
    targetAudience: "All"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOT-001",
    title: "मराठी राजपत्र नोंदणी नवीन वैशिष्ट्य सुरू!",
    message: "CSC Center मध्ये आता शासकीय राजपत्र (Gazette Name Change) सेवा सुरू झाली आहे. नाव बदल, जन्मतारीख दुरुस्तीसाठी त्वरित संपर्क साधा.",
    date: "2026-06-16 10:30 AM",
    type: "Update",
    sentTo: "All"
  },
  {
    id: "NOT-002",
    title: "Admissions Notice: Keep Caste Certificates Ready!",
    message: "FYJC and Degree College admission schedules are approaching fast. Apply for Caste and Non-Creamy certificates immediately to avoid last-minute rush.",
    date: "2026-06-14 04:15 PM",
    type: "Broadcast",
    sentTo: "All"
  },
  {
    id: "NOT-003",
    title: "Scheduled Maintenance for UIDAI Portal",
    message: "The Aadhaar server portal will face brief downtime tonight from 11:00 PM to 02:00 AM. Aadhaar updates won't be submitted during these hours.",
    date: "2026-06-13 09:00 AM",
    type: "Alert",
    sentTo: "All"
  }
];

export const INITIAL_SUPPORT: SupportMessage[] = [
  {
    id: "MSG-001",
    sender: "Customer",
    senderMobile: "9420304050",
    senderName: "Sukhadev Kukude",
    message: "Hello sir, I have uploaded Talathi report for my Income Certificate. When will it be ready?",
    timestamp: "2026-06-16 02:15 PM"
  },
  {
    id: "MSG-002",
    sender: "Admin",
    senderMobile: "9420304050",
    senderName: "Sukhadev Kukude",
    message: "Hello Sukhadev, yes, we received your Talathi form! Your application is submitted to the Tahsildar desk. It should be approved in 3-4 working days.",
    timestamp: "2026-06-16 03:00 PM"
  }
];

export const INITIAL_FEEDBACK: FeedbackRecord[] = [
  {
    id: "FED-001",
    customerName: "Sukhadev Kukude",
    mobile: "9420304050",
    rating: 5,
    comment: "Excellent service! Visited many centers but here the work was done very cleanly and and support is also very quick on WhatsApp.",
    date: "2026-06-16"
  },
  {
    id: "FED-002",
    customerName: "Rahul Vitthal Patil",
    mobile: "8888999901",
    rating: 4,
    comment: "The automatic SMS & update alerts on my application are very helpful. No need to visit the center again and again.",
    date: "2026-06-15"
  }
];

export const INITIAL_THEME: AppThemeConfig = {
  primaryColor: "indigo",
  centerName: "SK CSC DIGITAL CENTER",
  contactNumber: "9420304050",
  upiId: "9420304050@ybl",
  logoUrl: ""
};

// Local storage helpers
export const loadLocalStorage = {
  services: (): ServiceItem[] => {
    const data = localStorage.getItem("csc_services");
    if (!data) {
      localStorage.setItem("csc_services", JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(data);
  },
  customers: (): Customer[] => {
    const data = localStorage.getItem("csc_customers");
    if (!data) {
      localStorage.setItem("csc_customers", JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(data);
  },
  applications: (): ApplicationRecord[] => {
    const data = localStorage.getItem("csc_applications");
    if (!data) {
      localStorage.setItem("csc_applications", JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(data);
  },
  banners: (): AppBanner[] => {
    const data = localStorage.getItem("csc_banners");
    if (!data) {
      localStorage.setItem("csc_banners", JSON.stringify(INITIAL_BANNERS));
      return INITIAL_BANNERS;
    }
    return JSON.parse(data);
  },
  notifications: (): NotificationItem[] => {
    const data = localStorage.getItem("csc_notifications");
    if (!data) {
      localStorage.setItem("csc_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  },
  support: (): SupportMessage[] => {
    const data = localStorage.getItem("csc_support");
    if (!data) {
      localStorage.setItem("csc_support", JSON.stringify(INITIAL_SUPPORT));
      return INITIAL_SUPPORT;
    }
    return JSON.parse(data);
  },
  feedback: (): FeedbackRecord[] => {
    const data = localStorage.getItem("csc_feedback");
    if (!data) {
      localStorage.setItem("csc_feedback", JSON.stringify(INITIAL_FEEDBACK));
      return INITIAL_FEEDBACK;
    }
    return JSON.parse(data);
  },
  theme: (): AppThemeConfig => {
    const data = localStorage.getItem("csc_theme");
    if (!data) {
      localStorage.setItem("csc_theme", JSON.stringify(INITIAL_THEME));
      return INITIAL_THEME;
    }
    return JSON.parse(data);
  },
  save: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
