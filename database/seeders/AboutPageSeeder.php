<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutPageSetting;
use App\Models\AboutPageProject;
use App\Models\AboutPageTeamMember;
use App\Models\AboutPageTestimonial;

class AboutPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // About Page Settings
        $settings = [
            'hero_title' => 'About Us',
            'hero_background_image' => null, // Can be set via admin
            'vision_title' => 'Where Vision Meets Value',
            'vision_description' => 'Welcome to Shopno Property – your trusted real estate partner. We make it easy to find and secure the perfect property, whether you\'re looking for a home, land, or investment opportunity. Enjoy a seamless experience with verified listings, expert guidance, and dedicated support every step of the way.',
            'vision_image' => null, // Can be set via admin
            'award_badge' => 'Award Winning Company In The Shopno Property',
            'stat_projects' => '50+',
            'stat_customers' => '48+',
            'stat_success_rate' => '45%',
            'stat_team' => '5+',
            'projects_title' => 'Discover Our Signature Projects',
            'projects_subtitle' => 'From residential to commercial developments, each project reflects our commitment to quality and trust.',
            'team_title' => 'Our Professional Team Member',
            'chairman_name' => 'MD. Sirajul Islam',
            'chairman_position' => 'MANAGING DIRECTOR',
            'chairman_image' => null, // Can be set via admin
            'chairman_message' => 'Our mission at Shopno Property has always been to build more than just structures; we build communities and futures. It is with this commitment that we proudly present Matribhumi City, a landmark project designed to be a true sanctuary for your family near Dhaka. This project is a testament to our dedication to quality, innovation, and your trust in us. We are deeply grateful for your continued support and look forward to building a future of shared success with you.',
            'testimonials_title' => 'Hear What Our Client Say',
            'testimonials_subtitle' => 'Hear from our clients about finding their dream homes, seamless property deals.',
        ];

        foreach ($settings as $key => $value) {
            AboutPageSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Signature Projects
        $projects = [
            [
                'title' => 'Modern Office Complex',
                'subtitle' => 'New Dhaka, 11 June, 2022',
                'image' => null, // Can be set via admin
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Resort Project',
                'subtitle' => null,
                'image' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Management Project',
                'subtitle' => null,
                'image' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Luxury Design',
                'subtitle' => null,
                'image' => null,
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($projects as $project) {
            AboutPageProject::updateOrCreate(
                ['title' => $project['title']],
                $project
            );
        }

        // Team Members
        $teamMembers = [
            [
                'name' => 'Imtinan Raj',
                'position' => 'CEO',
                'image' => null, // Can be set via admin
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Mahabubur Ripon',
                'position' => 'Head Of Visual Experience',
                'image' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Shohana',
                'position' => 'Lead Developer',
                'image' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Saiful Islam Xakib',
                'position' => 'Business Operations & Strategy Manager',
                'image' => null,
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($teamMembers as $member) {
            AboutPageTeamMember::updateOrCreate(
                ['name' => $member['name']],
                $member
            );
        }

        // Testimonials
        $testimonials = [
            [
                'quote' => 'Partnering with AFMS was the best decision for our properties. Their professional team, responsive service, and attention to detail consistently exceed expectations. Highly recommended for facility management!',
                'author_name' => 'Jessica Wright',
                'author_position' => 'Facility Director',
                'author_company' => 'Skyline Properties',
                'rating' => 5,
                'image' => null, // Can be set via admin
                'order' => 1,
                'is_active' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            AboutPageTestimonial::updateOrCreate(
                ['author_name' => $testimonial['author_name']],
                $testimonial
            );
        }
    }
}
