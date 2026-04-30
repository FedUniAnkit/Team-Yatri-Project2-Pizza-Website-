-- PostgreSQL Seed Data for Pizza Order Application
-- Run this file after schema.sql to populate the database with sample data

-- Note: Passwords are hashed with bcrypt (salt rounds: 10)
-- Plain passwords: admin123, staff123, customer123

-- Insert Users
INSERT INTO "Users" (id, name, email, password, role, phone, address, "createdAt", "updatedAt") VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin@komorebi.com', '$2a$10$YourHashedPasswordHere1', 'admin', '+1234567890', '{"street":"123 Admin St","city":"Pizza City","state":"PC","zipCode":"12345"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Staff Member', 'staff@komorebi.com', '$2a$10$YourHashedPasswordHere2', 'staff', '+1234567891', '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'John Customer', 'customer@example.com', '$2a$10$YourHashedPasswordHere3', 'customer', '+1234567892', '{"street":"456 Customer Ave","city":"Pizza City","state":"PC","zipCode":"12346"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Categories
INSERT INTO "categories" (id, name, "displayName", description, "sortOrder", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'pizza', 'Pizzas', 'Delicious wood-fired pizzas', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'drink', 'Drinks', 'Refreshing beverages', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'side', 'Sides', 'Appetizers and sides', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'dessert', 'Desserts', 'Sweet treats', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'deal', 'Deals', 'Special offers', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Customization Options - Crusts
INSERT INTO "CustomizationOptions" (id, "optionType", name, "displayName", "priceModifier", "isAvailable", "sortOrder", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'crust', 'regular', 'Regular Crust', 0, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'crust', 'thin', 'Thin & Crispy', 0, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'crust', 'thick', 'Thick Crust', 2.00, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'crust', 'stuffed', 'Stuffed Crust', 3.50, true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Customization Options - Sauces
INSERT INTO "CustomizationOptions" (id, "optionType", name, "displayName", "priceModifier", "isAvailable", "sortOrder", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'sauce', 'tomato', 'Tomato Sauce', 0, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'sauce', 'bbq', 'BBQ Sauce', 0.50, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'sauce', 'pesto', 'Pesto Sauce', 1.00, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'sauce', 'garlic', 'Garlic Sauce', 0.50, true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Customization Options - Cheese
INSERT INTO "CustomizationOptions" (id, "optionType", name, "displayName", "priceModifier", "isAvailable", "sortOrder", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'cheese', 'mozzarella', 'Mozzarella', 0, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'cheese', 'cheddar', 'Cheddar', 1.00, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'cheese', 'parmesan', 'Parmesan', 1.50, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'cheese', 'feta', 'Feta', 1.50, true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Customization Options - Toppings (Meats)
INSERT INTO "CustomizationOptions" (id, "optionType", name, "displayName", "priceModifier", category, "isAvailable", "sortOrder", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'topping', 'pepperoni', 'Pepperoni', 2.00, 'meat', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'ham', 'Ham', 2.00, 'meat', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'bacon', 'Bacon', 2.50, 'meat', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'chicken', 'Chicken', 2.50, 'meat', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'beef', 'Beef', 2.50, 'meat', true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'sausage', 'Italian Sausage', 2.50, 'meat', true, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Customization Options - Toppings (Vegetables)
INSERT INTO "CustomizationOptions" (id, "optionType", name, "displayName", "priceModifier", category, "isAvailable", "sortOrder", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'topping', 'mushrooms', 'Mushrooms', 1.50, 'vegetable', true, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'onions', 'Onions', 1.00, 'vegetable', true, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'peppers', 'Bell Peppers', 1.50, 'vegetable', true, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'olives', 'Olives', 1.50, 'vegetable', true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'tomatoes', 'Fresh Tomatoes', 1.00, 'vegetable', true, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'spinach', 'Spinach', 1.50, 'vegetable', true, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'jalapenos', 'Jalapeños', 1.00, 'vegetable', true, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'topping', 'pineapple', 'Pineapple', 1.50, 'vegetable', true, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Products - Pizzas
INSERT INTO "Products" (id, name, description, price, category, ingredients, sizes, "isAvailable", "preparationTime", "nutritionalInfo", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'Margherita Supreme', 'Fresh mozzarella, basil, premium tomatoes', 24.00, 'pizza', ARRAY['Fresh Mozzarella', 'Premium Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil'], '[{"name":"Small","price":20.00},{"name":"Medium","price":24.00},{"name":"Large","price":28.00}]'::jsonb, true, 15, '{"calories":280,"protein":14,"carbs":32,"fat":12}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Pepperoni Classic', 'Premium pepperoni, mozzarella', 22.00, 'pizza', ARRAY['Premium Pepperoni', 'Mozzarella', 'Tomato Sauce'], '[{"name":"Small","price":18.00},{"name":"Medium","price":22.00},{"name":"Large","price":26.00}]'::jsonb, true, 18, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Meat Lovers', 'Pepperoni, sausage, bacon, ham', 28.00, 'pizza', ARRAY['Pepperoni', 'Italian Sausage', 'Bacon', 'Ham', 'Mozzarella'], '[{"name":"Small","price":24.00},{"name":"Medium","price":28.00},{"name":"Large","price":32.00}]'::jsonb, true, 22, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Veggie Delight', 'Fresh vegetables, herbs, cheese', 26.00, 'pizza', ARRAY['Bell Peppers', 'Mushrooms', 'Red Onions', 'Olives', 'Tomatoes', 'Fresh Herbs', 'Mozzarella'], '[{"name":"Small","price":22.00},{"name":"Medium","price":26.00},{"name":"Large","price":30.00}]'::jsonb, true, 20, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Pineapple Pizza', 'Ham, pineapple, mozzarella', 25.00, 'pizza', ARRAY['Ham', 'Fresh Pineapple', 'Mozzarella', 'Tomato Sauce'], '[{"name":"Small","price":21.00},{"name":"Medium","price":25.00},{"name":"Large","price":29.00}]'::jsonb, true, 18, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Teriyaki Delight', 'Japanese teriyaki chicken, fresh vegetables', 27.00, 'pizza', ARRAY['Teriyaki Chicken', 'Bell Peppers', 'Red Onions', 'Pineapple', 'Mozzarella', 'Teriyaki Sauce'], '[{"name":"Small","price":23.00},{"name":"Medium","price":27.00},{"name":"Large","price":31.00}]'::jsonb, true, 20, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Okonomiyaki Fusion', 'Traditional Japanese flavors on pizza', 26.00, 'pizza', ARRAY['Cabbage', 'Bacon', 'Bonito Flakes', 'Okonomiyaki Sauce', 'Japanese Mayo', 'Mozzarella'], '[{"name":"Small","price":22.00},{"name":"Medium","price":26.00},{"name":"Large","price":30.00}]'::jsonb, true, 22, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'BBQ Chicken Supreme', 'Grilled chicken, BBQ sauce, red onions, cilantro', 25.00, 'pizza', ARRAY['Grilled Chicken', 'BBQ Sauce', 'Red Onions', 'Cilantro', 'Mozzarella'], '[{"name":"Small","price":21.00},{"name":"Medium","price":25.00},{"name":"Large","price":29.00}]'::jsonb, true, 20, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Mediterranean Delight', 'Feta cheese, olives, sun-dried tomatoes, spinach', 24.00, 'pizza', ARRAY['Feta Cheese', 'Kalamata Olives', 'Sun-dried Tomatoes', 'Fresh Spinach', 'Mozzarella'], '[{"name":"Small","price":20.00},{"name":"Medium","price":24.00},{"name":"Large","price":28.00}]'::jsonb, true, 18, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Spicy Italian', 'Spicy salami, jalapeños, hot peppers, chili oil', 26.00, 'pizza', ARRAY['Spicy Salami', 'Jalapeños', 'Hot Peppers', 'Chili Oil', 'Mozzarella'], '[{"name":"Small","price":22.00},{"name":"Medium","price":26.00},{"name":"Large","price":30.00}]'::jsonb, true, 19, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Four Cheese Classic', 'Mozzarella, parmesan, gorgonzola, ricotta', 23.00, 'pizza', ARRAY['Mozzarella', 'Parmesan', 'Gorgonzola', 'Ricotta', 'White Sauce'], '[{"name":"Small","price":19.00},{"name":"Medium","price":23.00},{"name":"Large","price":27.00}]'::jsonb, true, 16, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Mushroom Truffle', 'Mixed mushrooms, truffle oil, arugula, parmesan', 29.00, 'pizza', ARRAY['Mixed Mushrooms', 'Truffle Oil', 'Fresh Arugula', 'Parmesan', 'Mozzarella'], '[{"name":"Small","price":25.00},{"name":"Medium","price":29.00},{"name":"Large","price":33.00}]'::jsonb, true, 20, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Prosciutto & Fig', 'Prosciutto, fresh figs, goat cheese, honey drizzle', 30.00, 'pizza', ARRAY['Prosciutto', 'Fresh Figs', 'Goat Cheese', 'Honey', 'Arugula', 'Mozzarella'], '[{"name":"Small","price":26.00},{"name":"Medium","price":30.00},{"name":"Large","price":34.00}]'::jsonb, true, 18, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Buffalo Chicken', 'Buffalo chicken, blue cheese, celery, ranch drizzle', 26.00, 'pizza', ARRAY['Buffalo Chicken', 'Blue Cheese', 'Celery', 'Ranch Sauce', 'Mozzarella'], '[{"name":"Small","price":22.00},{"name":"Medium","price":26.00},{"name":"Large","price":30.00}]'::jsonb, true, 20, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Seafood Special', 'Shrimp, calamari, garlic, white wine sauce', 32.00, 'pizza', ARRAY['Shrimp', 'Calamari', 'Garlic', 'White Wine Sauce', 'Fresh Herbs', 'Mozzarella'], '[{"name":"Small","price":28.00},{"name":"Medium","price":32.00},{"name":"Large","price":36.00}]'::jsonb, true, 25, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Products - Sides
INSERT INTO "Products" (id, name, description, price, category, ingredients, sizes, "isAvailable", "preparationTime", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'Garlic Bread', 'Fresh baked bread with garlic butter and herbs', 6.99, 'side', ARRAY['Bread', 'Garlic', 'Butter', 'Herbs'], '[{"name":"Regular","price":6.99}]'::jsonb, true, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Caesar Salad', 'Crisp romaine lettuce with Caesar dressing and croutons', 8.99, 'side', ARRAY['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'], '[{"name":"Regular","price":8.99}]'::jsonb, true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Buffalo Wings', 'Crispy chicken wings with buffalo sauce and blue cheese dip', 12.99, 'side', ARRAY['Chicken Wings', 'Buffalo Sauce', 'Blue Cheese', 'Celery'], '[{"name":"6 pieces","price":9.99},{"name":"12 pieces","price":12.99},{"name":"18 pieces","price":18.99}]'::jsonb, true, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Mozzarella Sticks', 'Golden fried mozzarella sticks with marinara sauce', 8.99, 'side', ARRAY['Mozzarella', 'Breadcrumbs', 'Marinara Sauce'], '[{"name":"6 pieces","price":8.99},{"name":"12 pieces","price":15.99}]'::jsonb, true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Loaded Nachos', 'Tortilla chips with cheese, jalapeños, sour cream, and guacamole', 11.99, 'side', ARRAY['Tortilla Chips', 'Cheese', 'Jalapeños', 'Sour Cream', 'Guacamole'], '[{"name":"Regular","price":11.99},{"name":"Large","price":16.99}]'::jsonb, true, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Chocolate Chip Cookie', 'Freshly baked chocolate chip cookie', 2.99, 'side', ARRAY['Flour', 'Chocolate Chips', 'Butter', 'Sugar'], '[{"name":"1 cookie","price":2.99},{"name":"3 cookies","price":7.99},{"name":"6 cookies","price":14.99}]'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Products - Drinks
INSERT INTO "Products" (id, name, description, price, category, ingredients, sizes, "isAvailable", "preparationTime", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'Coca Cola', 'Classic Coca Cola soft drink', 2.99, 'drink', ARRAY['Coca Cola'], '[{"name":"Small","price":2.99},{"name":"Medium","price":3.49},{"name":"Large","price":3.99}]'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'drink', ARRAY['Fresh Oranges'], '[{"name":"Small","price":3.99},{"name":"Medium","price":4.99},{"name":"Large","price":5.99}]'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Craft Beer', 'Local craft beer selection', 5.99, 'drink', ARRAY['Craft Beer'], '[{"name":"Bottle","price":5.99},{"name":"Pint","price":7.99}]'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Italian Soda', 'Sparkling water with Italian syrup flavors', 3.99, 'drink', ARRAY['Sparkling Water', 'Italian Syrup'], '[{"name":"Regular","price":3.99}]'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Iced Tea', 'Refreshing iced tea with lemon', 2.99, 'drink', ARRAY['Tea', 'Ice', 'Lemon'], '[{"name":"Small","price":2.99},{"name":"Medium","price":3.49},{"name":"Large","price":3.99}]'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Products - Desserts
INSERT INTO "Products" (id, name, description, price, category, ingredients, sizes, "isAvailable", "preparationTime", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'Chocolate Brownie', 'Rich chocolate brownie with vanilla ice cream', 5.99, 'dessert', ARRAY['Chocolate', 'Flour', 'Sugar', 'Vanilla Ice Cream'], '[{"name":"Regular","price":5.99}]'::jsonb, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Tiramisu', 'Classic Italian tiramisu with coffee and mascarpone', 7.99, 'dessert', ARRAY['Ladyfingers', 'Coffee', 'Mascarpone', 'Cocoa'], '[{"name":"Regular","price":7.99}]'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Gelato Trio', 'Three scoops of artisan gelato - vanilla, chocolate, strawberry', 6.99, 'dessert', ARRAY['Vanilla Gelato', 'Chocolate Gelato', 'Strawberry Gelato'], '[{"name":"3 scoops","price":6.99},{"name":"5 scoops","price":9.99}]'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Cannoli', 'Traditional Sicilian cannoli with ricotta filling', 4.99, 'dessert', ARRAY['Cannoli Shell', 'Ricotta', 'Chocolate Chips', 'Powdered Sugar'], '[{"name":"2 pieces","price":4.99},{"name":"4 pieces","price":8.99}]'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Cheesecake', 'New York style cheesecake with berry compote', 6.99, 'dessert', ARRAY['Cream Cheese', 'Graham Cracker Crust', 'Berry Compote'], '[{"name":"Regular","price":6.99}]'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Products - Deals
INSERT INTO "Products" (id, name, description, price, category, ingredients, sizes, "isAvailable", "preparationTime", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'Family Pizza Deal', '2 Large pizzas + 4 drinks + garlic bread', 49.99, 'deal', ARRAY['2 Large Pizzas', '4 Drinks', 'Garlic Bread'], '[{"name":"Family Pack","price":49.99}]'::jsonb, true, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Lunch Special', 'Small pizza + drink + side', 15.99, 'deal', ARRAY['Small Pizza', 'Drink', 'Side'], '[{"name":"Lunch Deal","price":15.99}]'::jsonb, true, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Date Night Package', 'Large pizza + 2 drinks + dessert to share', 34.99, 'deal', ARRAY['Large Pizza', '2 Drinks', 'Shared Dessert'], '[{"name":"Date Night","price":34.99}]'::jsonb, true, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Party Platter', '3 Large pizzas + 12 wings + 6 drinks', 79.99, 'deal', ARRAY['3 Large Pizzas', '12 Wings', '6 Drinks'], '[{"name":"Party Pack","price":79.99}]'::jsonb, true, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Student Special', 'Medium pizza + drink + cookie', 18.99, 'deal', ARRAY['Medium Pizza', 'Drink', 'Cookie'], '[{"name":"Student Deal","price":18.99}]'::jsonb, true, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Promotions
INSERT INTO "Promotions" (id, code, description, "discountType", amount, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'SAVE10', 'Get 10% off your entire order.', 'percentage', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), '5OFF', 'Get $5 off your order of $25 or more.', 'fixed', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Content Blocks
INSERT INTO "ContentBlocks" (slug, title, type, content, "createdAt", "updatedAt") VALUES
('homepage-welcome-title', 'Homepage Welcome Title', 'text', 'Welcome to Komorebi Pizza!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('homepage-welcome-subtitle', 'Homepage Welcome Subtitle', 'text', 'Handcrafted pizzas made with love and the freshest ingredients.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('about-us-main', 'About Us Main', 'html', '<p>Founded in 2023, Komorebi Pizza started with a simple dream: to bring authentic, delicious pizza to our community. We believe in quality, from our hand-stretched dough to our locally-sourced toppings.</p>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('footer-copyright', 'Footer Copyright', 'text', '2023 Komorebi Pizza. All rights reserved.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('footer-contact', 'Footer Contact', 'text', '123 Main St, Pizza City, PC 12345 | Phone: +1234567890 | Email: info@komorebi.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Note: User passwords need to be hashed with bcrypt before inserting
-- You can use the Node.js seeder (npm run seed) to properly hash passwords
-- Or manually hash them using bcrypt with salt rounds 10
