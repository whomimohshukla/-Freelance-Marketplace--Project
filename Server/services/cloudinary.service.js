const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary.
 * Accepts base64 data URI or remote URL.
 * @param {string} file - base64 data URI (preferred) or remote URL
 * @param {object} options - Cloudinary upload options
 * @returns {Promise<import('cloudinary').UploadApiResponse>}
 */
async function uploadFile(file, options = {}) {
  const folder = options.folder || 'freelancer-app';
  const resource_type = options.resource_type || 'auto';
  return cloudinary.uploader.upload(file, { folder, resource_type, ...options });
}

module.exports = { cloudinary, uploadFile };
