/**
 * Cloudinary Direct Upload Utility
 * 
 * This module handles direct browser-to-Cloudinary uploads using signed URLs.
 * It bypasses the backend for file transfers to avoid Heroku's 30-second timeout.
 * 
 * Flow:
 * 1. Get upload signature from backend
 * 2. Upload directly to Cloudinary
 * 3. Return the secure URL
 */

import { BASE_URL, storage } from './api';

// Cloudinary upload endpoint format
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/{cloud_name}/image/upload';

export interface UploadSignature {
    signature: string;
    timestamp: number;
    cloud_name: string;
    api_key: string;
    folder: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export type ProgressCallback = (progress: UploadProgress) => void;

/**
 * Get upload signature from the backend
 */
async function getUploadSignature(folder: string): Promise<UploadSignature> {
    const token = storage.getToken();

    const response = await fetch(`${BASE_URL}/admin/upload/signature?folder=${encodeURIComponent(folder)}`, {
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get upload signature');
    }

    return response.json();
}

/**
 * Upload a single file directly to Cloudinary
 * 
 * @param file - The file to upload
 * @param folder - Cloudinary folder path (e.g., 'daffa/boats')
 * @param onProgress - Optional callback for upload progress
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(
    file: File,
    folder: string = 'daffa',
    onProgress?: ProgressCallback
): Promise<string> {
    // 1. Get signed upload parameters from backend
    const signatureData = await getUploadSignature(folder);

    // 2. Build the upload URL
    const uploadUrl = CLOUDINARY_UPLOAD_URL.replace('{cloud_name}', signatureData.cloud_name);

    // 3. Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.api_key);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);

    // 4. Upload to Cloudinary with progress tracking
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', uploadUrl);

        // Track upload progress
        if (onProgress) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    onProgress({
                        loaded: event.loaded,
                        total: event.total,
                        percentage: Math.round((event.loaded / event.total) * 100)
                    });
                }
            };
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.secure_url);
                } catch {
                    reject(new Error('Failed to parse Cloudinary response'));
                }
            } else {
                try {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.error?.message || 'Upload failed'));
                } catch {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            reject(new Error('Network error during upload'));
        };

        xhr.send(formData);
    });
}

/**
 * Upload multiple files to Cloudinary
 * 
 * @param files - Array of files to upload
 * @param folder - Cloudinary folder path
 * @param onProgress - Optional callback for overall progress
 * @returns Array of secure URLs
 */
export async function uploadMultipleToCloudinary(
    files: File[],
    folder: string = 'daffa',
    onProgress?: (current: number, total: number) => void
): Promise<string[]> {
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i], folder);
        urls.push(url);

        if (onProgress) {
            onProgress(i + 1, files.length);
        }
    }

    return urls;
}

/**
 * Validate that a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
    return url.startsWith('https://res.cloudinary.com/');
}
