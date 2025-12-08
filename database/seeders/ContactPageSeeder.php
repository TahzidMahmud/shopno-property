<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactPageSetting;
use App\Models\ContactPageKeyTransport;

class ContactPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Contact Page Settings
        $settings = [
            'hero_title' => 'Contact Us',
            'hero_background_image' => null, // Can be set via admin
            'section_title' => 'Get In Touch',
            'form_heading' => 'Enquiry',
            'form_description' => 'Wish to get a call back from our team? Fill in your details.',
            'form_email' => 'contact@example.com',
            'address' => 'Rupayan Taj, 1, 1/1 Naya Paltan, Suite L - 5 (5th Floor), Culvert Road, Dhaka,',
            'phone' => '+8801844-646633',
            'email' => 'info.shopnoproperty@gmail.com',
            'map_address' => '46B Matheswartala Road, Tejgaon, Dhaka Bangladesh',
            'map_latitude' => '23.7639',
            'map_longitude' => '90.3889',
        ];

        foreach ($settings as $key => $value) {
            ContactPageSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Key Transports
        $keyTransports = [
            [
                'name' => 'Supermarket',
                'icon' => 'store',
                'distance' => '200m',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Airport',
                'icon' => 'airplane',
                'distance' => '2,790m',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Hospital',
                'icon' => 'hospital',
                'distance' => '500m',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'State Bank',
                'icon' => 'bank',
                'distance' => '190m',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'University',
                'icon' => 'school',
                'distance' => '250m',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Railway Station',
                'icon' => 'train',
                'distance' => '1,800m',
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($keyTransports as $transport) {
            ContactPageKeyTransport::updateOrCreate(
                [
                    'name' => $transport['name'],
                    'icon' => $transport['icon'],
                ],
                $transport
            );
        }
    }
}
