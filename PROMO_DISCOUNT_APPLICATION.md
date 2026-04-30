# Promo Code Discount Application - Complete Flow

## Overview

✅ **FULLY IMPLEMENTED**: Promo code discounts are automatically applied to customer orders, reducing the total price accordingly.

---

## How It Works

### Complete Customer Journey

#### 1. **Customer Adds Items to Cart**
```
Cart:
- Margherita Pizza x2 = $30.00
- Pepperoni Pizza x1 = $15.00
- Garlic Bread x1 = $5.00
─────────────────────────────
Subtotal: $50.00
```

#### 2. **Customer Goes to Checkout**
- Enters delivery details
- Selects payment method
- **Enters promo code: "SAVE20"**

#### 3. **Frontend Validates Code (Optional Preview)**
```javascript
// Real-time validation shows:
✅ Promo code is valid! You save $10.00!

Preview:
Subtotal:        $50.00
Discount (SAVE20): -$10.00
─────────────────────────────
Total:           $40.00
```

#### 4. **Customer Submits Order**
Order data sent to backend:
```javascript
{
  items: [...],
  deliveryAddress: {...},
  paymentMethod: "cash",
  promotionCode: "SAVE20"  // ← Promo code included
}
```

#### 5. **Backend Processes Discount**

**Step 5a: Validate Promo Code**
```javascript
// Find promo code in database
const promotion = await Promotion.findOne({ 
  where: { code: "SAVE20", isActive: true } 
});

// Validate:
✅ Code exists
✅ Code is active
✅ Not expired (within date range)
✅ Usage limit not reached
✅ Minimum order met ($50 ≥ $0)
```

**Step 5b: Calculate Discount**
```javascript
// For "SAVE20" (20% percentage discount):
let discountAmount = subtotal * (20 / 100);
// discountAmount = $50 * 0.20 = $10.00

// Apply max discount cap if set
if (maxDiscountAmount && discountAmount > maxDiscountAmount) {
  discountAmount = maxDiscountAmount;
}

// Ensure discount doesn't exceed order total
if (discountAmount > subtotal) {
  discountAmount = subtotal;
}

// Result: discountAmount = $10.00
```

**Step 5c: Calculate Final Total**
```javascript
const totalAmount = subtotal - discountAmount;
// totalAmount = $50.00 - $10.00 = $40.00
```

**Step 5d: Increment Usage Count**
```javascript
await promotion.increment('usageCount');
// Tracks how many times code has been used
```

#### 6. **Order Created with Discount**
```javascript
const newOrder = await Order.create({
  customerId: user.id,
  orderNumber: "ORD-1234567890-123",
  items: [...],
  totalAmount: 40.00,  // ← Discounted total
  deliveryAddress: {...},
  paymentMethod: "cash",
  promotionId: promotion.id,  // ← Linked to promo
  // ... other fields
});
```

#### 7. **Customer Sees Confirmation**
```
Order Confirmed! 🎉

Order #ORD-1234567890-123
Total Paid: $40.00

You saved $10.00 with code SAVE20!
```

---

## Discount Calculation Logic

### Percentage Discount

**Example: 20% off**
```javascript
Code: SAVE20
Type: percentage
Amount: 20
Max Discount: $50

Order: $100
Discount: $100 × 20% = $20
Final: $100 - $20 = $80
```

**With Max Cap:**
```javascript
Code: SAVE20
Type: percentage
Amount: 20
Max Discount: $15  // ← Cap applied

Order: $100
Discount: $100 × 20% = $20 → Capped to $15
Final: $100 - $15 = $85
```

### Fixed Amount Discount

**Example: $10 off**
```javascript
Code: WELCOME10
Type: fixed
Amount: 10

Order: $50
Discount: $10
Final: $50 - $10 = $40
```

**Discount Can't Exceed Order:**
```javascript
Code: WELCOME10
Type: fixed
Amount: 10

Order: $8
Discount: $10 → Reduced to $8
Final: $8 - $8 = $0 (Free!)
```

---

## Validation Rules Applied

Before applying discount, the system validates:

| Rule | Check | Example |
|------|-------|---------|
| **Code Exists** | Must be in database | "SAVE20" exists ✅ |
| **Active Status** | `isActive = true` | Active ✅ |
| **Start Date** | Current date ≥ start date | Started ✅ |
| **End Date** | Current date ≤ end date | Not expired ✅ |
| **Usage Limit** | `usageCount < usageLimit` | 45/100 uses ✅ |
| **Min Order** | `orderTotal ≥ minimumOrderAmount` | $50 ≥ $25 ✅ |

**If any validation fails:**
- ❌ Order is rejected
- ❌ Error message returned
- ❌ No discount applied

---

## Database Storage

### Orders Table
```sql
CREATE TABLE "Orders" (
  id UUID PRIMARY KEY,
  orderNumber VARCHAR(255),
  customerId UUID,
  totalAmount DECIMAL(10,2),  -- ← Final amount after discount
  promotionId UUID,            -- ← Link to promo code used
  -- ... other fields
);
```

### Promotions Table
```sql
CREATE TABLE "Promotions" (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE,
  discountType VARCHAR(50),    -- 'percentage' or 'fixed'
  amount DECIMAL(10,2),
  usageCount INTEGER,          -- ← Incremented on each use
  usageLimit INTEGER,
  minimumOrderAmount DECIMAL(10,2),
  maxDiscountAmount DECIMAL(10,2),
  -- ... other fields
);
```

---

## Example Scenarios

### Scenario 1: Successful Application

**Setup:**
```
Code: WEEKEND25
Type: Percentage
Amount: 25%
Min Order: $20
Max Discount: $30
Usage: 10/100
```

**Order:**
```
Cart Total: $80
Customer enters: "WEEKEND25"
```

**Process:**
```
✅ Code exists and active
✅ Not expired
✅ Usage limit OK (10/100)
✅ Min order met ($80 ≥ $20)

Discount: $80 × 25% = $20
Max cap: $30 (not reached)
Final: $80 - $20 = $60

✅ Order created with $60 total
✅ Usage count: 11/100
```

### Scenario 2: Minimum Order Not Met

**Setup:**
```
Code: BIGORDER
Type: Fixed
Amount: $15
Min Order: $50
```

**Order:**
```
Cart Total: $35
Customer enters: "BIGORDER"
```

**Process:**
```
✅ Code exists and active
✅ Not expired
❌ Min order NOT met ($35 < $50)

Error: "Minimum order amount of $50 required to use this promo code."
Order rejected
```

### Scenario 3: Expired Code

**Setup:**
```
Code: FLASH50
Type: Percentage
Amount: 50%
End Date: 2026-04-27 (yesterday)
```

**Order:**
```
Cart Total: $60
Customer enters: "FLASH50"
```

**Process:**
```
✅ Code exists
❌ Expired (end date passed)

Error: "This promo code has expired."
Order rejected
```

### Scenario 4: Usage Limit Reached

**Setup:**
```
Code: LIMITED
Type: Fixed
Amount: $10
Usage Limit: 100
Current Usage: 100
```

**Order:**
```
Cart Total: $40
Customer enters: "LIMITED"
```

**Process:**
```
✅ Code exists and active
❌ Usage limit reached (100/100)

Error: "This promo code has reached its usage limit."
Order rejected
```

---

## Order Confirmation Email

Customers receive confirmation showing discount:

```
Order Confirmation - #ORD-1234567890-123

Items:
- Margherita Pizza x2    $30.00
- Pepperoni Pizza x1     $15.00
- Garlic Bread x1        $5.00
                         ───────
Subtotal:                $50.00
Discount (SAVE20):       -$10.00
                         ───────
Total:                   $40.00

You saved $10.00!

Payment Method: Cash on Delivery
```

---

## Admin Tracking

Admins can track promo code performance:

**Promo Code Dashboard:**
```
Code: SAVE20
Type: Percentage (20%)
Status: Active ✅

Usage: 45 / 100
Total Discount Given: $450.00
Average Order Value: $50.00
Conversion Rate: 15%

Recent Orders:
- #ORD-123 - $10 discount
- #ORD-124 - $8 discount
- #ORD-125 - $12 discount
```

---

## Error Handling

### Transaction Safety

All discount operations are wrapped in database transactions:

```javascript
const transaction = await sequelize.transaction();

try {
  // Validate promo code
  // Calculate discount
  // Create order
  // Increment usage count
  
  await transaction.commit();
  ✅ Success
} catch (error) {
  await transaction.rollback();
  ❌ All changes reverted
}
```

**Benefits:**
- ✅ Atomic operations
- ✅ No partial updates
- ✅ Data consistency
- ✅ Usage count accuracy

---

## API Response Examples

### Successful Order with Discount

**Request:**
```json
POST /api/orders
{
  "items": [...],
  "promotionCode": "SAVE20",
  "deliveryAddress": {...},
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-1234567890-123",
    "totalAmount": "40.00",
    "promotionId": "promo-uuid",
    "items": [...],
    "status": "pending"
  }
}
```

### Failed - Invalid Code

**Request:**
```json
POST /api/orders
{
  "items": [...],
  "promotionCode": "INVALID",
  ...
}
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid promo code."
}
```

### Failed - Minimum Order

**Request:**
```json
POST /api/orders
{
  "items": [...],  // Total: $20
  "promotionCode": "BIGORDER",  // Requires $50
  ...
}
```

**Response:**
```json
{
  "success": false,
  "message": "Minimum order amount of $50 required to use this promo code."
}
```

---

## Testing the Flow

### Test Case 1: Valid Discount

1. **Create promo code** (Admin):
   ```
   Code: TEST20
   Type: Percentage
   Amount: 20
   Min Order: $10
   ```

2. **Place order** (Customer):
   ```
   Cart: $50
   Promo: TEST20
   ```

3. **Verify**:
   ```
   ✅ Discount: $10
   ✅ Total: $40
   ✅ Order created
   ✅ Usage count: 1
   ```

### Test Case 2: Invalid Code

1. **Place order** with "INVALID123"
2. **Verify**:
   ```
   ❌ Error: "Invalid promo code."
   ❌ Order not created
   ```

### Test Case 3: Expired Code

1. **Create expired code**:
   ```
   Code: EXPIRED
   End Date: Yesterday
   ```

2. **Place order** with "EXPIRED"
3. **Verify**:
   ```
   ❌ Error: "This promo code has expired."
   ❌ Order not created
   ```

---

## Code Implementation

### Backend (Order Controller)

```javascript
// Extract from orderController.js

// 1. Validate promo code
if (promotionCode) {
  const promotion = await Promotion.findOne({ 
    where: { code: promotionCode.toUpperCase(), isActive: true } 
  });

  if (promotion) {
    // 2. Validate rules
    validateDates(promotion);
    validateUsageLimit(promotion);
    validateMinimumOrder(promotion, subtotal);
    
    // 3. Calculate discount
    discountAmount = calculateDiscount(promotion, subtotal);
    
    // 4. Increment usage
    await promotion.increment('usageCount');
    
    promotionId = promotion.id;
  } else {
    throw new Error('Invalid promo code');
  }
}

// 5. Apply discount to total
const totalAmount = subtotal - discountAmount;

// 6. Create order with discounted total
const order = await Order.create({
  totalAmount,
  promotionId,
  // ... other fields
});
```

### Frontend (Checkout)

```javascript
// Extract from Checkout.js

// 1. Customer enters code
const [formData, setFormData] = useState({
  promotionCode: ''
});

// 2. Validate code (optional preview)
const validatePromoCode = async () => {
  const response = await promoCodeService.validatePromoCode(
    formData.promotionCode, 
    cartTotal
  );
  setPromoValidation(response.data);
};

// 3. Calculate display total
const calculateTotal = () => {
  if (promoValidation) {
    return cartTotal - promoValidation.discountAmount;
  }
  return cartTotal;
};

// 4. Submit order with code
const handleSubmit = async () => {
  await orderService.createOrder({
    items: cartItems,
    promotionCode: formData.promotionCode,
    // ... other fields
  });
};
```

---

## Summary

✅ **Feature**: Promo discount automatically applied to orders  
✅ **Status**: Fully implemented and working  
✅ **Validation**: Comprehensive rule checking  
✅ **Calculation**: Accurate discount computation  
✅ **Storage**: Discount tracked in database  
✅ **Usage Tracking**: Automatic count increment  
✅ **Error Handling**: Transaction-safe operations  
✅ **Customer Experience**: Seamless discount application  

---

## Key Points

1. **Automatic Application** - Discount applied when order is created
2. **Server-Side Validation** - All checks on backend for security
3. **Accurate Calculation** - Handles percentage, fixed, caps, and limits
4. **Usage Tracking** - Counts uses and enforces limits
5. **Transaction Safety** - Atomic operations prevent errors
6. **Clear Feedback** - Customers see exact savings
7. **Admin Visibility** - Track code performance

**Customers get their discounts automatically - no manual intervention needed!** 🎉💰

---

## Quick Reference

### For Customers
1. Add items to cart
2. Go to checkout
3. Enter promo code
4. Submit order
5. ✅ Discount automatically applied!

### For Admins
1. Create promo codes
2. Set discount rules
3. Monitor usage
4. Track performance
5. ✅ System handles the rest!

**The discount system works seamlessly end-to-end!** 🚀
