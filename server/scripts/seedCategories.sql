-- Seed Categories for Komorebi Pizza
-- Run this to populate the categories table

INSERT INTO categories (id, name, "displayName", description, "sortOrder", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'pizza', 'Pizzas', 'Delicious wood-fired pizzas with fresh ingredients', 1, NOW(), NOW()),
  (gen_random_uuid(), 'drinks', 'Drinks', 'Refreshing beverages to complement your meal', 2, NOW(), NOW()),
  (gen_random_uuid(), 'sides', 'Sides', 'Tasty sides and appetizers', 3, NOW(), NOW()),
  (gen_random_uuid(), 'deals', 'Deals', 'Special combo deals and offers', 4, NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
  "displayName" = EXCLUDED."displayName",
  description = EXCLUDED.description,
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = NOW();
