const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

// Create a transporter using SMTP or other transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Template directory
const templateDir = path.join(__dirname, '../email-templates');

// Load email template
const loadTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(templateDir, `${templateName}.ejs`);
    const template = await fs.promises.readFile(templatePath, 'utf-8');
    return ejs.render(template, data);
  } catch (error) {
    console.error('Error loading email template:', error);
    throw new Error('Failed to load email template');
  }
};

// Send email function
const sendEmail = async (to, subject, templateName, data = {}) => {
  try {
    // Add common data to all emails
    const emailData = {
      ...data,
      appName: process.env.APP_NAME || 'Komorebi Pizza',
      appUrl: process.env.CLIENT_URL || 'http://localhost:3000',
      currentYear: new Date().getFullYear(),
    };

    // Load and render the email template
    const html = await loadTemplate(templateName, emailData);

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Komorebi Pizza'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Specific email functions
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  await sendEmail(
    user.email,
    'Password Reset Request',
    'password-reset',
    {
      name: user.name,
      resetUrl,
      expiresIn: '1 hour', // Should match token expiration
    }
  );
};

const sendPasswordResetByAdminEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  await sendEmail(
    user.email,
    'Your Password Has Been Reset by an Administrator',
    'password-reset-by-admin',
    {
      name: user.name,
      resetUrl,
      expiresIn: '10 minutes',
    }
  );
};

const sendOrderConfirmationEmail = async (user, order) => {
  await sendEmail(
    user.email,
    `Order Confirmation - #${order.orderNumber}`,
    'order-confirmation',
    {
      name: user.name,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-AU'),
      orderTotal: parseFloat(order.totalAmount).toFixed(2),
      items: (order.items || []).map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * parseFloat(item.price),
      })),
    }
  );
};

const sendBulkMarketingEmail = async (recipientEmails, subject, content) => {
  if (!recipientEmails || recipientEmails.length === 0) {
    throw new Error('No recipients provided for bulk email.');
  }

  try {
    // Send one email to yourself (or a dedicated address) and BCC all recipients
    // This is more efficient and private than sending individual emails.
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Komorebi Pizza'}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // The 'to' field is required, send to self
      bcc: recipientEmails,
      subject,
      html: content, // Assuming content is HTML
    });

    console.log('Bulk marketing email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending bulk marketing email:', error);
    throw new Error('Failed to send bulk marketing email');
  }
};

const sendNewsletter = async (subscribers, subject, content) => {
  const results = [];
  
  for (const subscriber of subscribers) {
    try {
      const result = await sendEmail(
        subscriber.email,
        subject,
        'newsletter',
        {
          name: subscriber.name || 'Valued Customer',
          content,
          unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`,
        }
      );
      results.push({ email: subscriber.email, success: true, messageId: result.messageId });
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error);
      results.push({ email: subscriber.email, success: false, error: error.message });
    }
  }
  
  return results;
};

const sendStaffInvitationEmail = async (user, temporaryPassword) => {
  await sendEmail(
    user.email,
    'Welcome to Komorebi Pizza - Staff Account Created',
    'staff-invitation',
    {
      name: user.name,
      email: user.email,
      temporaryPassword,
      loginUrl: `${process.env.CLIENT_URL}/login`,
    }
  );
};

const sendOTPEmail = async (user, otp) => {
  await sendEmail(
    user.email,
    'Password Reset OTP - Komorebi Pizza',
    'otp-email',
    {
      name: user.name,
      otp,
      expiresIn: '10 minutes',
    }
  );
};

const sendNewOrderNotificationToStaff = async (staffMembers, order, customer) => {
  if (!staffMembers || staffMembers.length === 0) {
    console.log('No staff members to notify');
    return;
  }

  const results = [];
  
  for (const staff of staffMembers) {
    try {
      await sendEmail(
        staff.email,
        `🍕 New Order Alert - #${order.orderNumber}`,
        'staff-new-order',
        {
          staffName: staff.name,
          orderId: order.id,
          orderNumber: order.orderNumber,
          orderDate: new Date(order.createdAt).toLocaleString('en-AU', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
          orderTotal: parseFloat(order.totalAmount).toFixed(2),
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone || null,
          deliveryAddress: order.deliveryAddress || null,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          customerNotes: order.customerNotes || null,
          items: (order.items || []).map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization || null,
          })),
        }
      );
      results.push({ email: staff.email, success: true });
      console.log(`New order notification sent to staff: ${staff.email}`);
    } catch (error) {
      console.error(`Failed to send new order notification to ${staff.email}:`, error);
      results.push({ email: staff.email, success: false, error: error.message });
    }
  }
  
  return results;
};

const sendStaffMessageToCustomer = async (customer, staff, order, messageContent) => {
  try {
    const staffRoleDisplay = staff.role === 'admin' ? 'Administrator' : 'Staff Member';
    
    await sendEmail(
      customer.email,
      `Message from ${process.env.APP_NAME || 'Komorebi Pizza'} - Order #${order.orderNumber}`,
      'staff-message',
      {
        customerName: customer.name,
        staffName: staff.name,
        staffRole: staffRoleDisplay,
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-AU', {
          dateStyle: 'medium',
        }),
        orderStatus: order.status,
        messageContent: messageContent,
      }
    );
    
    console.log(`Staff message sent to customer: ${customer.email} for order ${order.orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send staff message to customer ${customer.email}:`, error);
    throw new Error('Failed to send email to customer');
  }
};

const sendPromotionalEmail = async (recipients, subject, content, promoCode = null) => {
  if (!recipients || recipients.length === 0) {
    throw new Error('No recipients provided for promotional email.');
  }

  const results = [];
  
  for (const recipient of recipients) {
    try {
      await sendEmail(
        recipient.email,
        subject,
        'promotional-email',
        {
          subject: subject,
          content: content,
          promoCode: promoCode,
          unsubscribeUrl: recipient.unsubscribeToken 
            ? `${process.env.CLIENT_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}&token=${recipient.unsubscribeToken}`
            : null,
        }
      );
      results.push({ email: recipient.email, success: true });
      console.log(`Promotional email sent to: ${recipient.email}`);
    } catch (error) {
      console.error(`Failed to send promotional email to ${recipient.email}:`, error);
      results.push({ email: recipient.email, success: false, error: error.message });
    }
  }
  
  return results;
};

const sendCustomerReplyToStaff = async (staffMember, customer, order, messageContent) => {
  try {
    await sendEmail(
      staffMember.email,
      `Customer Reply - Order #${order.orderNumber}`,
      'staff-message',
      {
        customerName: staffMember.name,
        staffName: customer.name,
        staffRole: 'Customer',
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-AU', {
          dateStyle: 'medium',
        }),
        orderStatus: order.status,
        messageContent: messageContent,
      }
    );
    
    console.log(`Customer reply email sent to staff: ${staffMember.email} for order ${order.orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send customer reply to staff ${staffMember.email}:`, error);
    throw new Error('Failed to send email to staff');
  }
};

const sendNewsletterWelcome = async (email, unsubscribeToken) => {
  try {
    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    const unsubscribeUrl = `${serverUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken}`;
    
    await sendEmail(
      email,
      `Welcome to ${process.env.APP_NAME || 'Komorebi Pizza'} Newsletter!`,
      'newsletter-welcome',
      {
        email,
        unsubscribeUrl,
      }
    );
    
    console.log(`Newsletter welcome email sent to: ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send newsletter welcome to ${email}:`, error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordResetByAdminEmail,
  sendOrderConfirmationEmail,
  sendNewsletter,
  sendBulkMarketingEmail,
  sendStaffInvitationEmail,
  sendOTPEmail,
  sendNewOrderNotificationToStaff,
  sendStaffMessageToCustomer,
  sendCustomerReplyToStaff,
  sendPromotionalEmail,
  sendNewsletterWelcome,
};
