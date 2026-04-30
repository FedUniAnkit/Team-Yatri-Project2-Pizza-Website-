# Promotional Email System

## Overview

Admins can send professional promotional emails to customers to inform them about special offers, discounts, and promotions. The system supports multiple audience types and includes a beautiful, responsive email template.

## Features

### ✅ Already Implemented

The promotional email system was **already implemented** with newsletter functionality. This enhancement adds:

1. ✅ **Professional promotional email template** with modern design
2. ✅ **Multiple audience options**:
   - All (Customers + Subscribers)
   - Registered Customers Only
   - Newsletter Subscribers Only
3. ✅ **Promo code support** - Display promo codes prominently
4. ✅ **HTML content support** - Rich formatting for emails
5. ✅ **Duplicate prevention** - No duplicate emails to same address
6. ✅ **Success tracking** - Reports successful/failed sends

---

## Email Template Features

The professional promotional email includes:

- 🎨 **Modern gradient header** with eye-catching design
- 🏷️ **Promo code highlight box** (if provided)
- 🎯 **Clear call-to-action button** - "Order Now & Save!"
- ⭐ **Feature showcase** - 4 key benefits displayed
- 📱 **Responsive design** - Works on all devices
- 🔗 **Direct links** to menu/website
- 📧 **Unsubscribe option** (for newsletter subscribers)
- 🎨 **Professional styling** with brand colors

---

## How to Use

### For Admins

1. **Navigate to Admin Dashboard** → Newsletter Management
2. **Choose your audience**:
   - All (reaches everyone)
   - Customers (registered users only)
   - Subscribers (newsletter subscribers only)
3. **Fill in the form**:
   - Subject line (required)
   - Promo code (optional)
   - Email content (required, HTML supported)
4. **Click "Send"**
5. ✅ Emails are sent to all recipients

### Example Usage

**Scenario**: Weekend Special Offer

```
Subject: 🍕 Weekend Special: 20% Off All Pizzas!

Promo Code: WEEKEND20

Content:
<strong>This weekend only!</strong><br><br>

Get 20% off all pizzas when you order online.<br><br>

<em>Valid Saturday & Sunday only.</em><br>
Use code <strong>WEEKEND20</strong> at checkout.<br><br>

Don't miss out on this delicious deal!
```

---

## Implementation Details

### Files Created/Modified

**New Files:**
- ✅ `server/email-templates/promotional-email.ejs` - Professional email template

**Modified Files:**
- ✅ `server/utils/emailService.js` - Added `sendPromotionalEmail()`
- ✅ `server/controllers/newsletterController.js` - Added `sendPromotionalEmailToCustomers()`
- ✅ `server/routes/newsletter.js` - Added promotional email route
- ✅ `client/src/pages/admin/AdminNewsletter.js` - Enhanced UI
- ✅ `client/src/services/newsletterService.js` - Added API call
- ✅ `client/src/pages/admin/AdminNewsletter.css` - Updated styling

---

## API Endpoints

### Send Promotional Email
```
POST /api/newsletter/send-promotional-email
```

**Authentication**: Required (Admin only)

**Request Body**:
```json
{
  "subject": "Special Offer: 20% Off!",
  "content": "<strong>Limited time offer!</strong><br>Get 20% off...",
  "promoCode": "SAVE20",
  "audience": "all"
}
```

**Audience Options**:
- `"all"` - Customers + Subscribers
- `"customers"` - Registered customers only
- `"subscribers"` - Newsletter subscribers only

**Response**:
```json
{
  "success": true,
  "message": "Promotional email sent to 150 recipients.",
  "details": {
    "total": 150,
    "successful": 148,
    "failed": 2
  }
}
```

---

## Email Template Variables

The promotional email template supports:

| Variable | Type | Description |
|----------|------|-------------|
| `subject` | String | Email subject line |
| `content` | HTML | Main promotional content |
| `promoCode` | String | Optional promo code to highlight |
| `appName` | String | Application name |
| `appUrl` | String | Website URL |
| `currentYear` | Number | Current year |
| `unsubscribeUrl` | String | Unsubscribe link (for subscribers) |

---

## Audience Targeting

### All (Customers + Subscribers)
- Reaches maximum audience
- Includes registered customers AND newsletter subscribers
- Removes duplicates automatically
- Best for major announcements

### Registered Customers Only
- Targets users with accounts
- Excludes newsletter-only subscribers
- Best for loyalty rewards, account-specific offers

### Newsletter Subscribers Only
- Targets newsletter subscribers
- May include non-registered users
- Best for general promotions

---

## Email Content Tips

### Subject Lines
✅ **Good**:
- "🍕 Flash Sale: 30% Off Today Only!"
- "Your Exclusive Weekend Offer Inside"
- "Limited Time: Buy 1 Get 1 Free!"

❌ **Avoid**:
- "Sale" (too generic)
- ALL CAPS SUBJECT LINES
- Too many emojis

### Content Best Practices

1. **Keep it concise** - Get to the point quickly
2. **Use formatting** - Bold important details
3. **Clear CTA** - Tell them what to do next
4. **Create urgency** - "Limited time", "This weekend only"
5. **Include value** - What's in it for them?

### HTML Formatting

```html
<strong>Bold text</strong>
<em>Italic text</em>
<br> Line break
<p>Paragraph</p>
<ul><li>Bullet point</li></ul>
```

---

## Configuration

### Email Settings Required

Make sure your `.env` file has:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
APP_NAME=Komorebi Pizza
CLIENT_URL=http://localhost:3000
```

---

## Database Requirements

**No database changes needed!** ✅

Uses existing tables:
- `Users` - For registered customers
- `NewsletterSubscriptions` - For newsletter subscribers

---

## Error Handling

The system is designed to be **robust**:

- ✅ Individual email failures don't stop the batch
- ✅ Detailed success/failure reporting
- ✅ Errors logged to console
- ✅ Admin receives feedback on send status

### Monitoring

Check server logs for:
```
✅ Promotional email sent to: customer@example.com
❌ Failed to send promotional email to customer@example.com: [error]
```

---

## Testing

### How to Test

1. **Create test accounts**:
   - At least one customer account
   - At least one newsletter subscriber

2. **Send a test promotional email**:
   - Subject: "Test Promotion"
   - Content: "This is a test"
   - Audience: "All"

3. **Check email inboxes**

4. **Verify**:
   - Email received
   - Formatting looks good
   - Links work
   - Promo code displayed (if provided)

### Test Scenarios

- ✅ Send to all audiences
- ✅ Send to customers only
- ✅ Send to subscribers only
- ✅ Include promo code
- ✅ HTML formatting works
- ✅ No duplicates sent
- ✅ Unsubscribe link works (for subscribers)

---

## Use Cases

### 1. Flash Sales
**When**: Limited time offers
**Audience**: All
**Example**: "⚡ 2-Hour Flash Sale: 40% Off!"

### 2. New Menu Items
**When**: Launching new products
**Audience**: All
**Example**: "🆕 Try Our New Gourmet Pizza Line!"

### 3. Loyalty Rewards
**When**: Rewarding regular customers
**Audience**: Customers
**Example**: "🎁 Thank You! Here's 15% Off Your Next Order"

### 4. Holiday Specials
**When**: Seasonal promotions
**Audience**: All
**Example**: "🎄 Holiday Special: Family Feast Deal!"

### 5. Re-engagement
**When**: Inactive customers
**Audience**: Customers
**Example**: "We Miss You! Come Back for 25% Off"

---

## Best Practices

### Frequency
- ⚠️ Don't spam - Max 2-3 promotional emails per week
- ✅ Space out major promotions
- ✅ Test different send times

### Timing
- ✅ **Best times**: Tuesday-Thursday, 10 AM - 2 PM
- ✅ **Weekends**: Good for flash sales
- ❌ **Avoid**: Late nights, very early mornings

### Content
- ✅ Mobile-friendly (template is responsive)
- ✅ Clear value proposition
- ✅ Single, clear call-to-action
- ✅ Sense of urgency
- ✅ Professional tone

### Legal Compliance
- ✅ Include unsubscribe link (automatic for subscribers)
- ✅ Honor unsubscribe requests
- ✅ Don't buy email lists
- ✅ Only email people who opted in

---

## Metrics & Analytics

Track email performance:
- **Open rates** - How many opened the email
- **Click-through rates** - How many clicked links
- **Conversion rates** - How many made purchases
- **Unsubscribe rates** - How many opted out

*(Note: Implement email tracking pixels for detailed analytics)*

---

## Troubleshooting

### Emails Not Sending

1. **Check email configuration** in `.env`
2. **Verify SMTP credentials**
3. **Check server logs** for errors
4. **Test with password reset email**

### Low Open Rates

1. **Improve subject lines** - Make them compelling
2. **Test send times** - Try different times
3. **Segment audience** - Target specific groups
4. **Check spam folders** - Emails might be filtered

### High Unsubscribe Rates

1. **Reduce frequency** - Don't send too often
2. **Improve content** - Provide real value
3. **Better targeting** - Send relevant offers
4. **Check spam score** - Avoid spam triggers

---

## Future Enhancements

Potential improvements:
- 📊 Email analytics dashboard
- 📅 Schedule emails for future sending
- 🎨 Visual email builder
- 📧 Email templates library
- 🧪 A/B testing for subject lines
- 📱 SMS notifications
- 🎯 Advanced segmentation
- 📈 Conversion tracking

---

## Summary

✅ **Feature**: Admin promotional email system  
✅ **Status**: Fully implemented and enhanced  
✅ **Database**: No changes needed  
✅ **UI**: Professional admin interface  
✅ **Template**: Beautiful, responsive design  
✅ **Audiences**: Customers, Subscribers, or All  
✅ **Features**: Promo codes, HTML support, tracking  

**Ready to use!** 🎉

---

## Quick Start

1. Log in as admin
2. Go to Newsletter Management
3. Fill in the promotional email form
4. Choose your audience
5. Click "Send to X Recipients"
6. ✅ Done!

Your customers will receive a professional, eye-catching promotional email that drives engagement and sales!
