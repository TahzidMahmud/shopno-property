<?php
/**
 * Storage Check Script
 * 
 * This script helps diagnose storage issues
 * Access it via: https://yourdomain.com/storage-check.php
 */

$storagePath = __DIR__ . '/../storage/app/public';
$publicStoragePath = __DIR__ . '/storage';

function checkPath($path, $label) {
    $exists = file_exists($path);
    $isDir = is_dir($path);
    $isReadable = $exists ? is_readable($path) : false;
    $perms = $exists ? substr(sprintf('%o', fileperms($path)), -4) : 'N/A';
    
    return [
        'label' => $label,
        'path' => $path,
        'exists' => $exists,
        'isDir' => $isDir,
        'isReadable' => $isReadable,
        'perms' => $perms,
    ];
}

function listFiles($dir, $maxDepth = 3, $currentDepth = 0) {
    $files = [];
    if ($currentDepth >= $maxDepth || !is_dir($dir) || !is_readable($dir)) {
        return $files;
    }
    
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item == '.' || $item == '..') continue;
        
        $path = $dir . '/' . $item;
        if (is_dir($path)) {
            $files[$item] = [
                'type' => 'directory',
                'path' => $path,
                'children' => listFiles($path, $maxDepth, $currentDepth + 1)
            ];
        } else {
            $files[$item] = [
                'type' => 'file',
                'path' => $path,
                'size' => filesize($path),
            ];
        }
    }
    return $files;
}

$checks = [
    checkPath($storagePath, 'Storage Source (storage/app/public)'),
    checkPath($publicStoragePath, 'Public Storage (public/storage)'),
    checkPath($storagePath . '/uploads', 'Uploads Source'),
    checkPath($publicStoragePath . '/uploads', 'Uploads Public'),
];

$storageFiles = is_dir($storagePath) ? listFiles($storagePath, 2) : [];
$publicFiles = is_dir($publicStoragePath) ? listFiles($publicStoragePath, 2) : [];

function renderFiles($files, $prefix = '') {
    $html = '<ul style="margin: 5px 0; padding-left: 20px;">';
    foreach ($files as $name => $info) {
        $icon = $info['type'] === 'directory' ? '📁' : '📄';
        $size = isset($info['size']) ? ' (' . number_format($info['size'] / 1024, 2) . ' KB)' : '';
        $html .= "<li>{$icon} <strong>{$name}</strong>{$size}";
        if (isset($info['children']) && count($info['children']) > 0) {
            $html .= renderFiles($info['children'], $prefix . $name . '/');
        }
        $html .= '</li>';
    }
    $html .= '</ul>';
    return $html;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Storage Check</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 20px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .status-ok { color: #28a745; font-weight: bold; }
        .status-error { color: #dc3545; font-weight: bold; }
        .code {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 12px;
        }
        h2 { margin-top: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Storage Diagnostic Check</h1>
        
        <h2>Path Checks</h2>
        <table>
            <tr>
                <th>Location</th>
                <th>Path</th>
                <th>Exists</th>
                <th>Is Directory</th>
                <th>Readable</th>
                <th>Permissions</th>
            </tr>
            <?php foreach ($checks as $check): ?>
            <tr>
                <td><strong><?= htmlspecialchars($check['label']) ?></strong></td>
                <td><code><?= htmlspecialchars($check['path']) ?></code></td>
                <td class="<?= $check['exists'] ? 'status-ok' : 'status-error' ?>">
                    <?= $check['exists'] ? '✓ Yes' : '✗ No' ?>
                </td>
                <td class="<?= $check['isDir'] ? 'status-ok' : 'status-error' ?>">
                    <?= $check['isDir'] ? '✓ Yes' : '✗ No' ?>
                </td>
                <td class="<?= $check['isReadable'] ? 'status-ok' : 'status-error' ?>">
                    <?= $check['isReadable'] ? '✓ Yes' : '✗ No' ?>
                </td>
                <td><code><?= $check['perms'] ?></code></td>
            </tr>
            <?php endforeach; ?>
        </table>
        
        <h2>Files in Storage Source</h2>
        <?php if (count($storageFiles) > 0): ?>
            <?= renderFiles($storageFiles) ?>
        <?php else: ?>
            <p class="status-error">No files found in storage source directory.</p>
        <?php endif; ?>
        
        <h2>Files in Public Storage</h2>
        <?php if (count($publicFiles) > 0): ?>
            <?= renderFiles($publicFiles) ?>
        <?php else: ?>
            <p class="status-error">No files found in public storage directory.</p>
        <?php endif; ?>
        
        <h2>Test Image Path</h2>
        <p>Test if an image is accessible:</p>
        <p><code>/storage/uploads/properties/main/693467bbc11f5.webp</code></p>
        <?php
        $testPath = $publicStoragePath . '/uploads/properties/main/693467bbc11f5.webp';
        if (file_exists($testPath)) {
            echo '<p class="status-ok">✓ File exists at: ' . htmlspecialchars($testPath) . '</p>';
            echo '<p>File size: ' . number_format(filesize($testPath) / 1024, 2) . ' KB</p>';
        } else {
            echo '<p class="status-error">✗ File NOT found at: ' . htmlspecialchars($testPath) . '</p>';
            echo '<p>Checking alternative locations...</p>';
            $altPaths = [
                $storagePath . '/uploads/properties/main/693467bbc11f5.webp',
                $publicStoragePath . '/uploads/properties/main/693467bbc11f5.webp',
            ];
            foreach ($altPaths as $altPath) {
                if (file_exists($altPath)) {
                    echo '<p class="status-ok">✓ Found at: ' . htmlspecialchars($altPath) . '</p>';
                }
            }
        }
        ?>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
            <strong>Note:</strong> For security, consider deleting this file after diagnosis.
        </p>
    </div>
</body>
</html>

