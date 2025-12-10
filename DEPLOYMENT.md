# Deployment Guide for Shared Hosting (cPanel)

This guide will help you deploy the Shopno Property application to a shared hosting environment with cPanel and Apache2.

## Prerequisites

- Access to cPanel
- PHP 8.1 or higher
- Composer installed (or use cPanel's Composer)
- Node.js and npm (for building assets locally or on server)
- MySQL database

## Step 1: Prepare Your Local Environment

1. **Build the production assets:**
   ```bash
   npm install
   npm run build
   ```

2. **Optimize for production:**
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

3. **Clear and cache configuration:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## Step 2: Upload Files to Shared Hosting

### Option A: Using cPanel File Manager

1. Log in to your cPanel
2. Navigate to **File Manager**
3. Go to your domain's root directory (usually `public_html` or `www`)
4. Upload all files **EXCEPT**:
   - `.env` (you'll create this on the server)
   - `node_modules/` folder
   - `.git/` folder
   - `storage/logs/*` (but keep the `storage/logs` directory)

### Option B: Using FTP/SFTP

1. Connect to your server via FTP/SFTP
2. Upload all files to your domain's root directory
3. Exclude the same files as mentioned above

## Step 3: Set Up Directory Structure

On shared hosting, you typically need to point your domain to the `public` folder. There are two approaches:

### Approach 1: Point Domain to Public Folder (Recommended)

1. In cPanel, go to **File Manager**
2. Navigate to your domain's root (e.g., `public_html`)
3. Upload all Laravel files here
4. Move the contents of the `public` folder to the root
5. Move all other folders one level up (outside public_html)

**Structure should be:**
```
/home/username/
├── public_html/          (This is your domain root)
│   ├── index.php
│   ├── .htaccess
│   ├── assets/
│   ├── build/
│   └── storage/          (symlink or copy)
├── app/
├── bootstrap/
├── config/
├── database/
├── resources/
├── routes/
├── storage/
└── vendor/
```

### Approach 2: Use .htaccess Redirect (Alternative)

If you can't change the document root, use the `.htaccess` file in the root to redirect to the `public` folder.

## Step 4: Configure Environment

1. In cPanel File Manager, create a `.env` file in your root directory
2. Copy from `.env.example` and update:

```env
APP_NAME="Shopno Property"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# File Storage
FILESYSTEM_DISK=public
```

3. Generate application key:
   ```bash
   php artisan key:generate
   ```

## Step 5: Set Up Database

1. In cPanel, go to **MySQL Databases**
2. Create a new database
3. Create a database user and assign it to the database
4. Update your `.env` file with the database credentials
5. Run migrations:
   ```bash
   php artisan migrate --force
   php artisan db:seed --class=AdminUserSeeder
   ```

## Step 6: Set Up Storage

On shared hosting, symlinks may not work. Use one of these methods:

### Method 1: Use Artisan Command (Recommended)

Laravel includes a command to sync storage files:

```bash
php artisan storage:sync-shared-hosting
```

This command will:
- Create `public/storage` directory if it doesn't exist
- Copy all files from `storage/app/public/` to `public/storage/`
- Set up proper `.htaccess` files
- Sync files efficiently (only copies new/changed files)

### Method 2: Create Symlink (if supported)

If your hosting supports symlinks:

```bash
php artisan storage:link
```

### Method 3: Manual Setup Script

Run the standalone setup script:
```bash
php setup-storage-shared-hosting.php
```

### Method 4: Manual FTP Copy

1. Copy all files from `storage/app/public/` to `public/storage/`
2. Maintain the same directory structure
3. Ensure `.htaccess` file exists in `public/storage/`

**Important:** After uploading new files via the admin panel, run the sync command again:

```bash
php artisan storage:sync-shared-hosting
```

Or set up a cron job to run it periodically.

## Step 7: Set File Permissions

Set proper permissions via cPanel File Manager or SSH:

```bash
chmod -R 755 storage bootstrap/cache
chmod -R 755 public/storage
chmod 644 .env
```

If you have SSH access:
```bash
chown -R username:username storage bootstrap/cache
```

## Step 8: Configure Apache (if needed)

The `.htaccess` files are already configured, but verify:

1. **public/.htaccess** - Should handle routing and static files
2. **public/storage/.htaccess** - Should allow access to storage files

## Step 9: Test the Application

1. Visit your domain: `https://yourdomain.com`
2. Test admin login: `https://yourdomain.com/admin/login`
   - Email: `admin@shopnoproperty.com`
   - Password: `admin123`

## Step 10: Set Up Cron Job (Optional)

For scheduled tasks, set up a cron job in cPanel:

1. Go to **Cron Jobs** in cPanel
2. Add a new cron job:
   ```
   * * * * * cd /home/username/public_html && php artisan schedule:run >> /dev/null 2>&1
   ```

## Troubleshooting

### Images Not Loading

1. Check that `public/storage` directory exists and has files
2. Verify `.htaccess` in `public/storage/` allows access
3. Check file permissions (should be 755 for directories, 644 for files)
4. Run the storage setup script again

### 500 Internal Server Error

1. Check `.env` file exists and has correct values
2. Verify `APP_KEY` is set
3. Check file permissions
4. Review error logs in `storage/logs/laravel.log`

### Routes Not Working

1. Verify `.htaccess` file exists in `public/` directory
2. Check that `mod_rewrite` is enabled on Apache
3. Ensure `AllowOverride All` is set in Apache config (contact hosting support)

### Assets Not Loading

1. Verify `npm run build` was run and `public/build/` exists
2. Check that Vite manifest is generated
3. Clear browser cache

## Maintenance

### After Uploading New Files

If you upload files through the admin panel, copy them to public storage:

```bash
php setup-storage-shared-hosting.php
```

Or manually via FTP:
- Copy from: `storage/app/public/uploads/`
- Copy to: `public/storage/uploads/`

### Updating the Application

1. Upload new files (excluding `.env` and `storage/`)
2. Run migrations if needed: `php artisan migrate --force`
3. Clear caches: `php artisan cache:clear && php artisan config:clear`
4. Rebuild assets: `npm run build` (locally, then upload `public/build/`)

## Security Checklist

- [ ] `APP_DEBUG=false` in production
- [ ] Strong database passwords
- [ ] `.env` file has correct permissions (644)
- [ ] Storage directory permissions are correct
- [ ] SSL certificate installed (HTTPS)
- [ ] Admin password changed from default

## Support

For issues specific to shared hosting, contact your hosting provider's support team.

