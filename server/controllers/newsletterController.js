const { NewsletterSubscription, User } = require('../models');
const emailService = require('../utils/emailService');

// @desc    Subscribe to the newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    const [subscription, created] = await NewsletterSubscription.findOrCreate({
      where: { email },
      defaults: { isActive: true },
    });

    if (!created && !subscription.isActive) {
      // Resubscribe if they were previously inactive
      subscription.isActive = true;
      await subscription.save();
    }

    res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'This email is already subscribed.' });
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    res.status(500).json({ success: false, message: 'Subscription failed. Please try again later.', error: error.message });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscription.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers.', error: error.message });
  }
};

// @desc    Send a marketing email to all subscribers
// @route   POST /api/newsletter/send-marketing-email
// @access  Private/Admin
const sendMarketingEmail = async (req, res) => {
  const { subject, content } = req.body;
  if (!subject || !content) {
    return res.status(400).json({ success: false, message: 'Email subject and content are required.' });
  }

  try {
    const subscribers = await NewsletterSubscription.findAll({ where: { isActive: true } });
    if (subscribers.length === 0) {
      return res.status(404).json({ success: false, message: 'No active subscribers found.' });
    }

    const recipientEmails = subscribers.map(s => s.email);
    
    // Respond immediately
    res.status(200).json({ success: true, message: `Sending marketing email to ${recipientEmails.length} subscribers in the background.` });

    // Send in background
    setImmediate(async () => {
      try {
        await emailService.sendBulkMarketingEmail(recipientEmails, subject, content);
        console.log(`Marketing email sent to ${recipientEmails.length} subscribers`);
      } catch (emailError) {
        console.error('Background marketing email failed:', emailError);
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send marketing email.', error: error.message });
  }
};

// @desc    Send promotional email to all registered customers
// @route   POST /api/newsletter/send-promotional-email
// @access  Private/Admin
const sendPromotionalEmailToCustomers = async (req, res) => {
  const { subject, content, promoCode, audience } = req.body;
  
  if (!subject || !content) {
    return res.status(400).json({ success: false, message: 'Email subject and content are required.' });
  }

  try {
    let recipients = [];

    if (audience === 'customers' || audience === 'all') {
      // Get all active customers
      const customers = await User.findAll({
        where: { 
          role: 'customer',
          isActive: true
        },
        attributes: ['email', 'name']
      });
      recipients = [...recipients, ...customers.map(c => ({ email: c.email, name: c.name }))];
    }

    if (audience === 'subscribers' || audience === 'all') {
      // Get all newsletter subscribers
      const subscribers = await NewsletterSubscription.findAll({
        where: { isActive: true },
        attributes: ['email']
      });
      
      // Avoid duplicates
      const existingEmails = new Set(recipients.map(r => r.email));
      const uniqueSubscribers = subscribers.filter(s => !existingEmails.has(s.email));
      recipients = [...recipients, ...uniqueSubscribers.map(s => ({ email: s.email }))];
    }

    if (recipients.length === 0) {
      return res.status(404).json({ success: false, message: 'No recipients found for the selected audience.' });
    }

    // Respond immediately - don't wait for emails to send
    res.status(200).json({ 
      success: true, 
      message: `Sending promotional email to ${recipients.length} recipients in the background.`,
      details: {
        total: recipients.length,
        successful: recipients.length,
        failed: 0
      }
    });

    // Send emails in the background (non-blocking)
    setImmediate(async () => {
      try {
        const results = await emailService.sendPromotionalEmail(recipients, subject, content, promoCode);
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        console.log(`Promotional email results: ${successCount} sent, ${failureCount} failed out of ${recipients.length}`);
      } catch (emailError) {
        console.error('Background promotional email sending failed:', emailError);
      }
    });
  } catch (error) {
    console.error('Error sending promotional email:', error);
    res.status(500).json({ success: false, message: 'Failed to send promotional email.', error: error.message });
  }
};

// @desc    Get recipient counts for promotional emails
// @route   GET /api/newsletter/recipient-counts
// @access  Private/Admin
const getRecipientCounts = async (req, res) => {
  try {
    const customerCount = await User.count({
      where: { role: 'customer', isActive: true }
    });
    const subscriberCount = await NewsletterSubscription.count({
      where: { isActive: true }
    });

    // Count unique recipients for "all" option
    const subscribers = await NewsletterSubscription.findAll({
      where: { isActive: true },
      attributes: ['email']
    });
    const customers = await User.findAll({
      where: { role: 'customer', isActive: true },
      attributes: ['email']
    });
    const allEmails = new Set([
      ...customers.map(c => c.email),
      ...subscribers.map(s => s.email)
    ]);

    res.status(200).json({
      success: true,
      data: {
        customers: customerCount,
        subscribers: subscriberCount,
        all: allEmails.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get counts.', error: error.message });
  }
};

module.exports = {
  subscribe,
  getAllSubscribers,
  sendMarketingEmail,
  sendPromotionalEmailToCustomers,
  getRecipientCounts,
};
