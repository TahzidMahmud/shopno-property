<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image; // Requires composer require intervention/image
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Handles the upload and conversion of a single file to WebP (if an image).
     *
     * @param UploadedFile $file The uploaded file instance.
     * @param string $path The storage path segment (e.g., 'uploads/properties/main').
     * @return string The storage relative path to the saved file.
     * @throws \Exception If the directory cannot be created.
     */
    public function uploadFile(UploadedFile $file, string $path): string
    {
        $mimeType = $file->getClientMimeType();

        // 1. Ensure destination directory exists in storage
        $storagePath = $path;
        if (!Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->makeDirectory($storagePath);
        }

        // 2. Handle Image Conversion (WebP)
        if (str_starts_with($mimeType, 'image/')) {
            $filename = uniqid() . '.webp';
            $fullStoragePath = $storagePath . '/' . $filename;

            // Use Intervention Image to read, encode to webp (quality 80), and save
            $image = Image::make($file->getRealPath())
                ->encode('webp', 80);
            
            // Save to storage - get the encoded image as string
            Storage::disk('public')->put($fullStoragePath, (string) $image);

            return $fullStoragePath;
        }

        // 3. Handle Non-Image Files (e.g., videos)
        $filename = uniqid() . '.' . $file->extension();
        $fullStoragePath = $storagePath . '/' . $filename;
        
        // Store file in storage
        Storage::disk('public')->putFileAs($storagePath, $file, $filename);

        return $fullStoragePath;
    }

    /**
     * Handles the upload of multiple files (e.g., gallery images).
     *
     * @param array $files Array of UploadedFile instances.
     * @param string $path The public path segment.
     * @return array An array of public relative paths to the saved files.
     */
    public function uploadMultipleFiles(array $files, string $path): array
    {
        return array_map(fn(UploadedFile $file) => $this->uploadFile($file, $path), $files);
    }
}
