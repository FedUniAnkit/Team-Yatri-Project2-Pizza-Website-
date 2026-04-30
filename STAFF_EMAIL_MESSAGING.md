# Staff Email Messaging to Customers

## Overview

Staff members can now send email messages to customers to clarify orders. When a staff member sends a message through the chat interface, the customer automatically receives an email notification with the message content.

## Features

### Automatic Email Notifications

When a staff member (or admin) sends a message to a customer:
1. ✅ Message is saved in the database
2. ✅ **Customer receives an email notification**
3. ✅ Message appears in the chat interface (real-time via WebSocket)
4. ✅ Email sent status is tracked in the database

### Email Content

Customer email notifications include:

- **Order Reference**
  - Order number
  - Order date
  - Current order status

- **Message Details**
  - Staff member's name
  - Staff role (Staff Member or Administrator)
  - Full message content

- **Quick Actions**
  - Direct link to view order details
  - Instructions on how to reply

---

## Implementation Details

### Files Created/Modified

1. **`server/email-templates/staff-message.ejs`** (NEW)
   - Professional email template for staff messages
   - Includes order context and message content
   - Provides link to order details

2. **`server/utils/emailService.js`** (UPDATED)
   - Added `sendStaffMessageToCustomer()` function
   - Sends formatted email to customer

3. **`server/controllers/messageController.js`** (UPDATED)
   - Automatically sends email when staff messages customer
   - Non-blocking: email failures don't affect message delivery
   - Only sends email for staff→customer messages (not customer→staff)

4. **`server/models/Message.js`** (UPDATED)
   - Added `emailSent` field to track email delivery
   - Default: `false`

5. **`schema.sql`** (UPDATED)
   - Added `emailSent` column to Messages table

---

## How It Works

### Message Flow

```
Staff sends message via ChatBox
        ↓
Message saved to database
        ↓
Check: Is sender staff/admin AND receiver customer?
        ↓ YES
Send email to customer
        ↓
Update message.emailSent = true
        ↓
Broadcast via WebSocket
        ↓
Customer sees message in chat AND receives email
```

### Email Service Function

```javascript
sendStaffMessageToCustomer(customer, staff, order, messageContent)
```

**Parameters:**
- `customer`: Customer User object
- `staff`: Staff/Admin User object who sent the message
- `order`: Order object for context
- `messageContent`: The message text

**Returns:**
- Success object or throws error

---

## Database Migration

### Migration Required: YES

A new column was added to the Messages table:

**Column**: `emailSent`
- **Type**: BOOLEAN
- **Default**: false
- **Purpose**: Track if email notification was sent

### Run Migration

```bash
cd server
npm run migrate:messages
```

**Migration completed automatically!** ✅

---

## Using the Feature

### For Staff Members

1. **Navigate to an order** in the staff dashboard
2. **Open the chat/messaging interface** for that order
3. **Type your message** to the customer
4. **Click Send**
5. ✅ Customer receives the message in-app AND via email

### For Customers

When a staff member sends a message:
1. ✅ Email notification arrives in inbox
2. ✅ Email includes full message and order details
3. ✅ Customer can click link to view order
4. ✅ Customer can reply through the order page

---

## Email Template Customization

The email template is located at:
```
server/email-templates/staff-message.ejs
```

You can customize:
- Colors and styling
- Layout and sections
- Content and messaging
- Action buttons

---

## Configuration

### Email Settings Required

Make sure your `.env` file has email configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
APP_NAME=Komorebi Pizza
CLIENT_URL=http://localhost:3000
```

---

## Error Handling

The email notification system is **non-blocking**:

- ✅ If email sending fails, the message is still saved
- ✅ Customer can still see message in the chat interface
- ✅ Errors are logged to the console for debugging
- ✅ `emailSent` flag remains `false` if email fails

### Monitoring

Check server logs for:
```
✅ Email notification sent to customer customer@example.com for order ORD-123
❌ Failed to send email notification: [error]
```

---

## Use Cases

### 1. Order Clarification
**Scenario**: Customer ordered "extra cheese" but didn't specify quantity

**Staff Action**:
```
"Hi! Just wanted to clarify - how much extra cheese would you like? 
We can add light, regular, or heavy extra cheese. Let me know!"
```

**Result**: Customer receives email and can respond

### 2. Ingredient Substitution
**Scenario**: Item is out of stock

**Staff Action**:
```
"We're currently out of pepperoni. Would you like to substitute with 
Italian sausage or remove it from your order? Your call!"
```

**Result**: Customer gets immediate notification

### 3. Delivery Update
**Scenario**: Delay in delivery

**Staff Action**:
```
"Your order is ready but our driver is running 15 minutes late due to 
traffic. We've added a free drink to your order. Thanks for your patience!"
```

**Result**: Customer is informed proactively

---

## Benefits

1. **Better Communication**: Customers get notified immediately
2. **Email Record**: All communications are documented
3. **Convenience**: Customers don't need to be logged in
4. **Professional**: Branded email template
5. **Trackable**: `emailSent` flag for auditing

---

## Testing

### How to Test

1. **Create a staff account** (role: 'staff' or 'admin')
2. **Create a customer account** with valid email
3. **Place an order** as the customer
4. **Log in as staff** and navigate to the order
5. **Send a message** to the customer
6. **Check customer's email** for notification

### Test Scenarios

- ✅ Staff sends message to customer (email sent)
- ✅ Customer sends message to staff (no email sent)
- ✅ Admin sends message to customer (email sent)
- ✅ Email failure doesn't break message delivery
- ✅ `emailSent` flag is set correctly

---

## Existing UI

The messaging feature uses the existing **ChatBox** component:

**Location**: `client/src/components/chat/ChatBox.js`

**Features**:
- Real-time messaging via WebSocket
- Message history
- Auto-scroll to latest message
- Works for both staff and customers

**No UI changes needed** - email functionality works automatically! ✅

---

## Future Enhancements

Potential improvements:
- Email templates for different message types
- Customer email preferences (opt-in/opt-out)
- SMS notifications
- Message read receipts
- Canned responses for common questions
- Message templates for staff

---

## Troubleshooting

### Emails Not Being Sent

1. **Check email configuration** in `.env`
2. **Verify SMTP credentials** are correct
3. **Check server logs** for errors
4. **Test email service** with password reset email
5. **Check spam folder** in customer's email

### `emailSent` Always False

1. **Check if sender is staff/admin**
2. **Check if receiver is customer**
3. **Review server logs** for email errors
4. **Verify email service is configured**

### Customer Not Receiving Emails

1. **Check customer email address** is valid
2. **Check spam/junk folders**
3. **Verify email service is working**
4. **Check firewall/security settings**

---

## Support

For issues or questions:
1. Check server logs for error messages
2. Verify email configuration
3. Test with a simple message
4. Review the email template for errors

---

## Summary

✅ **Feature**: Staff can message customers by email  
✅ **Status**: Fully implemented and working  
✅ **Database**: Migrated successfully  
✅ **UI**: Uses existing ChatBox component  
✅ **Email**: Professional template with order context  
✅ **Tracking**: `emailSent` flag for auditing  

**Ready to use!** 🎉
