# Product Images Reference

## Available Images in server/uploads/

### Pizza Images
- `/uploads/margherita-pizza.jpg` - Margherita Supreme
- `/uploads/pepperoni-pizza.webp` - Pepperoni Classic
- `/uploads/meat-lovers-pizza.jpg` - Meat Lovers
- `/uploads/veggie-pizza.jpg` - Veggie Delight
- `/uploads/pizza-1.jpg` - Generic pizza 1
- `/uploads/pizza-2.jpg` - Generic pizza 2
- `/uploads/pizza-3.jpg` - Generic pizza 3
- `/uploads/pizza-4.jpg` - Generic pizza 4
- `/uploads/pizza-5.jpg` - Generic pizza 5
- `/uploads/pizza-6.jpg` - Generic pizza 6

### Pasta Images
- `/uploads/pasta-1.jpg` - Pasta dish 1
- `/uploads/pasta-2.jpg` - Pasta dish 2
- `/uploads/pasta-3.jpg` - Pasta dish 3

### Drink Images
- `/uploads/drink-1.jpg` - Coca Cola
- `/uploads/drink-2.jpg` - Craft Beer
- `/uploads/drink-3.jpg` - Fresh Orange Juice
- `/uploads/drink-4.jpg` - Iced Tea

## How to Use These Images

### In Admin Panel
1. Go to Admin Dashboard → Products
2. Click "Add Product" or edit an existing product
3. In the "Product Image" field, paste one of the URLs above
4. Or click "Upload from device" to upload a new image
5. Save the product

### Example Product Setup

**Margherita Supreme**
- Name: Margherita Supreme
- Category: pizza
- Image: `/uploads/margherita-pizza.jpg`

**Coca Cola**
- Name: Coca Cola
- Category: drinks
- Image: `/uploads/drink-1.jpg`

**Spaghetti Carbonara**
- Name: Spaghetti Carbonara
- Category: pasta
- Image: `/uploads/pasta-1.jpg`

## Image Display Fix

The CSS has been updated to use `object-fit: contain` instead of `object-fit: cover`. This ensures:
- Drink images (which are often tall/portrait) display fully without being cropped
- Pizza images (which are often square) display properly
- All images are centered within their containers
- No distortion or stretching

## Testing
After assigning images to products:
1. Navigate to the Menu page
2. Check that all product images display correctly
3. Verify drink images are not cropped or oversized
4. Confirm images load without errors in browser console
