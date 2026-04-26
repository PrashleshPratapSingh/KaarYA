/**
 * Firebase Storage Helpers — KaarYa
 * Upload and manage files in Firebase Cloud Storage.
 */
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// ─── Upload Avatar ──────────────────────────────────────────────────────────

/**
 * Upload a user's profile photo to Firebase Storage.
 * Returns the public download URL.
 *
 * @param userId - Firebase Auth UID
 * @param localUri - Local file:// URI from ImagePicker
 */
export async function uploadAvatar(
    userId: string,
    localUri: string
): Promise<string> {
    const blob = await uriToBlob(localUri);
    const extension = localUri.split('.').pop() || 'jpg';
    const storageRef = ref(storage, `avatars/${userId}/profile.${extension}`);

    const snapshot = await uploadBytesResumable(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
}

// ─── Upload Gig Attachment ──────────────────────────────────────────────────

/**
 * Upload a file attachment for a gig.
 * Returns the public download URL.
 *
 * @param gigId - Firestore gig document ID
 * @param fileName - Original file name
 * @param localUri - Local file:// URI
 */
export async function uploadGigAttachment(
    gigId: string,
    fileName: string,
    localUri: string
): Promise<string> {
    const blob = await uriToBlob(localUri);
    const storageRef = ref(storage, `gig-attachments/${gigId}/${fileName}`);

    const snapshot = await uploadBytesResumable(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
}

// ─── Upload Deliverable ─────────────────────────────────────────────────────

/**
 * Upload a deliverable file for a completed gig.
 *
 * @param orderId - Firestore order document ID
 * @param fileName - Original file name
 * @param localUri - Local file:// URI
 */
export async function uploadDeliverable(
    orderId: string,
    fileName: string,
    localUri: string
): Promise<string> {
    const blob = await uriToBlob(localUri);
    const storageRef = ref(storage, `deliverables/${orderId}/${fileName}`);

    const snapshot = await uploadBytesResumable(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
}

// ─── Utility ────────────────────────────────────────────────────────────────

/**
 * Convert a local file URI to a Blob for upload.
 * Works in React Native by fetching the local file URI.
 */
async function uriToBlob(uri: string): Promise<Blob> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
}

// ─── Upload Chat Media ──────────────────────────────────────────────────────

/**
 * Upload a media file (image, document, audio) for a chat message.
 * Returns the public download URL.
 *
 * @param chatId - The ID of the chat thread
 * @param userId - Firebase Auth UID of the sender
 * @param localUri - Local file:// URI
 * @param type - Type of media (audio, image, document)
 */
export async function uploadChatMedia(
    chatId: string,
    userId: string,
    localUri: string,
    type: 'audio' | 'image' | 'document'
): Promise<string> {
    const blob = await uriToBlob(localUri);
    let extension = localUri.split('.').pop() || 'tmp';
    
    // Normalize extension for audio
    if (type === 'audio' && !localUri.includes('.')) {
        extension = 'm4a'; // default expo-av extension
    }
    
    const timestamp = Date.now();
    const fileName = `${timestamp}_${userId}.${extension}`;
    const storageRef = ref(storage, `chats/${chatId}/${type}/${fileName}`);

    const snapshot = await uploadBytesResumable(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
}
