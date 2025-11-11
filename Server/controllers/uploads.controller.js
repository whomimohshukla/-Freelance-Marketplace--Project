const { uploadFile } = require('../services/cloudinary.service');

/**
 * POST /api/v1/uploads
 * body: { file: base64DataUri | remoteUrl, folder?, resource_type? }
 */
exports.upload = async (req, res) => {
  try {
    const { file, folder, resource_type } = req.body || {};
    if (!file) {
      return res.status(400).json({ success: false, message: 'file is required (base64 data URI or URL)' });
    }
    const result = await uploadFile(file, { folder, resource_type });
    return res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
};
