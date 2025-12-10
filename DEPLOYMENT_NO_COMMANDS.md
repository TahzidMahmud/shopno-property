# Deployment Guide - No Terminal Commands Required

This guide is for deploying to shared hosting where you **cannot run terminal commands**. Everything can be done via cPanel File Manager and phpMyAdmin.

## Pre-Deployment (Do This Locally)

### ⚠️ IMPORTANT: Build Assets First!

**You MUST build the assets before uploading, otherwise you'll get a "Vite manifest not found" error.**

### 1. Build Production Assets

```bash
npm install
npm run build
```

This creates the `public/build/` directory with:
- `manifest.json` (REQUIRED - Laravel needs this file)
- `assets/` folder with all compiled JavaScript and CSS

**Verify the build:**
- Check that `public/build/manifest.json` exists
- Check that `public/build/assets/` folder has files

### 2. Install Production Dependencies

```bash
composer install --optimize-autoloader --no-dev
```

This installs only production dependencies.

### 3. Prepare Files for Upload

**Files to EXCLUDE when uploading:**
- `.env` (you'll create this on server)
- `.git/` folder
- `node_modules/` folder
- `storage/logs/*` (but keep the `storage/logs` directory structure)

**Files to INCLUDE:**
- Everything else, including:
  - `public/build/` (built assets)
  - `vendor/` (Composer dependencies)
  - `database/sql/install.sql` (database setup file)

## Upload to Server

1. **Via cPanel File Manager:**
   - Log in to cPanel
   - Go to File Manager
   - Navigate to your domain root (usually `public_html`)
   - Upload all files (except those listed above)

2. **Via FTP:**
   - Connect via FTP client
   - Upload all files to domain root

## Setup Steps (All via Web Interface)

### Step 1: Create Database

1. In cPanel, go to **MySQL Databases**
2. Create a new database (e.g., `shopno_property`)
3. Create a database user
4. Assign the user to the database with ALL PRIVILEGES
5. Note down: database name, username, password

### Step 2: Import Database

1. In cPanel, go to **phpMyAdmin**
2. Select your database from the left sidebar
3. Click the **Import** tab
4. Click **Choose File** and select: `database/sql/install.sql`
5. Click **Go** to import
6. Wait for "Import has been successfully finished" message

**Note:** The SQL file includes a default admin user:
- Email: `admin@shopnoproperty.com`
- Password: `admin123`

### Step 3: Run Web Setup

1. Visit: `https://yourdomain.com/setup.php`
2. Follow the setup wizard:
   - **Step 1:** Enter database credentials and app URL
   - **Step 2:** Set up storage directory
   - **Step 3:** Database is already set up (skip or create additional admin user)
   - **Step 4:** Complete!

### Step 4: Delete Setup File

**IMPORTANT:** After setup is complete, delete `setup.php` for security:
- Via cPanel File Manager: Right-click → Delete
- Or via FTP: Delete the file

## Storage Management

### Initial Setup

The setup script automatically creates `public/storage/` and copies files.

### After Uploading Files via Admin Panel

When you upload new files through the admin dashboard:

1. Visit: `https://yourdomain.com/storage-sync.php`
2. Click "Sync Storage Files"
3. This copies files from `storage/app/public/` to `public/storage/`

**Alternative:** You can manually copy files via cPanel File Manager:
- From: `storage/app/public/uploads/`
- To: `public/storage/uploads/`

## File Permissions

Set these via cPanel File Manager (right-click → Change Permissions):

- `storage/` → **755**
- `bootstrap/cache/` → **755**
- `public/storage/` → **755**
- `.env` → **644**

## Testing

1. Visit homepage: `https://yourdomain.com`
2. Test admin login: `https://yourdomain.com/admin/login`
   - Email: `admin@shopnoproperty.com`
   - Password: `admin123`

## Troubleshooting

### Images Not Loading

1. Visit `https://yourdomain.com/storage-sync.php` and sync files
2. Check that `public/storage/` directory exists
3. Verify file permissions (755 for directories)

### 500 Internal Server Error

1. Check `.env` file exists and has correct values
2. Verify database credentials in `.env`
3. Check file permissions
4. Look at error logs in cPanel → Error Log

### Routes Not Working

1. Verify `.htaccess` file exists in `public/` directory
2. Check Apache `mod_rewrite` is enabled (contact hosting support)

### Assets Not Loading / Vite Manifest Error

**Error:** `Vite manifest not found at: /public/build/manifest.json`

**Solution:**
1. On your local machine, run: `npm run build`
2. Upload the entire `public/build/` folder to your server
3. Verify `public/build/manifest.json` exists on the server
4. Clear browser cache

**Quick Check:**
- `public/build/manifest.json` must exist
- `public/build/assets/` folder must have files

## Security Checklist

- [ ] `.env` file has correct permissions (644)
- [ ] `setup.php` is deleted after setup
- [ ] `storage-sync.php` is protected or deleted (optional)
- [ ] Default admin password is changed
- [ ] SSL certificate is installed (HTTPS)

## Maintenance

### After Uploading New Files

Run the storage sync:
- Visit: `https://yourdomain.com/storage-sync.php`
- Click "Sync Storage Files"

### Updating the Application

1. Upload new files (excluding `.env` and `storage/`)
2. Rebuild assets locally: `npm run build`
3. Upload new `public/build/` folder
4. If database changes: Import new SQL or run migrations via web interface

## Quick Reference

- **Setup Wizard:** `https://yourdomain.com/setup.php`
- **Storage Sync:** `https://yourdomain.com/storage-sync.php`
- **Admin Login:** `https://yourdomain.com/admin/login`
- **Default Admin:** `admin@shopnoproperty.com` / `admin123`

