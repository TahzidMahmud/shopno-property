# Shopno Property - Upload & Serve Ready

This Laravel + React application is configured for **upload-and-serve** deployment on shared hosting with **NO terminal commands required**.

## Quick Deployment

### 1. Pre-Build (Local - One Time)

```bash
npm install
npm run build
composer install --optimize-autoloader --no-dev
```

### 2. Upload to Server

Upload all files to your shared hosting (via cPanel File Manager or FTP).

**Exclude:** `.env`, `.git/`, `node_modules/`

### 3. Setup via Web Interface

1. **Create database** in cPanel → MySQL Databases
2. **Import SQL:** phpMyAdmin → Import → `database/sql/install.sql`
3. **Run setup:** Visit `https://yourdomain.com/setup.php`
4. **Delete setup.php** after completion (security)

## Documentation

- **[DEPLOYMENT_NO_COMMANDS.md](./DEPLOYMENT_NO_COMMANDS.md)** - Complete step-by-step guide (no terminal commands)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Full deployment guide (with terminal commands)
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Quick checklist

## Key Features

✅ **Web-based setup wizard** - No terminal access needed  
✅ **SQL import file** - Database setup via phpMyAdmin  
✅ **Web-based storage sync** - File management via browser  
✅ **Pre-built assets** - Just upload and serve  
✅ **Apache-ready** - Configured .htaccess files  

## Default Admin Credentials

- Email: `admin@shopnoproperty.com`
- Password: `admin123`

**⚠️ Change this immediately after setup!**

## Storage Management

After uploading files via admin panel, sync storage:
- Visit: `https://yourdomain.com/storage-sync.php`
- Click "Sync Storage Files"

## Support

For deployment issues, see the troubleshooting section in `DEPLOYMENT_NO_COMMANDS.md`.
