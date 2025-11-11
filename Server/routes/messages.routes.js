const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/messages.controller');

router.post('/', auth, ctrl.sendMessage);
router.get('/thread/:userId', auth, ctrl.getThread);
router.get('/unread-count', auth, ctrl.getUnreadCount);
router.patch('/:id/read', auth, ctrl.markRead);

module.exports = router;
