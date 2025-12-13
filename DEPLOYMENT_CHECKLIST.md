# Quick Deployment Checklist for Shared Hosting

## Pre-Deployment (Local)

- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run build` to build production assets
- [ ] Run `composer install --optimize-autoloader --no-dev` for production dependencies
- [ ] Test the application locally with `php artisan serve`
- [ ] Verify all images and assets load correctly

## Upload to Server

- [ ] Upload all files to server (via FTP/cPanel File Manager)
- [ ] **DO NOT** upload: `.env`, `node_modules/`, `.git/`
- [ ] Ensure `.htaccess` files are uploaded

## Server Configuration

- [ ] Create `.env` file on server with production settings
- [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
- [ ] Configure database credentials in `.env`
- [ ] Run `php artisan key:generate` to generate APP_KEY
- [ ] Run `php artisan migrate --force` to set up database
- [ ] Run `php artisan db:seed --class=AdminUserSeeder` to create admin user

## Storage Setup

- [ ] Create `public/storage` directory
- [ ] Run `php artisan storage:link` (if symlinks work) OR
- [ ] Run `php artisan storage:sync-shared-hosting` (if symlinks don't work)
- [ ] Verify `public/storage/.htaccess` exists
- [ ] Copy existing files from `storage/app/public/` to `public/storage/` if needed

## File Permissions

- [ ] Set `storage/` directory to 755
- [ ] Set `bootstrap/cache/` directory to 755
- [ ] Set `public/storage/` directory to 755
- [ ] Set `.env` file to 644

## Testing

- [ ] Visit homepage - should load without errors
- [ ] Test admin login at `/admin/login`
- [ ] Verify images load correctly (check a property detail page)
- [ ] Test file upload in admin panel
- [ ] Verify API endpoints work (check browser console)

## Post-Deployment

- [ ] Change default admin password
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure cron job for scheduled tasks (if needed)
- [ ] Monitor error logs in `storage/logs/laravel.log`

## Troubleshooting Quick Fixes

**Images not loading:**
```bash
php artisan storage:sync-shared-hosting
```

**500 Error:**
- Check `.env` file exists and has correct values
- Check file permissions
- Check `storage/logs/laravel.log` for errors

**Routes not working:**
- Verify `.htaccess` in `public/` directory
- Check Apache `mod_rewrite` is enabled

**Assets not loading:**
- Verify `public/build/` directory exists with built files
- Clear browser cache
- Rebuild assets: `npm run build` (locally, then upload `public/build/`)


