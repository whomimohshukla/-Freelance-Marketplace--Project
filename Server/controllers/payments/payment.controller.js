const Payment = require('../../models/payment.model');
const Project = require('../../models/project.model');
const razorpaySvc = require('../../services/razorpayService');
const crypto = require('crypto');

// Create Razorpay order for funding a project/milestone
exports.createOrder = async (req, res, next) => {
  try {
    // console.log('BODY:', req.body);
    const { projectId, milestoneId, amount } = req.body;
    if (!projectId || !amount) {
      return res.status(400).json({ error: 'projectId & amount are required' });
    }

    const project = await Project.findById(projectId).populate('selectedFreelancer');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (!project.selectedFreelancer) return res.status(400).json({ error: 'No freelancer assigned' });

    // Milestone amount check
    if (milestoneId) {
      const milestone = project.milestones.id(milestoneId);
      if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
      if (amount > milestone.amount) return res.status(400).json({ error: 'Amount exceeds milestone budget' });
    }

    const receipt = `${projectId}-${Date.now()}`;
    const order = await razorpaySvc.createOrder({ amount, currency: 'USD', receipt });

    const payment = await Payment.create({
      project: projectId,
      milestone: milestoneId,
      payer: req.user._id,
      payee: project.selectedFreelancer._id,
      amount,
      currency: 'USD',
      status: 'Pending',
      paymentMethod: 'Razorpay',
      transactionId: order.id,
      platformFee: amount * Number(process.env.PLATFORM_FEE_PERCENT || 10) / 100,
    });

    res.json({ success: true, data: { order, paymentId: payment._id, keyId: process.env.RAZORPAY_KEY_ID } });
  } catch (err) {
    next(err);
  }
};

// Verify Razorpay payment signature from client and mark as pending confirmation
exports.capturePayment = async (req, res, next) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentId } = req.body;
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !paymentId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: 'PendingConfirmation' },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: 'Payment record not found' });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Razorpay webhook handler
exports.webhook = async (req, res, next) => {
  try {
    razorpaySvc.verifyWebhook(req.rawBody, req.headers['x-razorpay-signature']);
    const event = JSON.parse(req.rawBody.toString());

    if (event.event === 'payment.captured') {
      const paymentId = event.payload.payment.entity.id;
      const payment = await Payment.findOneAndUpdate(
        { transactionId: paymentId },
        { status: 'Completed' },
        { new: true }
      );
      if (payment) {
        await Project.findByIdAndUpdate(payment.project, { $inc: { 'budget.pending': payment.amount } });
      }
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

// Release escrow funds to freelancer
exports.releaseEscrow = async (req, res, next) => {
  try {
    const { pid, mid } = req.params;
    const project = await Project.findById(pid).populate('selectedFreelancer');
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const milestone = project.milestones.id(mid);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    const payment = await Payment.findById(milestone.payment);
    if (!payment || payment.status !== 'Completed') {
      return res.status(400).json({ error: 'Funds not captured or already released' });
    }

    await razorpaySvc.transferToFreelancer({
      paymentId: payment.transactionId,
      amount: payment.amount,
      accountId: project.selectedFreelancer.razorpayAccountId,
    });

    payment.status = 'Released';
    await payment.save();

    milestone.status = 'Approved';
    await project.save();

    await Project.findByIdAndUpdate(pid, {
      $inc: { 'budget.paid': payment.amount, 'budget.pending': -payment.amount },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Admin refund endpoint
exports.refund = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await razorpaySvc.refund(payment.transactionId);
    payment.status = 'Refunded';
    await payment.save();

    await Project.findByIdAndUpdate(payment.project, {
      $inc: { 'budget.pending': -payment.amount },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
