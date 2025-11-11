const Message = require('../models/message.model');
const { getIO } = require('../socket/index');

// POST /api/v1/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, project, attachments, messageType } = req.body || {};
    if (!receiver || !content) {
      return res.status(400).json({ success: false, message: 'receiver and content are required' });
    }
    const doc = await Message.create({
      sender: req.user._id,
      receiver,
      project: project || undefined,
      content,
      attachments: attachments || [],
      messageType: messageType || 'text',
    });
    // emit to receiver room
    try {
      const io = getIO();
      io.to(String(receiver)).emit('message:new', {
        _id: doc._id,
        sender: String(req.user._id),
        receiver: String(receiver),
        project: doc.project ? String(doc.project) : undefined,
        content: doc.content,
        attachments: doc.attachments,
        messageType: doc.messageType,
        createdAt: doc.createdAt,
      });
    } catch (_) {}
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error('sendMessage error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// GET /api/v1/messages/thread/:userId?project=...
exports.getThread = async (req, res) => {
  try {
    const { userId } = req.params;
    const { project } = req.query;
    const me = req.user._id;

    const filter = {
      $or: [
        { sender: me, receiver: userId },
        { sender: userId, receiver: me },
      ],
    };
    if (project) filter.project = project;

    const items = await Message.find(filter)
      .sort({ createdAt: 1 })
      .populate('sender', '_id firstName lastName avatar role')
      .populate('receiver', '_id firstName lastName avatar role')
      .lean();
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error('getThread error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch thread' });
  }
};

// GET /api/v1/messages/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const me = req.user._id;
    const count = await Message.countDocuments({ receiver: me, 'readStatus.isRead': false });
    return res.json({ success: true, data: { count } });
  } catch (err) {
    console.error('getUnreadCount error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
};

// PATCH /api/v1/messages/:id/read
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const me = req.user._id;
    const msg = await Message.findOne({ _id: id, receiver: me });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    if (!msg.readStatus.isRead) {
      msg.readStatus.isRead = true;
      msg.readStatus.readAt = new Date();
      await msg.save();
    }
    // notify sender that message has been read
    try {
      const io = getIO();
      io.to(String(msg.sender)).emit('message:read', { messageId: String(msg._id) });
    } catch (_) {}
    return res.json({ success: true });
  } catch (err) {
    console.error('markRead error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
};
