

# Promo Code / Discount Code System

## Overview

Admins can create and manage promotional discount codes to attract more sales. Customers can apply these codes at checkout to receive discounts on their orders.

## Features

### ✅ Fully Implemented

1. ✅ **Create & Manage Promo Codes** (Admin)
2. ✅ **Multiple Discount Types**:
   - Percentage discounts (e.g., 20% off)
   - Fixed amount discounts (e.g., $10 off)
3. ✅ **Advanced Features**:
   - Usage limits (max number of uses)
   - Usage tracking (how many times used)
   - Date range validity (start/end dates)
   - Minimum order amount requirements
   - Maximum discount caps (for percentage discounts)
4. ✅ **Automatic Validation**:
   - Code expiration checking
   - Usage limit enforcement
   - Minimum order validation
   - Active status verification
5. ✅ **Apply at Checkout** (Customer)
6. ✅ **Real-time Discount Calculation**

---

## Database Migration

### Migration Completed ✅

The database has been updated with enhanced promo code features:

```
🔄 Starting database migration for promo code enhancements...
✅ Added usageLimit column
✅ Added usageCount column
✅ Added minimumOrderAmount column
✅ Added maxDiscountAmount column

🎉 Database migration completed successfully!
```

**New Fields Added:**
- `usageLimit` - Maximum number of times code can be used
- `usageCount` - Current usage count
- `minimumOrderAmount` - Minimum order total required
- `maxDiscountAmount` - Cap for percentage discounts

---

## How It Works

### For Admins

#### Creating a Promo Code

1. **Navigate to Admin Dashboard** → Promo Code Management
2. **Click "Create New Promo Code"**
3. **Fill in the details**:
   - **Code**: Unique identifier (e.g., SAVE20)
   - **Discount Type**: Percentage or Fixed Amount
   - **Amount**: Discount value
   - **Description**: Optional description
   - **Start/End Dates**: Optional validity period
   - **Usage Limit**: Optional max uses
   - **Minimum Order**: Optional minimum order amount
   - **Max Discount**: Optional cap for percentage discounts
4. **Click "Create Promo Code"**
5. ✅ Code is now active and ready to use!

#### Managing Promo Codes

- **Edit**: Click "Edit" to modify code details
- **Activate/Deactivate**: Toggle status with one click
- **Delete**: Remove codes permanently
- **View Usage**: See how many times each code has been used

---

### For Customers

1. **Add items to cart**
2. **Go to checkout**
3. **Enter promo code** in the promo code field
4. **Submit order**
5. ✅ Discount is automatically applied!

---

## Promo Code Examples

### Example 1: Percentage Discount
```
Code: SAVE20
Type: Percentage
Amount: 20
Description: 20% off all orders
Start Date: (empty - starts immediately)
End Date: (empty - never expires)
Usage Limit: (empty - unlimited)
Min Order: $0
Max Discount: $50

Result: 20% off, up to $50 maximum discount
```

### Example 2: Fixed Amount Discount
```
Code: WELCOME10
Type: Fixed
Amount: 10.00
Description: $10 off for new customers
Start Date: (empty)
End Date: (empty)
Usage Limit: 100
Min Order: $25.00
Max Discount: (not applicable for fixed)

Result: $10 off orders over $25, limited to 100 uses
```

### Example 3: Limited Time Offer
```
Code: WEEKEND25
Type: Percentage
Amount: 25
Description: Weekend special - 25% off
Start Date: 2026-05-01
End Date: 2026-05-03
Usage Limit: 500
Min Order: $15.00
Max Discount: $30

Result: 25% off (max $30) on orders over $15, 
        valid May 1-3, limited to 500 uses
```

---

## Implementation Details

### Files Created/Modified

**New Files:**
- ✅ `server/controllers/promoCodeController.js` - Promo code CRUD operations
- ✅ `server/routes/promoCodeRoutes.js` - API routes
- ✅ `server/migrations/add-promo-code-features.sql` - Database migration
- ✅ `server/scripts/migrate-promo-codes.js` - Migration script
- ✅ `client/src/services/promoCodeService.js` - API service
- ✅ `client/src/pages/admin/AdminPromoCodes.js` - Admin UI
- ✅ `client/src/pages/admin/AdminPromoCodes.css` - Styling

**Modified Files:**
- ✅ `server/models/Promotion.js` - Added new fields
- ✅ `server/controllers/orderController.js` - Enhanced validation
- ✅ `server/package.json` - Added migration script
- ✅ `server/server.js` - Added routes
- ✅ `schema.sql` - Updated table definition

---

## API Endpoints

### 1. Get All Promo Codes (Admin)
```
GET /api/promo-codes
Authorization: Required (Admin)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "SAVE20",
      "description": "20% off all orders",
      "discountType": "percentage",
      "amount": "20.00",
      "startDate": null,
      "endDate": null,
      "isActive": true,
      "usageLimit": null,
      "usageCount": 45,
      "minimumOrderAmount": "0.00",
      "maxDiscountAmount": "50.00"
    }
  ]
}
```

### 2. Create Promo Code (Admin)
```
POST /api/promo-codes
Authorization: Required (Admin)
```

**Request:**
```json
{
  "code": "SAVE20",
  "description": "20% off all orders",
  "discountType": "percentage",
  "amount": 20,
  "startDate": null,
  "endDate": null,
  "usageLimit": null,
  "minimumOrderAmount": 0,
  "maxDiscountAmount": 50
}
```

### 3. Validate Promo Code (Public)
```
POST /api/promo-codes/validate
```

**Request:**
```json
{
  "code": "SAVE20",
  "orderAmount": 100.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "SAVE20",
    "discountType": "percentage",
    "amount": "20.00",
    "discountAmount": "20.00",
    "description": "20% off all orders"
  },
  "message": "Promo code is valid!"
}
```

### 4. Update Promo Code (Admin)
```
PUT /api/promo-codes/:id
Authorization: Required (Admin)
```

### 5. Delete Promo Code (Admin)
```
DELETE /api/promo-codes/:id
Authorization: Required (Admin)
```

---

## Validation Rules

When a customer applies a promo code, the system validates:

1. ✅ **Code exists** - Code must be in database
2. ✅ **Code is active** - `isActive` must be true
3. ✅ **Not expired** - Current date must be before `endDate`
4. ✅ **Already started** - Current date must be after `startDate`
5. ✅ **Usage limit not reached** - `usageCount` < `usageLimit`
6. ✅ **Minimum order met** - Order total ≥ `minimumOrderAmount`
7. ✅ **Discount calculated correctly**:
   - Percentage: `orderTotal * (amount / 100)`
   - Fixed: `amount`
8. ✅ **Max discount cap applied** (for percentage)
9. ✅ **Discount doesn't exceed order total**

---

## Discount Calculation

### Percentage Discount
```javascript
let discount = orderTotal * (percentage / 100);

// Apply max discount cap if set
if (maxDiscountAmount && discount > maxDiscountAmount) {
  discount = maxDiscountAmount;
}

// Ensure discount doesn't exceed order total
if (discount > orderTotal) {
  discount = orderTotal;
}

finalTotal = orderTotal - discount;
```

### Fixed Amount Discount
```javascript
let discount = fixedAmount;

// Ensure discount doesn't exceed order total
if (discount > orderTotal) {
  discount = orderTotal;
}

finalTotal = orderTotal - discount;
```

---

## Usage Tracking

Every time a promo code is successfully used:

1. ✅ `usageCount` is incremented
2. ✅ Order is linked to the promotion via `promotionId`
3. ✅ Discount amount is recorded in the order

This allows admins to:
- Track promo code performance
- See which codes are most popular
- Enforce usage limits
- Analyze ROI of promotions

---

## Admin UI Features

### Promo Code List View

Displays all promo codes with:
- **Code** and description
- **Discount type** and amount
- **Usage statistics** (X / Y uses)
- **Validity period** (start → end dates)
- **Minimum order** requirement
- **Status** (Active/Inactive toggle)
- **Actions** (Edit/Delete buttons)

### Visual Indicators

- 🟢 **Active** - Green status badge
- 🔴 **Inactive** - Red status badge
- ⚠️ **Expired** - Warning for past end date
- ⚠️ **Limit Reached** - Warning when usage limit hit
- ℹ️ **Not Yet Valid** - Info for future start date

### Form Features

- **Smart field visibility** - Max discount only shows for percentage
- **Input validation** - Required fields, number formats
- **Date pickers** - Easy date selection
- **Real-time feedback** - Success/error messages
- **Edit mode** - Pre-fill form with existing data

---

## Use Cases

### 1. First-Time Customer Discount
```
Code: WELCOME10
Type: Fixed
Amount: $10
Min Order: $20
Usage Limit: Unlimited
```
**Goal**: Attract new customers

### 2. Flash Sale
```
Code: FLASH50
Type: Percentage
Amount: 50%
Max Discount: $25
Start: Today 6 PM
End: Today 9 PM
Usage Limit: 100
```
**Goal**: Drive urgency and quick sales

### 3. Loyalty Reward
```
Code: VIP20
Type: Percentage
Amount: 20%
Min Order: $30
Usage Limit: 1000
```
**Goal**: Reward regular customers

### 4. Seasonal Promotion
```
Code: SUMMER25
Type: Percentage
Amount: 25%
Max Discount: $40
Start: June 1
End: August 31
Min Order: $25
```
**Goal**: Boost summer sales

### 5. Minimum Order Incentive
```
Code: BIGORDER
Type: Fixed
Amount: $15
Min Order: $50
```
**Goal**: Increase average order value

---

## Best Practices

### Code Naming
- ✅ **Use uppercase** - Easier to read and type
- ✅ **Make it memorable** - SAVE20, WELCOME10
- ✅ **Include value** - Let customers know the benefit
- ✅ **Keep it short** - 6-10 characters ideal
- ❌ **Avoid confusion** - No similar codes (SAVE20 vs SAVE2O)

### Discount Strategy
- ✅ **Set minimum orders** - Protect profit margins
- ✅ **Cap percentage discounts** - Prevent excessive discounts
- ✅ **Use usage limits** - Control total cost
- ✅ **Time-bound offers** - Create urgency
- ✅ **Track performance** - Monitor usage and ROI

### Communication
- ✅ **Email campaigns** - Send codes to customers
- ✅ **Social media** - Share limited-time codes
- ✅ **Website banners** - Display active promotions
- ✅ **Order confirmations** - Include future codes

---

## Error Messages

The system provides clear error messages:

| Error | Message |
|-------|---------|
| Invalid code | "Invalid promo code." |
| Expired | "This promo code has expired." |
| Not yet valid | "This promo code is not yet valid." |
| Inactive | "This promo code is no longer active." |
| Usage limit | "This promo code has reached its usage limit." |
| Min order | "Minimum order amount of $X required to use this promo code." |

---

## Testing

### How to Test

1. **Create a test promo code**:
   ```
   Code: TEST20
   Type: Percentage
   Amount: 20
   Min Order: $10
   ```

2. **Place a test order**:
   - Add items totaling $50
   - Enter code "TEST20" at checkout
   - Verify discount: $50 × 20% = $10
   - Final total: $40

3. **Test validation**:
   - Try expired code → Error
   - Try with order < $10 → Error
   - Try after usage limit → Error

### Test Scenarios

- ✅ Valid percentage discount
- ✅ Valid fixed discount
- ✅ Expired code rejection
- ✅ Inactive code rejection
- ✅ Usage limit enforcement
- ✅ Minimum order validation
- ✅ Max discount cap (percentage)
- ✅ Usage count increment
- ✅ Case-insensitive code matching

---

## Analytics & Reporting

Track promo code performance:

1. **Usage Count** - How many times used
2. **Total Discount Given** - Sum of all discounts
3. **Revenue Generated** - Orders using the code
4. **Conversion Rate** - % of orders with code
5. **Average Order Value** - With vs without code

*(Note: Implement analytics dashboard for detailed reporting)*

---

## Future Enhancements

Potential improvements:
- 📊 Analytics dashboard for promo codes
- 👥 Customer-specific codes (one per customer)
- 🎯 Product-specific discounts
- 📧 Auto-generate codes for campaigns
- 🔄 Recurring discounts (e.g., every Monday)
- 📱 QR code generation
- 🎁 Bundle discounts
- 💳 First-order-only codes

---

## Troubleshooting

### Code Not Working

1. **Check if code is active**
   - Admin → Promo Codes → Verify status

2. **Check expiration dates**
   - Verify current date is within range

3. **Check usage limit**
   - See if limit has been reached

4. **Check minimum order**
   - Ensure order total meets requirement

### Discount Not Applied

1. **Check order total calculation**
   - Verify subtotal before discount

2. **Check max discount cap**
   - For percentage discounts

3. **Check server logs**
   - Look for validation errors

---

## Security Considerations

- ✅ **Admin-only creation** - Only admins can create codes
- ✅ **Server-side validation** - All checks on backend
- ✅ **Usage tracking** - Prevent abuse
- ✅ **Case-insensitive** - Prevent duplicate codes
- ✅ **Transaction safety** - Atomic operations
- ✅ **Input sanitization** - Prevent injection attacks

---

## Summary

✅ **Feature**: Promo code / discount code system  
✅ **Status**: Fully implemented and working  
✅ **Database**: Migrated successfully  
✅ **Admin UI**: Complete management interface  
✅ **Customer UI**: Checkout integration ready  
✅ **Validation**: Comprehensive rule enforcement  
✅ **Tracking**: Usage monitoring enabled  

**Ready to use!** 🎉

---

## Quick Start

### Create Your First Promo Code

1. Log in as admin
2. Navigate to Promo Code Management
3. Click "Create New Promo Code"
4. Fill in:
   ```
   Code: LAUNCH20
   Type: Percentage
   Amount: 20
   Description: Launch special - 20% off!
   ```
5. Click "Create"
6. ✅ Share code with customers!

### Apply a Promo Code

1. Add items to cart
2. Go to checkout
3. Enter "LAUNCH20" in promo code field
4. Complete order
5. ✅ Discount applied automatically!

---

**Attract more sales with strategic discount codes!** 💰🎯
