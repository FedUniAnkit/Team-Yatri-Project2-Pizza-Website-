
## 1. Sample Users (3 users)

### Admin User
```javascript
{
  name: 'Admin User',
  email: 'admin@komorebi.com',
  password: 'admin123',
  role: 'admin',
  phone: '+1234567890',
  address: {
    street: '123 Admin St',
    city: 'Pizza City',
    state: 'PC',
    zipCode: '12345'
  }
}
```

### Staff Member
```javascript
{
  name: 'Staff Member',
  email: 'staff@komorebi.com',
  password: 'staff123',
  role: 'staff',
  phone: '+1234567891'
}
```

### Customer
```javascript
{
  name: 'John Customer',
  email: 'customer@example.com',
  password: 'customer123',
  role: 'customer',
  phone: '+1234567892',
  address: {
    street: '456 Customer Ave',
    city: 'Pizza City',
    state: 'PC',
    zipCode: '12346'
  }
}
```

**Login Credentials**:
- Admin: `admin@komorebi.com` / `admin123`
- Staff: `staff@komorebi.com` / `staff123`
- Customer: `customer@example.com` / `customer123`

---

## 2. Categories (5 categories)

```javascript
[
  { name: 'pizza', displayName: 'Pizzas', description: 'Delicious wood-fired pizzas', sortOrder: 1 },
  { name: 'drink', displayName: 'Drinks', description: 'Refreshing beverages', sortOrder: 2 },
  { name: 'side', displayName: 'Sides', description: 'Appetizers and sides', sortOrder: 3 },
  { name: 'dessert', displayName: 'Desserts', description: 'Sweet treats', sortOrder: 4 },
  { name: 'deal', displayName: 'Deals', description: 'Special offers', sortOrder: 5 }
]
```

---

## 3. Customization Options (29 options)

### Crusts (4 options)
```javascript
[
  { optionType: 'crust', name: 'regular', displayName: 'Regular Crust', priceModifier: 0, sortOrder: 1 },
  { optionType: 'crust', name: 'thin', displayName: 'Thin & Crispy', priceModifier: 0, sortOrder: 2 },
  { optionType: 'crust', name: 'thick', displayName: 'Thick Crust', priceModifier: 2.00, sortOrder: 3 },
  { optionType: 'crust', name: 'stuffed', displayName: 'Stuffed Crust', priceModifier: 3.50, sortOrder: 4 }
]
```

### Sauces (4 options)
```javascript
[
  { optionType: 'sauce', name: 'tomato', displayName: 'Tomato Sauce', priceModifier: 0, sortOrder: 1 },
  { optionType: 'sauce', name: 'bbq', displayName: 'BBQ Sauce', priceModifier: 0.50, sortOrder: 2 },
  { optionType: 'sauce', name: 'pesto', displayName: 'Pesto Sauce', priceModifier: 1.00, sortOrder: 3 },
  { optionType: 'sauce', name: 'garlic', displayName: 'Garlic Sauce', priceModifier: 0.50, sortOrder: 4 }
]
```

### Cheese (4 options)
```javascript
[
  { optionType: 'cheese', name: 'mozzarella', displayName: 'Mozzarella', priceModifier: 0, sortOrder: 1 },
  { optionType: 'cheese', name: 'cheddar', displayName: 'Cheddar', priceModifier: 1.00, sortOrder: 2 },
  { optionType: 'cheese', name: 'parmesan', displayName: 'Parmesan', priceModifier: 1.50, sortOrder: 3 },
  { optionType: 'cheese', name: 'feta', displayName: 'Feta', priceModifier: 1.50, sortOrder: 4 }
]
```

### Toppings - Meats (6 options)
```javascript
[
  { optionType: 'topping', name: 'pepperoni', displayName: 'Pepperoni', priceModifier: 2.00, category: 'meat', sortOrder: 1 },
  { optionType: 'topping', name: 'ham', displayName: 'Ham', priceModifier: 2.00, category: 'meat', sortOrder: 2 },
  { optionType: 'topping', name: 'bacon', displayName: 'Bacon', priceModifier: 2.50, category: 'meat', sortOrder: 3 },
  { optionType: 'topping', name: 'chicken', displayName: 'Chicken', priceModifier: 2.50, category: 'meat', sortOrder: 4 },
  { optionType: 'topping', name: 'beef', displayName: 'Beef', priceModifier: 2.50, category: 'meat', sortOrder: 5 },
  { optionType: 'topping', name: 'sausage', displayName: 'Italian Sausage', priceModifier: 2.50, category: 'meat', sortOrder: 6 }
]
```

### Toppings - Vegetables (8 options)
```javascript
[
  { optionType: 'topping', name: 'mushrooms', displayName: 'Mushrooms', priceModifier: 1.50, category: 'vegetable', sortOrder: 7 },
  { optionType: 'topping', name: 'onions', displayName: 'Onions', priceModifier: 1.00, category: 'vegetable', sortOrder: 8 },
  { optionType: 'topping', name: 'peppers', displayName: 'Bell Peppers', priceModifier: 1.50, category: 'vegetable', sortOrder: 9 },
  { optionType: 'topping', name: 'olives', displayName: 'Olives', priceModifier: 1.50, category: 'vegetable', sortOrder: 10 },
  { optionType: 'topping', name: 'tomatoes', displayName: 'Fresh Tomatoes', priceModifier: 1.00, category: 'vegetable', sortOrder: 11 },
  { optionType: 'topping', name: 'spinach', displayName: 'Spinach', priceModifier: 1.50, category: 'vegetable', sortOrder: 12 },
  { optionType: 'topping', name: 'jalapenos', displayName: 'Jalapeños', priceModifier: 1.00, category: 'vegetable', sortOrder: 13 },
  { optionType: 'topping', name: 'pineapple', displayName: 'Pineapple', priceModifier: 1.50, category: 'vegetable', sortOrder: 14 }
]
```

---

## 4. Products (36 products)

### Pizzas (15 products)

#### 1. Margherita Supreme - $24.00
```javascript
{
  name: 'Margherita Supreme',
  description: 'Fresh mozzarella, basil, premium tomatoes',
  price: 24.00,
  category: 'pizza',
  ingredients: ['Fresh Mozzarella', 'Premium Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil'],
  sizes: [
    { name: 'Small', price: 20.00 },
    { name: 'Medium', price: 24.00 },
    { name: 'Large', price: 28.00 }
  ],
  preparationTime: 15,
  nutritionalInfo: { calories: 280, protein: 14, carbs: 32, fat: 12 }
}
```

#### 2. Pepperoni Classic - $22.00
```javascript
{
  name: 'Pepperoni Classic',
  description: 'Premium pepperoni, mozzarella',
  price: 22.00,
  category: 'pizza',
  ingredients: ['Premium Pepperoni', 'Mozzarella', 'Tomato Sauce'],
  sizes: [
    { name: 'Small', price: 18.00 },
    { name: 'Medium', price: 22.00 },
    { name: 'Large', price: 26.00 }
  ],
  preparationTime: 18
}
```

#### 3. Meat Lovers - $28.00
```javascript
{
  name: 'Meat Lovers',
  description: 'Pepperoni, sausage, bacon, ham',
  price: 28.00,
  category: 'pizza',
  ingredients: ['Pepperoni', 'Italian Sausage', 'Bacon', 'Ham', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 24.00 },
    { name: 'Medium', price: 28.00 },
    { name: 'Large', price: 32.00 }
  ],
  preparationTime: 22
}
```

#### 4. Veggie Delight - $26.00
```javascript
{
  name: 'Veggie Delight',
  description: 'Fresh vegetables, herbs, cheese',
  price: 26.00,
  category: 'pizza',
  ingredients: ['Bell Peppers', 'Mushrooms', 'Red Onions', 'Olives', 'Tomatoes', 'Fresh Herbs', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 22.00 },
    { name: 'Medium', price: 26.00 },
    { name: 'Large', price: 30.00 }
  ],
  preparationTime: 20
}
```

#### 5. Pineapple Pizza - $25.00
```javascript
{
  name: 'Pineapple Pizza',
  description: 'Ham, pineapple, mozzarella',
  price: 25.00,
  category: 'pizza',
  ingredients: ['Ham', 'Fresh Pineapple', 'Mozzarella', 'Tomato Sauce'],
  sizes: [
    { name: 'Small', price: 21.00 },
    { name: 'Medium', price: 25.00 },
    { name: 'Large', price: 29.00 }
  ],
  preparationTime: 18
}
```

#### 6. Teriyaki Delight - $27.00
```javascript
{
  name: 'Teriyaki Delight',
  description: 'Japanese teriyaki chicken, fresh vegetables',
  price: 27.00,
  category: 'pizza',
  ingredients: ['Teriyaki Chicken', 'Bell Peppers', 'Red Onions', 'Pineapple', 'Mozzarella', 'Teriyaki Sauce'],
  sizes: [
    { name: 'Small', price: 23.00 },
    { name: 'Medium', price: 27.00 },
    { name: 'Large', price: 31.00 }
  ],
  preparationTime: 20
}
```

#### 7. Okonomiyaki Fusion - $26.00
```javascript
{
  name: 'Okonomiyaki Fusion',
  description: 'Traditional Japanese flavors on pizza',
  price: 26.00,
  category: 'pizza',
  ingredients: ['Cabbage', 'Bacon', 'Bonito Flakes', 'Okonomiyaki Sauce', 'Japanese Mayo', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 22.00 },
    { name: 'Medium', price: 26.00 },
    { name: 'Large', price: 30.00 }
  ],
  preparationTime: 22
}
```

#### 8. BBQ Chicken Supreme - $25.00
```javascript
{
  name: 'BBQ Chicken Supreme',
  description: 'Grilled chicken, BBQ sauce, red onions, cilantro',
  price: 25.00,
  category: 'pizza',
  ingredients: ['Grilled Chicken', 'BBQ Sauce', 'Red Onions', 'Cilantro', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 21.00 },
    { name: 'Medium', price: 25.00 },
    { name: 'Large', price: 29.00 }
  ],
  preparationTime: 20
}
```

#### 9. Mediterranean Delight - $24.00
```javascript
{
  name: 'Mediterranean Delight',
  description: 'Feta cheese, olives, sun-dried tomatoes, spinach',
  price: 24.00,
  category: 'pizza',
  ingredients: ['Feta Cheese', 'Kalamata Olives', 'Sun-dried Tomatoes', 'Fresh Spinach', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 20.00 },
    { name: 'Medium', price: 24.00 },
    { name: 'Large', price: 28.00 }
  ],
  preparationTime: 18
}
```

#### 10. Spicy Italian - $26.00
```javascript
{
  name: 'Spicy Italian',
  description: 'Spicy salami, jalapeños, hot peppers, chili oil',
  price: 26.00,
  category: 'pizza',
  ingredients: ['Spicy Salami', 'Jalapeños', 'Hot Peppers', 'Chili Oil', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 22.00 },
    { name: 'Medium', price: 26.00 },
    { name: 'Large', price: 30.00 }
  ],
  preparationTime: 19
}
```

#### 11. Four Cheese Classic - $23.00
```javascript
{
  name: 'Four Cheese Classic',
  description: 'Mozzarella, parmesan, gorgonzola, ricotta',
  price: 23.00,
  category: 'pizza',
  ingredients: ['Mozzarella', 'Parmesan', 'Gorgonzola', 'Ricotta', 'White Sauce'],
  sizes: [
    { name: 'Small', price: 19.00 },
    { name: 'Medium', price: 23.00 },
    { name: 'Large', price: 27.00 }
  ],
  preparationTime: 16
}
```

#### 12. Mushroom Truffle - $29.00
```javascript
{
  name: 'Mushroom Truffle',
  description: 'Mixed mushrooms, truffle oil, arugula, parmesan',
  price: 29.00,
  category: 'pizza',
  ingredients: ['Mixed Mushrooms', 'Truffle Oil', 'Fresh Arugula', 'Parmesan', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 25.00 },
    { name: 'Medium', price: 29.00 },
    { name: 'Large', price: 33.00 }
  ],
  preparationTime: 20
}
```

#### 13. Prosciutto & Fig - $30.00
```javascript
{
  name: 'Prosciutto & Fig',
  description: 'Prosciutto, fresh figs, goat cheese, honey drizzle',
  price: 30.00,
  category: 'pizza',
  ingredients: ['Prosciutto', 'Fresh Figs', 'Goat Cheese', 'Honey', 'Arugula', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 26.00 },
    { name: 'Medium', price: 30.00 },
    { name: 'Large', price: 34.00 }
  ],
  preparationTime: 18
}
```

#### 14. Buffalo Chicken - $26.00
```javascript
{
  name: 'Buffalo Chicken',
  description: 'Buffalo chicken, blue cheese, celery, ranch drizzle',
  price: 26.00,
  category: 'pizza',
  ingredients: ['Buffalo Chicken', 'Blue Cheese', 'Celery', 'Ranch Sauce', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 22.00 },
    { name: 'Medium', price: 26.00 },
    { name: 'Large', price: 30.00 }
  ],
  preparationTime: 20
}
```

#### 15. Seafood Special - $32.00
```javascript
{
  name: 'Seafood Special',
  description: 'Shrimp, calamari, garlic, white wine sauce',
  price: 32.00,
  category: 'pizza',
  ingredients: ['Shrimp', 'Calamari', 'Garlic', 'White Wine Sauce', 'Fresh Herbs', 'Mozzarella'],
  sizes: [
    { name: 'Small', price: 28.00 },
    { name: 'Medium', price: 32.00 },
    { name: 'Large', price: 36.00 }
  ],
  preparationTime: 25
}
```

### Sides (6 products)

#### 1. Garlic Bread - $6.99
```javascript
{
  name: 'Garlic Bread',
  description: 'Fresh baked bread with garlic butter and herbs',
  price: 6.99,
  category: 'side',
  ingredients: ['Bread', 'Garlic', 'Butter', 'Herbs'],
  sizes: [{ name: 'Regular', price: 6.99 }],
  preparationTime: 8
}
```

#### 2. Caesar Salad - $8.99
```javascript
{
  name: 'Caesar Salad',
  description: 'Crisp romaine lettuce with Caesar dressing and croutons',
  price: 8.99,
  category: 'side',
  ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'],
  sizes: [{ name: 'Regular', price: 8.99 }],
  preparationTime: 5
}
```

#### 3. Buffalo Wings - $12.99
```javascript
{
  name: 'Buffalo Wings',
  description: 'Crispy chicken wings with buffalo sauce and blue cheese dip',
  price: 12.99,
  category: 'side',
  ingredients: ['Chicken Wings', 'Buffalo Sauce', 'Blue Cheese', 'Celery'],
  sizes: [
    { name: '6 pieces', price: 9.99 },
    { name: '12 pieces', price: 12.99 },
    { name: '18 pieces', price: 18.99 }
  ],
  preparationTime: 15
}
```

#### 4. Mozzarella Sticks - $8.99
```javascript
{
  name: 'Mozzarella Sticks',
  description: 'Golden fried mozzarella sticks with marinara sauce',
  price: 8.99,
  category: 'side',
  ingredients: ['Mozzarella', 'Breadcrumbs', 'Marinara Sauce'],
  sizes: [
    { name: '6 pieces', price: 8.99 },
    { name: '12 pieces', price: 15.99 }
  ],
  preparationTime: 10
}
```

#### 5. Loaded Nachos - $11.99
```javascript
{
  name: 'Loaded Nachos',
  description: 'Tortilla chips with cheese, jalapeños, sour cream, and guacamole',
  price: 11.99,
  category: 'side',
  ingredients: ['Tortilla Chips', 'Cheese', 'Jalapeños', 'Sour Cream', 'Guacamole'],
  sizes: [
    { name: 'Regular', price: 11.99 },
    { name: 'Large', price: 16.99 }
  ],
  preparationTime: 8
}
```

#### 6. Chocolate Chip Cookie - $2.99
```javascript
{
  name: 'Chocolate Chip Cookie',
  description: 'Freshly baked chocolate chip cookie',
  price: 2.99,
  category: 'side',
  ingredients: ['Flour', 'Chocolate Chips', 'Butter', 'Sugar'],
  sizes: [
    { name: '1 cookie', price: 2.99 },
    { name: '3 cookies', price: 7.99 },
    { name: '6 cookies', price: 14.99 }
  ],
  preparationTime: 2
}
```

### Drinks (5 products)

#### 1. Coca Cola - $2.99
```javascript
{
  name: 'Coca Cola',
  description: 'Classic Coca Cola soft drink',
  price: 2.99,
  category: 'drink',
  ingredients: ['Coca Cola'],
  sizes: [
    { name: 'Small', price: 2.99 },
    { name: 'Medium', price: 3.49 },
    { name: 'Large', price: 3.99 }
  ],
  preparationTime: 1
}
```

#### 2. Fresh Orange Juice - $4.99
```javascript
{
  name: 'Fresh Orange Juice',
  description: 'Freshly squeezed orange juice',
  price: 4.99,
  category: 'drink',
  ingredients: ['Fresh Oranges'],
  sizes: [
    { name: 'Small', price: 3.99 },
    { name: 'Medium', price: 4.99 },
    { name: 'Large', price: 5.99 }
  ],
  preparationTime: 2
}
```

#### 3. Craft Beer - $5.99
```javascript
{
  name: 'Craft Beer',
  description: 'Local craft beer selection',
  price: 5.99,
  category: 'drink',
  ingredients: ['Craft Beer'],
  sizes: [
    { name: 'Bottle', price: 5.99 },
    { name: 'Pint', price: 7.99 }
  ],
  preparationTime: 1
}
```

#### 4. Italian Soda - $3.99
```javascript
{
  name: 'Italian Soda',
  description: 'Sparkling water with Italian syrup flavors',
  price: 3.99,
  category: 'drink',
  ingredients: ['Sparkling Water', 'Italian Syrup'],
  sizes: [{ name: 'Regular', price: 3.99 }],
  preparationTime: 2
}
```

#### 5. Iced Tea - $2.99
```javascript
{
  name: 'Iced Tea',
  description: 'Refreshing iced tea with lemon',
  price: 2.99,
  category: 'drink',
  ingredients: ['Tea', 'Ice', 'Lemon'],
  sizes: [
    { name: 'Small', price: 2.99 },
    { name: 'Medium', price: 3.49 },
    { name: 'Large', price: 3.99 }
  ],
  preparationTime: 1
}
```

### Desserts (5 products)

#### 1. Chocolate Brownie - $5.99
```javascript
{
  name: 'Chocolate Brownie',
  description: 'Rich chocolate brownie with vanilla ice cream',
  price: 5.99,
  category: 'dessert',
  ingredients: ['Chocolate', 'Flour', 'Sugar', 'Vanilla Ice Cream'],
  sizes: [{ name: 'Regular', price: 5.99 }],
  preparationTime: 3
}
```

#### 2. Tiramisu - $7.99
```javascript
{
  name: 'Tiramisu',
  description: 'Classic Italian tiramisu with coffee and mascarpone',
  price: 7.99,
  category: 'dessert',
  ingredients: ['Ladyfingers', 'Coffee', 'Mascarpone', 'Cocoa'],
  sizes: [{ name: 'Regular', price: 7.99 }],
  preparationTime: 2
}
```

#### 3. Gelato Trio - $6.99
```javascript
{
  name: 'Gelato Trio',
  description: 'Three scoops of artisan gelato - vanilla, chocolate, strawberry',
  price: 6.99,
  category: 'dessert',
  ingredients: ['Vanilla Gelato', 'Chocolate Gelato', 'Strawberry Gelato'],
  sizes: [
    { name: '3 scoops', price: 6.99 },
    { name: '5 scoops', price: 9.99 }
  ],
  preparationTime: 2
}
```

#### 4. Cannoli - $4.99
```javascript
{
  name: 'Cannoli',
  description: 'Traditional Sicilian cannoli with ricotta filling',
  price: 4.99,
  category: 'dessert',
  ingredients: ['Cannoli Shell', 'Ricotta', 'Chocolate Chips', 'Powdered Sugar'],
  sizes: [
    { name: '2 pieces', price: 4.99 },
    { name: '4 pieces', price: 8.99 }
  ],
  preparationTime: 1
}
```

#### 5. Cheesecake - $6.99
```javascript
{
  name: 'Cheesecake',
  description: 'New York style cheesecake with berry compote',
  price: 6.99,
  category: 'dessert',
  ingredients: ['Cream Cheese', 'Graham Cracker Crust', 'Berry Compote'],
  sizes: [{ name: 'Regular', price: 6.99 }],
  preparationTime: 2
}
```

### Deals (5 products)

#### 1. Family Pizza Deal - $49.99
```javascript
{
  name: 'Family Pizza Deal',
  description: '2 Large pizzas + 4 drinks + garlic bread',
  price: 49.99,
  category: 'deal',
  ingredients: ['2 Large Pizzas', '4 Drinks', 'Garlic Bread'],
  sizes: [{ name: 'Family Pack', price: 49.99 }],
  preparationTime: 25
}
```

#### 2. Lunch Special - $15.99
```javascript
{
  name: 'Lunch Special',
  description: 'Small pizza + drink + side',
  price: 15.99,
  category: 'deal',
  ingredients: ['Small Pizza', 'Drink', 'Side'],
  sizes: [{ name: 'Lunch Deal', price: 15.99 }],
  preparationTime: 15
}
```

#### 3. Date Night Package - $34.99
```javascript
{
  name: 'Date Night Package',
  description: 'Large pizza + 2 drinks + dessert to share',
  price: 34.99,
  category: 'deal',
  ingredients: ['Large Pizza', '2 Drinks', 'Shared Dessert'],
  sizes: [{ name: 'Date Night', price: 34.99 }],
  preparationTime: 20
}
```

#### 4. Party Platter - $79.99
```javascript
{
  name: 'Party Platter',
  description: '3 Large pizzas + 12 wings + 6 drinks',
  price: 79.99,
  category: 'deal',
  ingredients: ['3 Large Pizzas', '12 Wings', '6 Drinks'],
  sizes: [{ name: 'Party Pack', price: 79.99 }],
  preparationTime: 30
}
```

#### 5. Student Special - $18.99
```javascript
{
  name: 'Student Special',
  description: 'Medium pizza + drink + cookie',
  price: 18.99,
  category: 'deal',
  ingredients: ['Medium Pizza', 'Drink', 'Cookie'],
  sizes: [{ name: 'Student Deal', price: 18.99 }],
  preparationTime: 18
}
```

---

## 5. Promotions (2 promotions)

### SAVE10 - 10% Off
```javascript
{
  code: 'SAVE10',
  description: 'Get 10% off your entire order.',
  discountType: 'percentage',
  amount: 10,
  isActive: true
}
```

### 5OFF - $5 Off
```javascript
{
  code: '5OFF',
  description: 'Get $5 off your order of $25 or more.',
  discountType: 'fixed',
  amount: 5,
  isActive: true
}
```

---

## 6. Content Blocks (5 blocks)

```javascript
[
  {
    slug: 'homepage-welcome-title',
    title: 'Homepage Welcome Title',
    content: 'Welcome to Komorebi Pizza!',
    type: 'text'
  },
  {
    slug: 'homepage-welcome-subtitle',
    title: 'Homepage Welcome Subtitle',
    content: 'Handcrafted pizzas made with love and the freshest ingredients.',
    type: 'text'
  },
  {
    slug: 'about-us-main',
    title: 'About Us Main',
    content: '<p>Founded in 2023, Komorebi Pizza started with a simple dream: to bring authentic, delicious pizza to our community. We believe in quality, from our hand-stretched dough to our locally-sourced toppings.</p>',
    type: 'html'
  },
  {
    slug: 'footer-copyright',
    title: 'Footer Copyright',
    content: '2023 Komorebi Pizza. All rights reserved.',
    type: 'text'
  },
  {
    slug: 'footer-contact',
    title: 'Footer Contact',
    content: '123 Main St, Pizza City, PC 12345 | Phone: +1234567890 | Email: info@komorebi.com',
    type: 'text'
  }
]
```

---

## How to Run Seed Scripts

### Method 1: Using sampleData.js (Recommended)
```bash
cd server
npm run seed
```

This will:
- Clear existing data
- Create 3 users (admin, staff, customer)
- Create 36 products (15 pizzas, 6 sides, 5 drinks, 5 desserts, 5 deals)
- Create 2 promotions
- Create 5 content blocks

### Method 2: Using seedAll.js (Categories & Customization Options)
```bash
cd server/scripts
node seedAll.js
```

This will:
- Create 5 categories
- Create 29 customization options (crusts, sauces, cheese, toppings)

### Method 3: Using seedViaAPI.js (Via REST API)
```bash
cd server/scripts
node seedViaAPI.js
```

This requires:
- Backend server running
- Valid admin credentials in the script

---

## Summary

**Total Seed Data**:
- **3** Users (1 admin, 1 staff, 1 customer)
- **5** Categories
- **29** Customization Options
- **36** Products
  - 15 Pizzas
  - 6 Sides
  - 5 Drinks
  - 5 Desserts
  - 5 Deals
- **2** Promotions
- **5** Content Blocks
