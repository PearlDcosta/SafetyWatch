import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CrimeReport, GeoPoint } from "@/types";
import { uploadImage, checkImagesSize } from "./storageLocal"; // Using local Base64 storage instead of external services

// Create a new crime report
export async function createCrimeReport(
  reportData: Omit<CrimeReport, "id" | "createdAt" | "updatedAt">,
  imageFiles?: File[]
) {
  try {
    // Upload images if provided
    const images = [];
    if (imageFiles && imageFiles.length > 0) {
      // Limit to 3 images to avoid Firestore document size limits
      const filesToProcess = imageFiles.slice(0, 3);

      for (const file of filesToProcess) {
        const uploadedImage = await uploadImage(file);
        images.push(uploadedImage);
      }

      // Check if total size is within Firestore limits
      if (!checkImagesSize(images)) {
        throw new Error(
          "Images are too large. Please use smaller or fewer images."
        );
      }
    }

    // Create the report
    const reportWithTimestamp: any = {
      ...reportData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (images.length > 0) {
      reportWithTimestamp.images = images;
    }

    const docRef = await addDoc(
      collection(db, "crimeReports"),
      reportWithTimestamp
    );

    return {
      id: docRef.id,
      ...reportWithTimestamp,
    } as CrimeReport;
  } catch (error) {
    console.error("Error creating crime report:", error);
    throw error;
  }
}

// Get a specific crime report by ID
export async function getCrimeReport(
  reportId: string
): Promise<CrimeReport | null> {
  try {
    const reportRef = doc(db, "crimeReports", reportId);
    const reportSnapshot = await getDoc(reportRef);

    if (reportSnapshot.exists()) {
      return { id: reportSnapshot.id, ...reportSnapshot.data() } as CrimeReport;
    }

    return null;
  } catch (error) {
    console.error("Error fetching crime report:", error);
    throw error;
  }
}

// Get all crime reports
export async function getAllCrimeReports(): Promise<CrimeReport[]> {
  try {
    const reportsQuery = query(
      collection(db, "crimeReports"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(reportsQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CrimeReport[];
  } catch (error) {
    console.error("Error fetching all crime reports:", error);
    throw error;
  }
}

// Utility to get all public (non-anonymous) reports
export async function getPublicCrimeReports() {
  const all = await getAllCrimeReports();
  // Show non-anonymous reports, and anonymous reports that are verified or resolved
  return all.filter(
    (r) =>
      !r.isAnonymous ||
      (r.isAnonymous && (r.status === "verified" || r.status === "resolved"))
  );
}

// Get reports by user ID
export async function getUserCrimeReports(
  userId: string
): Promise<CrimeReport[]> {
  try {
    const reportsQuery = query(
      collection(db, "crimeReports"),
      where("reporterId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(reportsQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CrimeReport[];
  } catch (error) {
    console.error("Error fetching user crime reports:", error);
    throw error;
  }
}

// Update a crime report
export async function updateCrimeReport(
  reportId: string,
  reportData: Partial<Omit<CrimeReport, "id" | "createdAt" | "updatedAt">>,
  imageFiles?: File[]
): Promise<CrimeReport> {
  try {
    const reportRef = doc(db, "crimeReports", reportId);

    // Get existing report data first
    const existingReportSnap = await getDoc(reportRef);
    if (!existingReportSnap.exists()) {
      throw new Error("Report not found");
    }

    const existingReport = existingReportSnap.data();
    let updatedImages = existingReport.images || [];

    // Upload new images if provided
    const newImages = [];
    if (imageFiles && imageFiles.length > 0) {
      // Limit total images to 3 (including existing ones)
      const maxNewImages = Math.max(0, 3 - updatedImages.length);
      const filesToProcess = imageFiles.slice(0, maxNewImages);

      if (filesToProcess.length === 0 && imageFiles.length > 0) {
        throw new Error(
          "Maximum of 3 images allowed. Remove some existing images first."
        );
      }

      for (const file of filesToProcess) {
        const uploadedImage = await uploadImage(file);
        newImages.push(uploadedImage);
      }
    }

    // Add new images to the existing ones
    if (newImages.length > 0) {
      updatedImages = [...updatedImages, ...newImages];

      // Check if total size is within Firestore limits
      if (!checkImagesSize(updatedImages)) {
        throw new Error(
          "Images are too large. Please use smaller or fewer images."
        );
      }
    }

    const updateData = {
      ...reportData,
      images: updatedImages,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(reportRef, updateData);

    // Get the updated document
    const updatedDoc = await getDoc(reportRef);

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as CrimeReport;
  } catch (error) {
    console.error("Error updating crime report:", error);
    throw error;
  }
}

// Delete a crime report
export async function deleteCrimeReport(reportId: string): Promise<void> {
  try {
    const reportRef = doc(db, "crimeReports", reportId);
    await deleteDoc(reportRef);
  } catch (error) {
    console.error("Error deleting crime report:", error);
    throw error;
  }
}

// Mark a report status
export async function updateReportStatus(
  id: string,
  status: "pending" | "reviewing" | "verified" | "resolved" | "rejected"
) {
  try {
    const reportRef = doc(db, "crimeReports", id);

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(reportRef, updateData);
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
}

// Update a crime report status (Admin only)
export async function updateCrimeReportStatus(
  id: string,
  status: CrimeReport["status"]
) {
  try {
    const reportRef = doc(db, "crimeReports", id);
    await updateDoc(reportRef, {
      status: status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
}

// Get reports by area (based on geo proximity)
export async function getReportsByArea(
  center: GeoPoint,
  radiusKm: number
): Promise<CrimeReport[]> {
  // This is a simplified approach - for a real geocoding solution, consider using Firebase GeoFireX or a dedicated geo library
  try {
    // Get all reports (in a real app with lots of data, you'd want to implement proper geofencing)
    const reports = await getAllCrimeReports();

    // Filter reports within the radius
    const reportsInArea = reports.filter((report) => {
      if (!report.location?.geoPoint) return false;

      // Calculate distance using the Haversine formula
      const distance = calculateDistance(
        center.latitude,
        center.longitude,
        report.location.geoPoint.latitude,
        report.location.geoPoint.longitude
      );

      return distance <= radiusKm;
    });

    return reportsInArea;
  } catch (error) {
    console.error("Error fetching reports by area:", error);
    throw error;
  }
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
