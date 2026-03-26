# Image Upload and Display Fix

## Problem
Uploaded product images were not displaying on the menu and product cards despite successful upload.

## Root Cause
The upload endpoint was returning absolute URLs (e.g., `http://localhost:5000/uploads/filename.jpg`) instead of relative URLs. This caused issues with the React proxy configuration.

## Changes Made

### 1. Backend - Static File Serving (`server/server.js`)
- **Added**: `path` module import
- **Fixed**: Static file serving to use absolute path
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 2. Backend - Upload Endpoint (`server/routes/uploadRoutes.js`)
- **Changed**: Upload endpoint now returns relative URLs instead of absolute URLs
- **Before**: `http://localhost:5000/uploads/filename.jpg`
- **After**: `/uploads/filename.jpg`

This works with React's proxy configuration (`"proxy": "http://localhost:5000"` in `client/package.json`)

### 3. Frontend - Admin Products (`client/src/pages/admin/AdminProducts.js`)
- **Added**: Image preview below the upload button
- Shows the current product image when editing

### 4. Frontend - Menu Component (`client/src/pages/Menu.js`)
- **Added**: Console logging to debug image URLs
- Logs all product images when menu loads

## How Image Upload Works Now

1. **Admin uploads image** → File sent to `/api/upload/image`
2. **Backend saves file** → Stored in `server/uploads/` directory
3. **Backend returns URL** → Relative path `/uploads/filename.jpg`
4. **Frontend saves URL** → Stored in product's `image` field in database
5. **Frontend displays** → React proxy forwards `/uploads/*` requests to backend

## Testing Instructions

### 1. Start the Application
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

### 2. Test Image Upload
1. Login as admin (admin@komorebi.com / admin123)
2. Navigate to Admin Dashboard → Products
3. Click "Add Product" or edit an existing product
4. In the Product Image section:
   - Click "Upload from device" button
   - Select an image file
   - Wait for "Image uploaded successfully!" toast
   - You should see the image preview below the upload button
5. Fill in other required fields and save

### 3. Verify Image Display
1. Navigate to Menu page
2. Check browser console for logs:
   - "Menu products loaded: [...]"
   - "Product [name] image: /uploads/[filename]"
3. Product cards should display the uploaded images
4. If images don't appear, check:
   - Browser Network tab for 404 errors on `/uploads/*` requests
   - Browser Console for CORS errors
   - Backend console for file serving logs

### 4. Check Existing Uploaded Images
The `server/uploads/` directory contains:
- `ChatGPT Image Oct 29, 2025, 02_42_18 AM-1774327397145-299177010.png`
- `d81001d7-f252-464e-a254-01f3a1354bb1-1774327343379-466623896.png`

These should be accessible at:
- `http://localhost:3000/uploads/ChatGPT Image Oct 29, 2025, 02_42_18 AM-1774327397145-299177010.png`
- `http://localhost:3000/uploads/d81001d7-f252-464e-a254-01f3a1354bb1-1774327343379-466623896.png`

## Troubleshooting

### Images Still Not Showing
1. **Check Network Tab**: Look for 404 errors on image requests
2. **Check Console**: Look for CORS or loading errors
3. **Verify Proxy**: Ensure `client/package.json` has `"proxy": "http://localhost:5000"`
4. **Check File Permissions**: Ensure `server/uploads/` directory is readable
5. **Restart Servers**: Sometimes React proxy needs a restart

### Upload Fails
1. **Check File Size**: Max 5MB limit
2. **Check File Type**: Only image files allowed
3. **Check Backend Logs**: Look for multer errors
4. **Check Network Tab**: Look for failed POST to `/api/upload/image`

## Next Steps
- Remove console.log statements from `Menu.js` after confirming images work
- Consider adding image optimization/resizing
- Consider adding image deletion functionality
- Add loading states for image uploads
