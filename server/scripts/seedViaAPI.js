const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// You'll need to login as admin first to get a token
// Replace this with actual admin credentials
const ADMIN_EMAIL = 'admin@komorebi.com';
const ADMIN_PASSWORD = 'admin123';

let authToken = '';

const login = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    authToken = response.data.token;
    console.log('✓ Logged in as admin');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    console.log('\nPlease update ADMIN_EMAIL and ADMIN_PASSWORD in this script with valid admin credentials.');
    return false;
  }
};

const seedCategories = async () => {
  const categories = [
    { name: 'pizza', displayName: 'Pizzas', description: 'Delicious wood-fired pizzas', sortOrder: 1 },
    { name: 'drink', displayName: 'Drinks', description: 'Refreshing beverages', sortOrder: 2 },
    { name: 'side', displayName: 'Sides', description: 'Appetizers and sides', sortOrder: 3 },
    { name: 'dessert', displayName: 'Desserts', description: 'Sweet treats', sortOrder: 4 },
    { name: 'deal', displayName: 'Deals', description: 'Special offers', sortOrder: 5 }
  ];

  console.log('\nSeeding categories...');
  for (const category of categories) {
    try {
      await axios.post(`${API_URL}/categories`, category, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`  ✓ Created: ${category.displayName}`);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log(`  - Exists: ${category.displayName}`);
      } else {
        console.log(`  ✗ Failed: ${category.displayName} - ${error.response?.data?.message || error.message}`);
      }
    }
  }
};

const seedIngredients = async () => {
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

  console.log('\nSeeding ingredients...');
  for (const ingredient of ingredients) {
    try {
      await axios.post(`${API_URL}/products/customization-options`, ingredient, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`  ✓ Created: ${ingredient.displayName} (${ingredient.optionType})`);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`  - Exists: ${ingredient.displayName}`);
      } else {
        console.log(`  ✗ Failed: ${ingredient.displayName} - ${error.response?.data?.message || error.message}`);
      }
    }
  }
};

const main = async () => {
  console.log('🌱 Seeding database via API...\n');
  console.log('Backend URL:', API_URL);
  
  // Check if server is running
  try {
    await axios.get(`${API_URL}/health`);
  } catch (error) {
    console.error('❌ Backend server is not running!');
    console.log('Please start the backend server first:');
    console.log('  cd server && npm start\n');
    process.exit(1);
  }

  const loggedIn = await login();
  if (!loggedIn) {
    process.exit(1);
  }

  await seedCategories();
  await seedIngredients();

  console.log('\n✅ Seeding completed!');
  console.log('   - 5 categories');
  console.log('   - 29 ingredients/customization options\n');
};

main();
