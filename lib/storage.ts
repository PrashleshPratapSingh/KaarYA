/**
 * Firebase Storage Helpers — KaarYa
 * Upload and manage files in Firebase Cloud Storage.
 * 
 * NOTE: Firebase Storage requires a Blaze plan. If Storage is not enabled,
 * all upload functions return the local URI as a fallback so the app
 * doesn't crash.
 */
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { Alert } from 'react-native';

// ─── Storage availability check ─────────────────────────────────────────────
let storageWarningShown = false;

function showStorageWarning() {
    if (!storageWarningShown) {
        storageWarningShown = true;
        console.warn('⚠️ Firebase Storage upload failed — using local URI as fallback.');
    }
}

// ─── Upload Avatar ──────────────────────────────────────────────────────────

/**
 * Upload a user's profile photo to Firebase Storage.
 * Returns the public download URL, or the local URI if Storage is unavailable.
 */
export async function uploadAvatar(
    userId: string,
    localUri: string
): Promise<string> {
    try {
        const blob = await uriToBlob(localUri);
        const extension = localUri.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `avatars/${userId}/profile.${extension}`);

        const snapshot = await uploadBytesResumable(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return downloadUrl;
    } catch (error) {
        showStorageWarning();
        console.log('Avatar upload failed, using local URI:', error);
        return localUri; // Fallback: use the local image
    }
}

// ─── Upload Gig Attachment ──────────────────────────────────────────────────

/**
 * Upload a file attachment for a gig.
 * Returns the public download URL, or the local URI if Storage is unavailable.
 */
export async function uploadGigAttachment(
    gigId: string,
    fileName: string,
    localUri: string
): Promise<string> {
    try {
        const blob = await uriToBlob(localUri);
        const storageRef = ref(storage, `gig-attachments/${gigId}/${fileName}`);

        const snapshot = await uploadBytesResumable(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return downloadUrl;
    } catch (error) {
        showStorageWarning();
        console.log('Gig attachment upload failed, using local URI:', error);
        return localUri;
    }
}

// ─── Upload Deliverable ─────────────────────────────────────────────────────

/**
 * Upload a deliverable file for a completed gig.
 */
export async function uploadDeliverable(
    orderId: string,
    fileName: string,
    localUri: string
): Promise<string> {
    try {
        const blob = await uriToBlob(localUri);
        const storageRef = ref(storage, `deliverables/${orderId}/${fileName}`);

        const snapshot = await uploadBytesResumable(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return downloadUrl;
    } catch (error) {
        showStorageWarning();
        console.log('Deliverable upload failed, using local URI:', error);
        return localUri;
    }
}

// ─── Utility ────────────────────────────────────────────────────────────────

/**
 * Convert a local file URI to a Blob for upload.
 * Uses XMLHttpRequest as fetch(file://) often fails in React Native.
 */
function uriToBlob(uri: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.error('uriToBlob failed', e);
            reject(new Error('uriToBlob failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}

// ─── Upload Chat Media ──────────────────────────────────────────────────────

/**
 * Upload a media file (image, document, audio) for a chat message.
 * Returns the public download URL, or the local URI if Storage is unavailable.
 */
export async function uploadChatMedia(
    chatId: string,
    userId: string,
    localUri: string,
    type: 'audio' | 'image' | 'document'
): Promise<string> {
    try {
        const blob = await uriToBlob(localUri);
        let extension = localUri.split('.').pop() || 'tmp';
        
        if (type === 'audio' && !localUri.includes('.')) {
            extension = 'm4a';
        }
        
        const timestamp = Date.now();
        const fileName = `${timestamp}_${userId}.${extension}`;
        const storageRef = ref(storage, `chats/${chatId}/${type}/${fileName}`);

        const snapshot = await uploadBytesResumable(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return downloadUrl;
    } catch (error) {
        showStorageWarning();
        console.log('Chat media upload failed, using local URI:', error);
        return localUri;
    }
}
