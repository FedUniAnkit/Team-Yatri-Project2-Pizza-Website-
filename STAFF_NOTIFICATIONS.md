# Staff Email Notifications for New Orders

## Overview

Staff members (users with `staff` or `admin` roles) now receive email notifications whenever a new order is placed. This allows staff to quickly respond to orders and begin preparation.

## Features

### Automatic Email Notifications

When a customer places an order, the system automatically:
1. Sends an order confirmation email to the customer
2. **Sends a detailed notification email to all active staff members**
3. Broadcasts a WebSocket notification to the staff room

### Email Content

Staff notification emails include:

- **Order Information**
  - Order number
  - Order date and time
  - Order total
  - Order status

- **Customer Information**
  - Customer name
  - Customer email
  - Customer phone (if available)

- **Delivery Details**
  - Full delivery address
  - Customer notes/special instructions

- **Payment Information**
  - Payment method (Cash on Delivery, Card at Door, or Online Payment)
  - Payment status (Paid/Pending)

- **Order Items**
  - Complete list of items ordered
  - Quantities
  - Prices
  - Customizations (if any)
  - Order total

- **Quick Actions**
  - Direct link to view order details in the staff dashboard
  - Suggestions for next steps

## Implementation Details

### Files Modified

1. **`server/email-templates/staff-new-order.ejs`** (NEW)
   - Beautiful, professional email template for staff notifications
   - Color-coded sections for easy scanning
   - Responsive design

2. **`server/utils/emailService.js`**
   - Added `sendNewOrderNotificationToStaff()` function
   - Sends emails to all active staff members
   - Handles errors gracefully without failing the order creation

3. **`server/controllers/orderController.js`**
   - Updated `createOrder()` function
   - Fetches all active staff/admin users
   - Sends notifications after order is successfully created
   - Non-blocking: email failures don't affect order creation

### Email Service Function

```javascript
sendNewOrderNotificationToStaff(staffMembers, order, customer)
```

**Parameters:**
- `staffMembers`: Array of User objects with staff/admin role
- `order`: Order object with all order details
- `customer`: Customer User object who placed the order

**Returns:**
- Array of results indicating success/failure for each staff member

## Configuration

### Email Settings

Make sure your `.env` file has the email configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=Komorebi Pizza
```

### Staff User Requirements

For a user to receive new order notifications, they must:
1. Have role set to `'staff'` or `'admin'`
2. Have `isActive` set to `true`
3. Have a valid email address

## Testing

### How to Test

1. **Set up a staff account:**
   ```sql
   -- Make sure you have at least one staff user
   UPDATE "Users" 
   SET role = 'staff', "isActive" = true 
   WHERE email = 'staff@example.com';
   ```

2. **Configure email settings** in your `.env` file

3. **Place a test order** as a customer

4. **Check staff email inbox** for the notification

### Test Scenarios

- ✅ Order with cash on delivery
- ✅ Order with online payment
- ✅ Order with customer notes
- ✅ Order with customized items
- ✅ Multiple staff members receive notifications
- ✅ Inactive staff members don't receive notifications

## Email Template Customization

The email template is located at:
```
server/email-templates/staff-new-order.ejs
```

You can customize:
- Colors and styling
- Layout and sections
- Content and messaging
- Action buttons and links

## Error Handling

The notification system is designed to be **non-blocking**:

- If email sending fails, the order is still created successfully
- Errors are logged to the console for debugging
- Individual email failures don't affect other staff notifications
- The customer always receives their confirmation email

## Monitoring

Check server logs for:
```
✅ New order notification sent to staff: staff@example.com
❌ Failed to send new order notification to staff@example.com: [error]
```

## Benefits

1. **Faster Response Time**: Staff are immediately notified of new orders
2. **Better Organization**: All order details in one email
3. **Mobile Friendly**: Staff can check emails on their phones
4. **Audit Trail**: Email records of all order notifications
5. **Reduced Errors**: Staff have all information needed to prepare orders

## Future Enhancements

Potential improvements:
- SMS notifications for urgent orders
- Configurable notification preferences per staff member
- Digest emails for multiple orders
- Push notifications via mobile app
- Notification scheduling (e.g., only during business hours)

## Troubleshooting

### Staff Not Receiving Emails

1. **Check staff user status:**
   ```sql
   SELECT id, name, email, role, "isActive" 
   FROM "Users" 
   WHERE role IN ('staff', 'admin');
   ```

2. **Verify email configuration** in `.env`

3. **Check spam/junk folders**

4. **Review server logs** for error messages

5. **Test email service:**
   - Try sending a password reset email
   - Verify SMTP credentials are correct

### Email Formatting Issues

- Ensure the EJS template is properly formatted
- Check that all variables are being passed correctly
- Test with different email clients (Gmail, Outlook, etc.)

## Support

For issues or questions:
1. Check server logs for error messages
2. Verify email configuration
3. Test with a simple order
4. Review the email template for syntax errors
