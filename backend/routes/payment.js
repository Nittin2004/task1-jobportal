const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Initialize Razorpay instance
// NOTE: These should be in .env in production
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_123',
});

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const amount = 299; // Amount in INR
    const options = {
      amount: amount * 100, // Razorpay takes amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_order_${req.user.id}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    // Create initial transaction record
    const transaction = new Transaction({
      userId: req.user.id,
      razorpay_order_id: order.id,
      amount: amount,
      status: 'created'
    });
    await transaction.save();

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_123';
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment successful
      // 1. Update Transaction status
      await Transaction.findOneAndUpdate(
        { razorpay_order_id },
        { 
          razorpay_payment_id, 
          razorpay_signature, 
          status: 'paid' 
        }
      );

      // 2. Upgrade User to Premium
      await User.findByIdAndUpdate(req.user.id, {
        isPremium: true,
        premiumActivatedAt: new Date()
      });

      res.json({ message: 'Payment verified successfully. You are now a Premium member!' });
    } else {
      // Payment failed/tampered
      await Transaction.findOneAndUpdate(
        { razorpay_order_id },
        { status: 'failed' }
      );
      res.status(400).json({ message: 'Payment verification failed!' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

