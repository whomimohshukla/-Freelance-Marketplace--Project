const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/uploads.controller');

// Accepts JSON body with { file: base64DataUri | remoteUrl, folder?, resource_type? }
router.post('/', auth, ctrl.upload);

module.exports = router;
