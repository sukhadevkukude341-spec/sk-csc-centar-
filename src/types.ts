export interface ServiceItem {
  id: string;
  name: string;
  nameMarathi: string;
  category: "G2C" | "B2C" | "Financial" | "Other";
  description: string;
  descriptionMarathi: string;
  fee: number;
  documentsRequired: string[];
  documentsRequiredMarathi: string[];
  processingTime: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  joinedDate: string;
  status: "Active" | "Blocked";
  aadhaarNo?: string;
  panNo?: string;
}

export interface ApplicationRecord {
  id: string;
  customerMobile: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  appliedDate: string;
  status: "Pending" | "Processing" | "Approved" | "Rejected";
  amountPaid: number;
  paymentStatus: "Paid" | "Unpaid";
  paymentReference?: string;
  documentsUploaded: { [docName: string]: string }; // Maps document requirement to dummy base64 or status
  remarks?: string;
}

export interface AppBanner {
  id: string;
  title: string;
  imageUrl: string;
  type: "Slider" | "Popup" | "Offer";
  active: boolean;
  link?: string;
  startDate: string;
  endDate: string;
  targetAudience: "All" | "New" | "Existing";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "Broadcast" | "Update" | "Alert";
  sentTo: string;
}

export interface SupportMessage {
  id: string;
  sender: "Admin" | "Customer";
  senderMobile: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export interface FeedbackRecord {
  id: string;
  customerName: string;
  mobile: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppThemeConfig {
  primaryColor: string; // Tailwind class background
  centerName: string;
  contactNumber: string;
  upiId: string;
  logoUrl?: string;
}
