# Build and Upload Instructions

## Before Every Upload

**Always build assets first!** This is critical - without it, your site will show a "Vite manifest not found" error.

## Quick Steps

### 1. Build Assets

```bash
npm install          # Only needed first time or after package.json changes
npm run build        # Builds production assets
```

### 2. Verify Build

Check that these exist:
- ✅ `public/build/manifest.json`
- ✅ `public/build/assets/` folder with files

### 3. Upload to Server

Upload the **entire `public/build/` folder** to your server at:
- `public/build/` (same location)

## What Gets Built

The build process creates:
- `public/build/manifest.json` - Laravel uses this to find assets
- `public/build/assets/main-[hash].js` - Your React application
- `public/build/assets/main-[hash].css` - Your styles
- Other assets (fonts, images, etc.)

## Troubleshooting

### "Vite manifest not found" Error

**Cause:** `public/build/manifest.json` is missing

**Fix:**
1. Run `npm run build` locally
2. Upload `public/build/` folder to server
3. Make sure `manifest.json` is in `public/build/` on server

### Assets Still Not Loading

1. Check file permissions (755 for directories, 644 for files)
2. Clear browser cache (Ctrl+F5)
3. Verify `.htaccess` in `public/` allows access to `build/` directory

## Build Script (Optional)

Create a file `build.sh`:

```bash
#!/bin/bash
echo "Building assets..."
npm run build
echo "✓ Build complete!"
echo "Now upload the public/build/ folder to your server"
```

Make it executable:
```bash
chmod +x build.sh
./build.sh
```

