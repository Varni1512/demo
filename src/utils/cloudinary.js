/**
 * Cloudinary Image Storage Utility for Swadesh Vaani
 * Enables direct client-side unsigned image upload to Cloudinary CDN.
 */

export const isCloudinaryConfigured = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  return Boolean(
    cloudName &&
    uploadPreset &&
    !cloudName.includes("your_") &&
    !uploadPreset.includes("your_")
  );
};

/**
 * Upload an image (File object, Blob, or base64 data URI) directly to Cloudinary.
 * @param {File|Blob|string} imageFileOrDataUrl
 * @param {object} options
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string, fallback?: boolean}>}
 */
export const uploadToCloudinary = async (
  imageFileOrDataUrl,
  options = { folder: "swadeshvaani/articles" }
) => {
  if (!imageFileOrDataUrl) {
    return { success: false, error: "No image provided" };
  }

  const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "").trim();
  const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "").trim();

  if (!cloudName || !uploadPreset || cloudName.includes("your_") || uploadPreset.includes("your_")) {
    console.warn("[Cloudinary] Cloudinary keys not configured in .env. Using fallback image storage.");
    return {
      success: false,
      fallback: true,
      error: "Cloudinary credentials missing in .env (VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET)",
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", imageFileOrDataUrl);
    formData.append("upload_preset", uploadPreset);
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error("[Cloudinary Upload Error]:", error);
    return {
      success: false,
      fallback: true,
      error: error.message || "Failed to upload to Cloudinary",
    };
  }
};
