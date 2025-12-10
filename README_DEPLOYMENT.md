# Deployment to Shared Hosting

This application is configured to work on shared hosting with cPanel and Apache2.

## Quick Start

1. **Build assets locally:**
   ```bash
   npm install
   npm run build
   ```

2. **Install production dependencies:**
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

3. **Upload files to server** (exclude `.env`, `node_modules/`, `.git/`)

4. **On the server:**
   - Create `.env` file with your configuration
   - Run `php artisan key:generate`
   - Run `php artisan migrate --force`
   - Run `php artisan db:seed --class=AdminUserSeeder`
   - Run `php artisan storage:sync-shared-hosting` (if symlinks don't work)

## Detailed Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a quick checklist.

## Storage Setup

On shared hosting, symlinks may not work. Use the sync command:

```bash
php artisan storage:sync-shared-hosting
```

This copies files from `storage/app/public/` to `public/storage/` so they're accessible via web.

**Important:** Run this command after uploading new files through the admin panel.

## Local Development

For local development, you can use symlinks:

```bash
php artisan storage:link
```

Or use the sync command:

```bash
php artisan storage:sync-shared-hosting
```

## Default Admin Credentials

- Email: `admin@shopnoproperty.com`
- Password: `admin123`

**Change this immediately after deployment!**

