const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLATFORM_FEE = Number(process.env.PLATFORM_FEE_PERCENT || 10) / 100;

/**
 * Create an order for client checkout
 * @param {Object} params
 * @param {number} params.amount - Amount in major currency unit (e.g., 10.5)
 * @param {string} params.currency - ISO currency code, default USD
 * @param {string} params.receipt - Unique id for internal tracking
 */
async function createOrder({ amount, currency = 'USD', receipt }) {
  const options = {
    amount: Math.round(amount * 100), // sub-units
    currency,
    receipt,
    payment_capture: 1,
  };
  return razorpay.orders.create(options);
}

/**
 * Transfer captured funds to freelancer minus platform fee
 */
async function transferToFreelancer({ paymentId, amount, accountId }) {
  const platformFee = amount * PLATFORM_FEE;
  const transferAmount = Math.round((amount - platformFee) * 100);
  return razorpay.payments.transfer(paymentId, [
    {
      account: accountId,
      amount: transferAmount,
      currency: 'USD',
      notes: { type: 'escrow_release' },
      on_hold: 0,
    },
  ]);
}

async function refund(paymentId, amount) {
  const payload = { payment_id: paymentId };
  if (amount) payload.amount = Math.round(amount * 100);
  return razorpay.refunds.create(payload);
}

function verifyWebhook(bodyBuffer, signature) {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(bodyBuffer)
    .digest('hex');
  if (expected !== signature) {
    const err = new Error('Invalid Razorpay webhook signature');
    err.statusCode = 400;
    throw err;
  }
}

module.exports = {
  createOrder,
  transferToFreelancer,
  refund,
  verifyWebhook,
};
