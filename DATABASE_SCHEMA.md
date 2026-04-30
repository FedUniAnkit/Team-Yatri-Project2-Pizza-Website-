# Database Schema Documentation

## Technology Stack
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Dialect**: postgres

## Database Models

### 1. User Model
**Table**: `Users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT UUIDV4 | Unique user identifier |
| name | STRING | NOT NULL, 2-100 chars | User's full name |
| email | STRING | NOT NULL, UNIQUE, isEmail | User's email address (lowercase) |
| password | STRING | NOT NULL, min 6 chars | Hashed password |
| passwordResetToken | STRING | NULLABLE | Token for password reset |
| passwordResetExpires | DATE | NULLABLE | Expiry time for reset token |
| passwordChangedAt | DATE | NULLABLE | Last password change timestamp |
| otpCode | STRING | NULLABLE | One-time password code |
| otpExpires | DATE | NULLABLE | OTP expiry time |
| forcePasswordReset | BOOLEAN | DEFAULT false | Force user to reset password |
| isTemporaryPassword | BOOLEAN | DEFAULT false | Indicates temporary password |
| accountStatus | ENUM | DEFAULT 'active' | active, pending_staff_registration, inactive |
| phone | STRING | NULLABLE | User's phone number |
| address | JSONB | NULLABLE, DEFAULT {} | User's address object |
| role | ENUM | DEFAULT 'customer' | customer, staff, admin |
| isActive | BOOLEAN | DEFAULT true | Account active status |
| avatar | STRING | NULLABLE, DEFAULT '' | Avatar image path |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

**Hooks**:
- `beforeCreate`: Hash password with bcrypt (salt rounds: 10)
- `beforeUpdate`: Hash password if changed, update passwordChangedAt

**Instance Methods**:
- `comparePassword(candidatePassword)`: Compare plain password with hashed
- `getPasswordResetToken()`: Generate password reset token (10 min expiry)
- `generateOTP()`: Generate 6-digit OTP (10 min expiry)
- `verifyOTP(otp)`: Verify OTP code

---

### 2. Product Model
**Table**: `Products`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT UUIDV4 | Unique product identifier |
| name | STRING | NOT NULL, 2-100 chars | Product name |
| description | TEXT | NOT NULL | Product description |
| price | DECIMAL(10,2) | NOT NULL, min 0 | Base price |
| category | STRING(50) | NOT NULL | Product category |
| subcategory | STRING(50) | NULLABLE | Product subcategory |
| image | TEXT | NULLABLE, DEFAULT '' | Image path/URL |
| ingredients | ARRAY(STRING) | NULLABLE, DEFAULT [] | List of ingredients |
| sizes | JSONB | NULLABLE, DEFAULT [] | Available sizes with prices |
| isAvailable | BOOLEAN | DEFAULT true | Product availability |
| preparationTime | INTEGER | DEFAULT 15, min 1 | Prep time in minutes |
| nutritionalInfo | JSONB | NULLABLE, DEFAULT {} | Nutrition facts |
| dietaryInfo | JSONB | NULLABLE, DEFAULT {} | Dietary information |
| customizationOptions | JSONB | NULLABLE, DEFAULT {} | Customization options |
| allergens | ARRAY(STRING) | NULLABLE, DEFAULT [] | Allergen information |
| spiceLevel | INTEGER | DEFAULT 0, 0-5 | Spice level rating |
| isPopular | BOOLEAN | DEFAULT false | Popular item flag |
| isNew | BOOLEAN | DEFAULT false | New item flag |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

**Indexes**:
- `category`
- `isAvailable`

---

### 3. Order Model
**Table**: `Orders`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT UUIDV4 | Unique order identifier |
| orderNumber | STRING | NOT NULL, UNIQUE | Human-readable order number |
| customerId | UUID | NOT NULL, FK → Users.id | Customer reference |
| items | JSONB | NOT NULL, DEFAULT [] | Order items array |
| totalAmount | DECIMAL(10,2) | NOT NULL, min 0 | Total order amount |
| status | ENUM | DEFAULT 'pending' | pending, confirmed, preparing, ready, delivered, cancelled |
| paymentStatus | ENUM | DEFAULT 'pending' | pending, paid, failed, refunded |
| paymentMethod | ENUM | DEFAULT 'online' | cash, card, online |
| deliveryAddress | JSONB | NULLABLE, DEFAULT {} | Delivery address object |
| customerNotes | TEXT | NULLABLE, max 500 chars | Customer instructions |
| staffNotes | TEXT | NULLABLE, max 500 chars | Staff notes |
| cancellationReason | TEXT | NULLABLE | Reason for cancellation |
| cancelledBy | UUID | NULLABLE, FK → Users.id | User who cancelled |
| estimatedDeliveryTime | DATE | NULLABLE | Estimated delivery time |
| actualDeliveryTime | DATE | NULLABLE | Actual delivery time |
| stripePaymentIntentId | STRING | NULLABLE | Stripe payment intent ID for online payments |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

**Hooks**:
- `beforeCreate`: Generate orderNumber (format: `ORD-{timestamp}-{random}`)

**Indexes**:
- `customerId`
- `status`
- `orderNumber`
- `createdAt`
- `stripePaymentIntentId`

---

### 4. Category Model
**Table**: `categories`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT UUIDV4 | Unique category identifier |
| name | STRING(60) | NOT NULL, UNIQUE, alphanumeric+dash | Category slug/identifier |
| displayName | STRING(120) | NOT NULL | Display name |
| description | TEXT | NULLABLE | Category description |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

---

### 5. Promotion Model
**Table**: `Promotions`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT UUIDV4 | Unique promotion identifier |
| code | STRING(50) | NOT NULL, UNIQUE | Promotion code |
| description | TEXT | NULLABLE | Promotion description |
| discountType | ENUM | NOT NULL | percentage, fixed |
| amount | DECIMAL(10,2) | NOT NULL, min 0 | Discount amount |
| startDate | DATE | NULLABLE | Promotion start date |
| endDate | DATE | NULLABLE | Promotion end date |
| isActive | BOOLEAN | DEFAULT true | Active status |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

**Validation**:
- End date must be after start date

**Indexes**:
- `code` (unique)
- `isActive, startDate, endDate`

---

### 6. CustomizationOption Model
**Table**: `CustomizationOptions`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT UUIDV4 | Unique option identifier |
| optionType | STRING(50) | NOT NULL | size, crust, sauce, cheese, topping |
| name | STRING(100) | NOT NULL | Option identifier |
| displayName | STRING(100) | NOT NULL | Display name |
| priceModifier | DECIMAL(10,2) | DEFAULT 0, min -50 | Price adjustment |
| category | STRING(50) | NULLABLE | For toppings: veg, protein, premium |
| dietaryInfo | JSONB | NULLABLE, DEFAULT {} | Dietary information |
| isAvailable | BOOLEAN | DEFAULT true | Availability status |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

**Indexes**:
- `optionType`
- `category`
- `isAvailable`
- `sortOrder`

---

### 7. Message Model
**Table**: `Messages`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique message identifier |
| orderId | UUID | NOT NULL, FK → Orders.id, CASCADE | Related order |
| senderId | UUID | NOT NULL, FK → Users.id, CASCADE | Message sender |
| receiverId | UUID | NOT NULL, FK → Users.id, CASCADE | Message receiver |
| content | TEXT | NOT NULL | Message content |
| isRead | BOOLEAN | DEFAULT false | Read status |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

---

### 8. ContentBlock Model
**Table**: `ContentBlocks`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique block identifier |
| slug | STRING | NOT NULL, UNIQUE | Content block identifier |
| title | STRING | NOT NULL | Block title |
| type | ENUM | DEFAULT 'text' | text, html, markdown, image_url, json |
| content | TEXT | NOT NULL | Block content |
| lastUpdatedBy | UUID | NULLABLE, FK → Users.id, SET NULL | Last editor |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

---

### 9. NewsletterSubscription Model
**Table**: `NewsletterSubscriptions`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique subscription identifier |
| email | STRING | NOT NULL, UNIQUE, isEmail | Subscriber email |
| isActive | BOOLEAN | DEFAULT true, NOT NULL | Subscription status |
| createdAt | TIMESTAMP | AUTO | Record creation time |
| updatedAt | TIMESTAMP | AUTO | Record update time |

---

## Model Associations

### User Associations
- `User.hasMany(Order)` → as 'orders' (foreignKey: customerId)
- `User.hasMany(Message)` → as 'SentMessages' (foreignKey: senderId)
- `User.hasMany(Message)` → as 'ReceivedMessages' (foreignKey: receiverId)
- `User.hasMany(ContentBlock)` → as 'contentBlocksUpdated' (foreignKey: lastUpdatedBy)

### Order Associations
- `Order.belongsTo(User)` → as 'customer' (foreignKey: customerId)
- `Order.belongsTo(Promotion)` → as 'promotion' (foreignKey: promotionId)
- `Order.hasMany(Message)` → as 'Messages' (foreignKey: orderId)

### Promotion Associations
- `Promotion.hasMany(Order)` → as 'orders' (foreignKey: promotionId, onDelete: SET NULL)

### Message Associations
- `Message.belongsTo(User)` → as 'Sender' (foreignKey: senderId)
- `Message.belongsTo(User)` → as 'Receiver' (foreignKey: receiverId)
- `Message.belongsTo(Order)` → (foreignKey: orderId)

### ContentBlock Associations
- `ContentBlock.belongsTo(User)` → as 'updatedBy' (foreignKey: lastUpdatedBy)

---

## Database Connection Configuration

```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
```

## Environment Variables Required

```env
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```
