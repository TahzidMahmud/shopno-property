<?php
/**
 * Fix Permissions Script
 * 
 * This script attempts to fix file permissions for storage directories
 * Access it via: https://yourdomain.com/fix-permissions.php
 * 
 * WARNING: This may not work on all shared hosting. Use cPanel File Manager if this fails.
 */

$storagePath = __DIR__ . '/../storage/app/public';
$publicStoragePath = __DIR__ . '/storage';

$results = [];

function fixPermissions($path, $dirPerms = 0755, $filePerms = 0644) {
    $results = [];
    
    if (!file_exists($path)) {
        return ['errors' => ["Path does not exist: {$path}"]];
    }
    
    if (is_dir($path)) {
        // Fix directory permissions
        if (@chmod($path, $dirPerms)) {
            $results['success'][] = "Fixed permissions on directory: {$path}";
        } else {
            $results['errors'][] = "Failed to fix permissions on directory: {$path}";
        }
        
        // Recursively fix permissions
        $items = scandir($path);
        foreach ($items as $item) {
            if ($item == '.' || $item == '..') continue;
            
            $itemPath = $path . '/' . $item;
            $subResults = fixPermissions($itemPath, $dirPerms, $filePerms);
            
            if (isset($subResults['success'])) {
                $results['success'] = array_merge($results['success'] ?? [], $subResults['success']);
            }
            if (isset($subResults['errors'])) {
                $results['errors'] = array_merge($results['errors'] ?? [], $subResults['errors']);
            }
        }
    } else {
        // Fix file permissions
        if (@chmod($path, $filePerms)) {
            $results['success'][] = "Fixed permissions on file: {$path}";
        } else {
            $results['errors'][] = "Failed to fix permissions on file: {$path}";
        }
    }
    
    return $results;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['fix'])) {
    // Fix source directory
    if (is_dir($storagePath)) {
        $sourceResults = fixPermissions($storagePath);
        $results = array_merge_recursive($results, $sourceResults);
    }
    
    // Fix destination directory
    if (is_dir($publicStoragePath)) {
        $destResults = fixPermissions($publicStoragePath);
        $results = array_merge_recursive($results, $destResults);
    } else {
        // Create if doesn't exist
        if (@mkdir($publicStoragePath, 0755, true)) {
            $results['success'][] = "Created directory: {$publicStoragePath}";
            $destResults = fixPermissions($publicStoragePath);
            $results = array_merge_recursive($results, $destResults);
        } else {
            $results['errors'][] = "Failed to create directory: {$publicStoragePath}";
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Fix Permissions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
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
        .message {
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .success {
            background: #d4edda;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .btn:hover { background: #5568d3; }
        .code {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Fix Storage Permissions</h1>
        
        <div class="warning">
            <strong>⚠️ Note:</strong> This script attempts to fix permissions automatically. 
            If it doesn't work, you'll need to set permissions manually via cPanel File Manager.
        </div>
        
        <?php if (count($results) > 0): ?>
            <?php if (isset($results['success']) && count($results['success']) > 0): ?>
                <div class="message success">
                    <strong>✓ Success:</strong><br>
                    <?= implode('<br>', array_slice($results['success'], 0, 20)) ?>
                    <?php if (count($results['success']) > 20): ?>
                        <br>... and <?= count($results['success']) - 20 ?> more
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
            <?php if (isset($results['errors']) && count($results['errors']) > 0): ?>
                <div class="message error">
                    <strong>✗ Errors:</strong><br>
                    <?= implode('<br>', array_slice($results['errors'], 0, 20)) ?>
                    <?php if (count($results['errors']) > 20): ?>
                        <br>... and <?= count($results['errors']) - 20 ?> more
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        <?php endif; ?>
        
        <h2>Manual Instructions</h2>
        <p>If the automatic fix doesn't work, set permissions manually:</p>
        <ol>
            <li>Go to <strong>cPanel → File Manager</strong></li>
            <li>Navigate to <code>storage/app/public/</code></li>
            <li>Right-click → <strong>Change Permissions</strong></li>
            <li>Set to <strong>755</strong> (check: Read, Write, Execute for Owner; Read, Execute for Group and Public)</li>
            <li>Click <strong>Change Permissions</strong></li>
            <li>Repeat for <code>public/storage/</code></li>
        </ol>
        
        <form method="POST">
            <button type="submit" name="fix" class="btn">Attempt to Fix Permissions</button>
        </form>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
            <strong>Note:</strong> For security, consider deleting this file after use.
        </p>
    </div>
</body>
</html>


