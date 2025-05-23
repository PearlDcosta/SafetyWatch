export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface CrimeReport {
  id: string;
  title: string;
  description: string;
  crimeType: string;
  location: {
    address: string;
    geoPoint: GeoPoint;
  };
  date: string; // ISO string format
  time: string;
  images?: {
    url: string; // Base64 encoded image data
    publicId: string; // Unique identifier
    thumbnail: string; // Base64 encoded thumbnail
  }[];
  status: "pending" | "reviewing" | "verified" | "resolved" | "rejected"; // Updated statuses
  isAnonymous: boolean;
  reporterId?: string; // Only set if not anonymous
  reporterName?: string; // Only set if not anonymous
  reporterContact: string; // <-- Now required, not optional
  actionDetails?: string; // Added by admin when taking action
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  trackingId?: string; // Optional tracking ID for anonymous reports
}
