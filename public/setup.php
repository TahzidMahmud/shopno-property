<?php
/**
 * Web-Based Setup Script for Shared Hosting
 * 
 * This script helps set up the application when you can't run terminal commands.
 * Access it via: https://yourdomain.com/setup.php
 * 
 * IMPORTANT: Delete this file after setup is complete for security!
 */

// Security: Only allow access if .env doesn't exist or APP_KEY is not set
$envPath = __DIR__ . '/../.env';
$envExists = file_exists($envPath);
$appKeySet = false;

if ($envExists) {
    $envContent = file_get_contents($envPath);
    $appKeySet = strpos($envContent, 'APP_KEY=base64:') !== false && 
                 strpos($envContent, 'APP_KEY=') !== false &&
                 strlen($envContent) > 20;
}

// If app is already configured, show message
if ($appKeySet) {
    die('
    <!DOCTYPE html>
    <html>
    <head>
        <title>Setup Complete</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
            .warning { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="success">
            <h2>✓ Application Already Configured</h2>
            <p>Your application appears to be already set up. If you need to reconfigure, please delete or rename the .env file first.</p>
        </div>
        <div class="warning">
            <strong>Security Note:</strong> For security, please delete this setup.php file after completing the setup.
        </div>
    </body>
    </html>
    ');
}

$step = $_GET['step'] ?? '1';
$message = '';
$error = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($step === '1') {
        // Step 1: Generate APP_KEY and create .env
        $appKey = 'base64:' . base64_encode(random_bytes(32));
        
        $envTemplate = <<<ENV
APP_NAME="Shopno Property"
APP_ENV=production
APP_KEY={$appKey}
APP_DEBUG=false
APP_URL={$_POST['app_url'] ?? 'https://yourdomain.com'}

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST={$_POST['db_host'] ?? 'localhost'}
DB_PORT=3306
DB_DATABASE={$_POST['db_database'] ?? ''}
DB_USERNAME={$_POST['db_username'] ?? ''}
DB_PASSWORD={$_POST['db_password'] ?? ''}

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
ENV;
        
        if (file_put_contents($envPath, $envTemplate)) {
            $message = '✓ .env file created successfully!';
            $step = '2';
        } else {
            $error = '✗ Failed to create .env file. Please check file permissions.';
        }
    } elseif ($step === '2') {
        // Step 2: Set up storage (now files go directly to public/storage)
        $publicStoragePath = __DIR__ . '/storage';
        
        // Create public/storage directory
        if (!is_dir($publicStoragePath)) {
            if (mkdir($publicStoragePath, 0755, true)) {
                $message = '✓ Created public/storage directory.<br>';
            } else {
                $error = '✗ Failed to create public/storage directory. Please check permissions.';
            }
        } else {
            $message = '✓ public/storage directory already exists.<br>';
        }
        
        if (empty($error)) {
            // Create .htaccess in storage
            $htaccessContent = "Options -Indexes +FollowSymLinks\n<IfModule mod_rewrite.c>\n    RewriteEngine Off\n</IfModule>\n<IfModule mod_headers.c>\n    Header set Access-Control-Allow-Origin \"*\"\n</IfModule>\n";
            file_put_contents($publicStoragePath . '/.htaccess', $htaccessContent);
            
            // Create index.php to prevent directory listing
            file_put_contents($publicStoragePath . '/index.php', "<?php\nheader('HTTP/1.0 403 Forbidden');\nexit;\n");
            
            $message .= '✓ Storage directory configured! Files will now be saved directly to public/storage/ when uploaded.';
            
            // Optional: Copy existing files from storage/app/public if they exist
            $oldStoragePath = __DIR__ . '/../storage/app/public';
            if (is_dir($oldStoragePath)) {
                $copied = copyDirectory($oldStoragePath, $publicStoragePath);
                if ($copied > 0) {
                    $message .= "<br>✓ Migrated {$copied} existing files from storage/app/public/ to public/storage/.";
                }
            }
            
            $step = '3';
        }
    } elseif ($step === '3') {
        // Step 3: Create admin user
        require __DIR__ . '/../vendor/autoload.php';
        
        $app = require_once __DIR__ . '/../bootstrap/app.php';
        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
        
        try {
            $user = \App\Models\User::firstOrCreate(
                ['email' => $_POST['admin_email'] ?? 'admin@shopnoproperty.com'],
                [
                    'name' => $_POST['admin_name'] ?? 'Admin User',
                    'password' => \Illuminate\Support\Facades\Hash::make($_POST['admin_password'] ?? 'admin123'),
                ]
            );
            
            $message = '✓ Admin user created successfully!';
            $step = '4';
        } catch (\Exception $e) {
            $error = '✗ Failed to create admin user: ' . $e->getMessage();
        }
    }
}

function copyDirectory($src, $dst) {
    $count = 0;
    if (!is_dir($dst)) {
        mkdir($dst, 0755, true);
    }
    
    if (!is_dir($src)) {
        return 0;
    }
    
    $dir = opendir($src);
    while (($file = readdir($dir)) !== false) {
        if ($file != '.' && $file != '..') {
            $srcFile = $src . '/' . $file;
            $dstFile = $dst . '/' . $file;
            if (is_dir($srcFile)) {
                $count += copyDirectory($srcFile, $dstFile);
            } else {
                if (copy($srcFile, $dstFile)) {
                    $count++;
                }
            }
        }
    }
    closedir($dir);
    return $count;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Shopno Property - Setup</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 700px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; margin-top: 0; }
        .step { margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #555;
        }
        input[type="text"],
        input[type="password"],
        input[type="email"],
        input[type="url"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
        }
        .btn:hover { background: #5568d3; }
        .message {
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .step-indicator {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        .step-indicator .step-item {
            flex: 1;
            text-align: center;
            position: relative;
        }
        .step-indicator .step-item.active {
            color: #667eea;
            font-weight: 600;
        }
        .step-indicator .step-item::after {
            content: '';
            position: absolute;
            bottom: -22px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 3px;
            background: #ddd;
        }
        .step-indicator .step-item:last-child::after {
            display: none;
        }
        .step-indicator .step-item.active::after {
            background: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Shopno Property Setup</h1>
        
        <div class="step-indicator">
            <div class="step-item <?= $step == '1' ? 'active' : '' ?>">1. Configuration</div>
            <div class="step-item <?= $step == '2' ? 'active' : '' ?>">2. Storage</div>
            <div class="step-item <?= $step == '3' ? 'active' : '' ?>">3. Admin User</div>
            <div class="step-item <?= $step == '4' ? 'active' : '' ?>">4. Complete</div>
        </div>

        <?php if ($message): ?>
            <div class="message success"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="message error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <?php if ($step == '1'): ?>
            <div class="step">
                <h2>Step 1: Application Configuration</h2>
                <p>Enter your application and database details:</p>
                <form method="POST">
                    <div class="form-group">
                        <label>Application URL</label>
                        <input type="url" name="app_url" value="<?= htmlspecialchars($_POST['app_url'] ?? 'https://' . $_SERVER['HTTP_HOST']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Database Host</label>
                        <input type="text" name="db_host" value="<?= htmlspecialchars($_POST['db_host'] ?? 'localhost') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Database Name</label>
                        <input type="text" name="db_database" value="<?= htmlspecialchars($_POST['db_database'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Database Username</label>
                        <input type="text" name="db_username" value="<?= htmlspecialchars($_POST['db_username'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Database Password</label>
                        <input type="password" name="db_password" value="<?= htmlspecialchars($_POST['db_password'] ?? '') ?>">
                    </div>
                    <button type="submit" class="btn">Continue to Step 2</button>
                </form>
            </div>
        <?php elseif ($step == '2'): ?>
            <div class="step">
                <h2>Step 2: Storage Setup</h2>
                <p>Setting up storage directory for file uploads...</p>
                <form method="POST">
                    <input type="hidden" name="step" value="2">
                    <button type="submit" class="btn">Set Up Storage</button>
                </form>
            </div>
        <?php elseif ($step == '3'): ?>
            <div class="step">
                <h2>Step 3: Database Setup</h2>
                <p><strong>Option 1: Import SQL file (Recommended)</strong></p>
                <ol>
                    <li>Go to phpMyAdmin in cPanel</li>
                    <li>Select your database</li>
                    <li>Click "Import" tab</li>
                    <li>Choose the file: <code>database/sql/install.sql</code></li>
                    <li>Click "Go" to import</li>
                </ol>
                <p style="margin-top: 20px;"><strong>Option 2: Create admin user manually</strong></p>
                <p>If you've already imported the SQL, the default admin user is already created:</p>
                <ul>
                    <li>Email: <code>admin@shopnoproperty.com</code></li>
                    <li>Password: <code>admin123</code></li>
                </ul>
                <p><strong>Or create a new admin user:</strong></p>
                <form method="POST">
                    <input type="hidden" name="step" value="3">
                    <div class="form-group">
                        <label>Admin Name</label>
                        <input type="text" name="admin_name" value="<?= htmlspecialchars($_POST['admin_name'] ?? 'Admin User') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Admin Email</label>
                        <input type="email" name="admin_email" value="<?= htmlspecialchars($_POST['admin_email'] ?? 'admin@shopnoproperty.com') ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Admin Password</label>
                        <input type="password" name="admin_password" value="<?= htmlspecialchars($_POST['admin_password'] ?? 'admin123') ?>" required>
                        <small style="color: #666;">Default: admin123 (change this after setup!)</small>
                    </div>
                    <button type="submit" class="btn">Create Admin User</button>
                </form>
            </div>
        <?php elseif ($step == '4'): ?>
            <div class="step">
                <h2>✓ Setup Complete!</h2>
                <div class="message success">
                    <p><strong>Your application is now ready to use!</strong></p>
                    <p>You can now:</p>
                    <ul>
                        <li>Visit your homepage: <a href="/">Homepage</a></li>
                        <li>Access admin dashboard: <a href="/admin/login">Admin Login</a></li>
                    </ul>
                </div>
                <div class="warning">
                    <strong>⚠️ IMPORTANT SECURITY STEP:</strong><br>
                    Please delete this setup.php file immediately for security reasons!
                </div>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>

