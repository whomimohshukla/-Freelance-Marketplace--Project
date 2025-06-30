const cron = require('node-cron');
const Payment = require('../models/payment.model');
const Project = require('../models/project.model');
const razorpaySvc = require('../services/razorpayService');

// Runs every day at midnight server time
cron.schedule('0 0 * * *', async () => {
  const duePayments = await Payment.find({
    status: 'Completed',
    escrowReleaseDate: { $lte: new Date() },
  }).populate({ path: 'project', populate: { path: 'selectedFreelancer', select: 'razorpayAccountId' } });

  for (const pay of duePayments) {
    try {
      const freelancerAccount = pay.project.selectedFreelancer.razorpayAccountId;
      await razorpaySvc.transferToFreelancer({
        paymentId: pay.transactionId,
        amount: pay.amount,
        accountId: freelancerAccount,
      });

      // update statuses and budgets
      pay.status = 'Released';
      await pay.save();
      await Project.findByIdAndUpdate(pay.project._id, {
        $inc: { 'budget.paid': pay.amount, 'budget.pending': -pay.amount },
      });
    } catch (err) {
      console.error('Escrow auto-release failed', err.message);
    }
  }
});
