# Image Troubleshooting Guide

## Problem: Images Not Loading After Storage Sync

If images are still broken after running the storage sync, follow these steps:

### Step 1: Run Diagnostic Check

Visit: `https://yourdomain.com/storage-check.php`

This will show you:
- Which directories exist
- File permissions
- What files are in each location
- If your specific image file exists

### Step 2: Check File Locations

Images should be in:
- **Source:** `storage/app/public/uploads/properties/main/`
- **Public:** `public/storage/uploads/properties/main/`

### Step 3: Re-run Storage Sync

1. Visit: `https://yourdomain.com/storage-sync.php`
2. Click "Sync Storage Files"
3. Check the file list to see what was copied
4. Verify your image file is in the list

### Step 4: Verify File Permissions

Via cPanel File Manager:
- Right-click `public/storage/` → Change Permissions → Set to **755**
- Right-click `public/storage/uploads/` → Change Permissions → Set to **755**
- Right-click individual image files → Change Permissions → Set to **644**

### Step 5: Check .htaccess

Make sure these files exist and have correct content:

**`public/storage/.htaccess`:**
```
Options -Indexes +FollowSymLinks
<IfModule mod_rewrite.c>
    RewriteEngine Off
</IfModule>
```

**`public/.htaccess`:**
Should allow access to storage directory (already configured)

### Step 6: Test Direct Access

Try accessing the image directly:
`https://yourdomain.com/storage/uploads/properties/main/693467bbc11f5.webp`

If you get:
- **404 Not Found** → File doesn't exist in `public/storage/`
- **403 Forbidden** → Permission issue
- **500 Error** → .htaccess problem

### Step 7: Manual File Check

Via cPanel File Manager:
1. Navigate to `public/storage/uploads/properties/main/`
2. Check if your image file exists
3. If not, navigate to `storage/app/public/uploads/properties/main/`
4. Copy the file manually to `public/storage/uploads/properties/main/`

### Common Issues

**Issue: Files not copying**
- Check file permissions on `storage/app/public/` (should be 755)
- Check disk space on server
- Check PHP error logs

**Issue: 403 Forbidden**
- Set `public/storage/` permissions to 755
- Check `.htaccess` in `public/storage/` doesn't block access

**Issue: 404 Not Found**
- File doesn't exist in `public/storage/`
- Re-run storage sync
- Or manually copy files

**Issue: Images load in admin but not on frontend**
- Check browser console for errors
- Verify image paths are `/storage/...` not `/storage/app/public/...`
- Clear browser cache

### Quick Fix Script

If storage sync isn't working, you can manually copy files via cPanel:

1. Go to File Manager
2. Navigate to `storage/app/public/uploads/`
3. Select all files/folders
4. Click "Copy"
5. Navigate to `public/storage/`
6. Click "Paste"

This will copy all files manually.

