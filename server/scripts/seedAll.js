const { Category, CustomizationOption } = require('../models');
const { Sequelize } = require('sequelize');

// Explicit database configuration
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false
});

const seedAll = async () => {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    console.log('Host: localhost:5432');
    console.log('Database: postgres');
    console.log('User: postgres');
    
    await sequelize.authenticate();
    console.log('✓ Database connected successfully');

    // Seed Categories
    const categories = [
      { name: 'pizza', displayName: 'Pizzas', description: 'Delicious wood-fired pizzas', sortOrder: 1 },
      { name: 'drink', displayName: 'Drinks', description: 'Refreshing beverages', sortOrder: 2 },
      { name: 'side', displayName: 'Sides', description: 'Appetizers and sides', sortOrder: 3 },
      { name: 'dessert', displayName: 'Desserts', description: 'Sweet treats', sortOrder: 4 },
      { name: 'deal', displayName: 'Deals', description: 'Special offers', sortOrder: 5 }
    ];

    console.log('Seeding categories...');
    for (const category of categories) {
      await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }
    console.log('✓ Categories seeded');

    // Seed Ingredients/Customization Options
    const ingredients = [
      // Crusts
      { optionType: 'crust', name: 'regular', displayName: 'Regular Crust', priceModifier: 0, isAvailable: true, sortOrder: 1 },
      { optionType: 'crust', name: 'thin', displayName: 'Thin & Crispy', priceModifier: 0, isAvailable: true, sortOrder: 2 },
      { optionType: 'crust', name: 'thick', displayName: 'Thick Crust', priceModifier: 2.00, isAvailable: true, sortOrder: 3 },
      { optionType: 'crust', name: 'stuffed', displayName: 'Stuffed Crust', priceModifier: 3.50, isAvailable: true, sortOrder: 4 },
      
      // Sauces
      { optionType: 'sauce', name: 'tomato', displayName: 'Tomato Sauce', priceModifier: 0, isAvailable: true, sortOrder: 1 },
      { optionType: 'sauce', name: 'bbq', displayName: 'BBQ Sauce', priceModifier: 0.50, isAvailable: true, sortOrder: 2 },
      { optionType: 'sauce', name: 'pesto', displayName: 'Pesto Sauce', priceModifier: 1.00, isAvailable: true, sortOrder: 3 },
      { optionType: 'sauce', name: 'garlic', displayName: 'Garlic Sauce', priceModifier: 0.50, isAvailable: true, sortOrder: 4 },
      
      // Cheese
      { optionType: 'cheese', name: 'mozzarella', displayName: 'Mozzarella', priceModifier: 0, isAvailable: true, sortOrder: 1 },
      { optionType: 'cheese', name: 'cheddar', displayName: 'Cheddar', priceModifier: 1.00, isAvailable: true, sortOrder: 2 },
      { optionType: 'cheese', name: 'parmesan', displayName: 'Parmesan', priceModifier: 1.50, isAvailable: true, sortOrder: 3 },
      { optionType: 'cheese', name: 'feta', displayName: 'Feta', priceModifier: 1.50, isAvailable: true, sortOrder: 4 },
      
      // Toppings - Meats
      { optionType: 'topping', name: 'pepperoni', displayName: 'Pepperoni', priceModifier: 2.00, category: 'meat', isAvailable: true, sortOrder: 1 },
      { optionType: 'topping', name: 'ham', displayName: 'Ham', priceModifier: 2.00, category: 'meat', isAvailable: true, sortOrder: 2 },
      { optionType: 'topping', name: 'bacon', displayName: 'Bacon', priceModifier: 2.50, category: 'meat', isAvailable: true, sortOrder: 3 },
      { optionType: 'topping', name: 'chicken', displayName: 'Chicken', priceModifier: 2.50, category: 'meat', isAvailable: true, sortOrder: 4 },
      { optionType: 'topping', name: 'beef', displayName: 'Beef', priceModifier: 2.50, category: 'meat', isAvailable: true, sortOrder: 5 },
      { optionType: 'topping', name: 'sausage', displayName: 'Italian Sausage', priceModifier: 2.50, category: 'meat', isAvailable: true, sortOrder: 6 },
      
      // Toppings - Vegetables
      { optionType: 'topping', name: 'mushrooms', displayName: 'Mushrooms', priceModifier: 1.50, category: 'vegetable', isAvailable: true, sortOrder: 7 },
      { optionType: 'topping', name: 'onions', displayName: 'Onions', priceModifier: 1.00, category: 'vegetable', isAvailable: true, sortOrder: 8 },
      { optionType: 'topping', name: 'peppers', displayName: 'Bell Peppers', priceModifier: 1.50, category: 'vegetable', isAvailable: true, sortOrder: 9 },
      { optionType: 'topping', name: 'olives', displayName: 'Olives', priceModifier: 1.50, category: 'vegetable', isAvailable: true, sortOrder: 10 },
      { optionType: 'topping', name: 'tomatoes', displayName: 'Fresh Tomatoes', priceModifier: 1.00, category: 'vegetable', isAvailable: true, sortOrder: 11 },
      { optionType: 'topping', name: 'spinach', displayName: 'Spinach', priceModifier: 1.50, category: 'vegetable', isAvailable: true, sortOrder: 12 },
      { optionType: 'topping', name: 'jalapenos', displayName: 'Jalapeños', priceModifier: 1.00, category: 'vegetable', isAvailable: true, sortOrder: 13 },
      { optionType: 'topping', name: 'pineapple', displayName: 'Pineapple', priceModifier: 1.50, category: 'vegetable', isAvailable: true, sortOrder: 14 }
    ];

    console.log('Seeding ingredients...');
    for (const ingredient of ingredients) {
      const [ing, created] = await CustomizationOption.findOrCreate({
        where: { name: ingredient.name, optionType: ingredient.optionType },
        defaults: ingredient
      });
      if (created) console.log(`  + Created: ${ingredient.displayName} (${ingredient.optionType})`);
    }
    console.log('✓ Ingredients seeded');

    console.log('\n✅ All data seeded successfully!');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${ingredients.length} ingredients/customization options`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedAll();
