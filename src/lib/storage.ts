import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";

// Initialize Firebase Storage
const storage = getStorage(app);

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param folder - Optional folder name to organize uploads (defaults to 'images')
 * @returns An object with the download URL and storage reference path
 */
export async function uploadImage(file: File, folder: string = "images") {
  try {
    // Create a unique filename with timestamp and original name
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload the file
    const uploadResult = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);

    return {
      url: downloadURL,
      path: uploadResult.ref.fullPath,
    };
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    throw error;
  }
}

/**
 * Convert a File to a data URL for preview purposes
 * This is a client-side utility function that doesn't require server interaction
 * @param file - The file to convert to a data URL
 * @returns A Promise that resolves with the data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
