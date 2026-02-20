<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Service;
use App\Models\Portfolio;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin User ──
        $admin = User::create([
            'name' => 'Jayson Velasco',
            'email' => 'admin@light.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '+63 912 345 6789',
        ]);

        // ── Test Customer ──
        $customer = User::create([
            'name' => 'Maria Santos',
            'email' => 'customer@light.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+63 998 765 4321',
        ]);

        // ── Categories ──
        $portrait = Category::create([
            'name' => 'Portrait Photography',
            'slug' => 'portrait-photography',
            'description' => 'Professional portrait sessions capturing your personality and essence in every frame.',
        ]);

        $wedding = Category::create([
            'name' => 'Wedding Photography',
            'slug' => 'wedding-photography',
            'description' => 'Complete wedding coverage from pre-nuptial shoots to the grand reception.',
        ]);

        $events = Category::create([
            'name' => 'Events & Corporate',
            'slug' => 'events-corporate',
            'description' => 'Professional event documentation for corporate gatherings, parties, and celebrations.',
        ]);

        $product = Category::create([
            'name' => 'Product Photography',
            'slug' => 'product-photography',
            'description' => 'High-quality product images for e-commerce, catalogs, and marketing materials.',
        ]);

        $maternity = Category::create([
            'name' => 'Maternity & Newborn',
            'slug' => 'maternity-newborn',
            'description' => 'Tender moments captured during pregnancy and first days of your newborn.',
        ]);

        // ── Services ──
        $services = [];

        $services[] = Service::create([
            'category_id' => $portrait->id,
            'name' => 'Classic Portrait Session',
            'slug' => 'classic-portrait-session',
            'description' => 'A 1-hour indoor portrait session with professional lighting and backdrop options. Perfect for headshots, family portraits, or personal branding photos.',
            'price' => 3500,
            'duration_hours' => 1,
            'inclusions' => ['1-hour studio session', '2 outfit changes', '10 edited digital photos', 'Online gallery access', '1 printed 8x10 photo'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $portrait->id,
            'name' => 'Premium Portrait Package',
            'slug' => 'premium-portrait-package',
            'description' => 'Our most popular portrait package with outdoor and indoor options, multiple looks, and extensive editing.',
            'price' => 7500,
            'duration_hours' => 3,
            'inclusions' => ['3-hour session (indoor + outdoor)', '4 outfit changes', '30 edited digital photos', 'Hair & makeup coordination', 'Photo album (20 pages)', 'Online gallery'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $wedding->id,
            'name' => 'Pre-Nuptial Shoot',
            'slug' => 'pre-nuptial-shoot',
            'description' => 'A beautiful pre-wedding photo session at a location of your choice with creative direction and styling consultation.',
            'price' => 15000,
            'duration_hours' => 4,
            'inclusions' => ['4-hour on-location shoot', 'Creative direction', '50 edited digital photos', 'Engagement photo album', 'Save-the-date design', '2 photographers'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $wedding->id,
            'name' => 'Full Wedding Coverage',
            'slug' => 'full-wedding-coverage',
            'description' => 'Comprehensive wedding day coverage from preparation to reception. Relive every precious moment.',
            'price' => 45000,
            'duration_hours' => 12,
            'inclusions' => ['Full-day coverage (12 hours)', '3 photographers', '500+ edited photos', 'Premium wedding album (40 pages)', 'Same-day edit video teaser', 'Online gallery', 'USB drive with all files', 'Pre-wedding consultation'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $events->id,
            'name' => 'Corporate Event Coverage',
            'slug' => 'corporate-event-coverage',
            'description' => 'Professional documentation of your corporate event including conferences, seminars, and team building activities.',
            'price' => 12000,
            'duration_hours' => 5,
            'inclusions' => ['5-hour event coverage', '2 photographers', '100 edited photos', 'Same-day social media photos', 'Online gallery', 'Commercial usage rights'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $events->id,
            'name' => 'Birthday & Party Package',
            'slug' => 'birthday-party-package',
            'description' => 'Fun and candid coverage of your birthday celebration or private party.',
            'price' => 8000,
            'duration_hours' => 4,
            'inclusions' => ['4-hour coverage', '1 photographer', '80 edited photos', 'Photo booth setup option', 'Online gallery', 'Printed photo collage'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $product->id,
            'name' => 'Product Photo Bundle',
            'slug' => 'product-photo-bundle',
            'description' => 'Clean, professional product photos on white or styled backgrounds. Ideal for online stores and catalogs.',
            'price' => 5000,
            'duration_hours' => 2,
            'inclusions' => ['Up to 15 products', 'White background shots', '3 angles per product', 'Basic retouching', 'High-res digital files', 'Web-optimized versions'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $maternity->id,
            'name' => 'Maternity Session',
            'slug' => 'maternity-session',
            'description' => 'A gentle and artistic maternity session celebrating the beauty of motherhood.',
            'price' => 6000,
            'duration_hours' => 2,
            'inclusions' => ['2-hour studio session', '3 outfit/look changes', '20 edited digital photos', 'Partner/family inclusion', '2 printed 8x10 photos', 'Online gallery'],
            'is_available' => true,
        ]);

        $services[] = Service::create([
            'category_id' => $maternity->id,
            'name' => 'Newborn Photography',
            'slug' => 'newborn-photography',
            'description' => 'Adorable newborn portraits with props and creative setups in our climate-controlled studio.',
            'price' => 8500,
            'duration_hours' => 3,
            'inclusions' => ['3-hour studio session', 'Props & accessories provided', '25 edited digital photos', 'Family/sibling shots included', 'Mini photo album', 'Online gallery'],
            'is_available' => true,
        ]);

        // ── Portfolio Items ──
        $portfolioItems = [
            ['category_id' => $portrait->id, 'title' => 'Sunset Golden Hour Portrait', 'description' => 'Natural light portrait session during golden hour at Rizal Park.', 'featured' => true],
            ['category_id' => $portrait->id, 'title' => 'Corporate Headshots', 'description' => 'Professional headshots for a tech startup team.', 'featured' => false],
            ['category_id' => $portrait->id, 'title' => 'Family Reunion Portraits', 'description' => 'Multi-generational family portrait in our studio.', 'featured' => true],
            ['category_id' => $wedding->id, 'title' => 'Beach Pre-Nuptial', 'description' => 'Romantic pre-nuptial shoot at La Union beach.', 'featured' => true],
            ['category_id' => $wedding->id, 'title' => 'Church Wedding - Garcia & Reyes', 'description' => 'Full day wedding coverage at San Agustin Church.', 'featured' => true],
            ['category_id' => $wedding->id, 'title' => 'Garden Wedding Reception', 'description' => 'Intimate garden wedding with 100 guests.', 'featured' => false],
            ['category_id' => $events->id, 'title' => 'Annual Tech Conference 2024', 'description' => 'Full coverage of a 2-day technology conference.', 'featured' => true],
            ['category_id' => $events->id, 'title' => 'Debut Celebration', 'description' => "Cinematic coverage of Sofia's 18th birthday celebration.", 'featured' => false],
            ['category_id' => $product->id, 'title' => 'Artisan Coffee Collection', 'description' => 'Product photography for a premium local coffee brand.', 'featured' => true],
            ['category_id' => $product->id, 'title' => 'Handcrafted Jewelry Line', 'description' => 'Detailed macro shots of handmade silver jewelry.', 'featured' => false],
            ['category_id' => $maternity->id, 'title' => 'Expecting Baby Luna', 'description' => 'Dreamy maternity session with flower crown and flowing dress.', 'featured' => true],
            ['category_id' => $maternity->id, 'title' => 'Baby Aiden - 7 Days Old', 'description' => 'Sweet newborn session with custom props and wraps.', 'featured' => true],
        ];

        foreach ($portfolioItems as $item) {
            Portfolio::create($item);
        }

        // ── Sample Bookings ──
        $booking1 = Booking::create([
            'booking_reference' => 'LIGHT-' . strtoupper(Str::random(8)),
            'user_id' => $customer->id,
            'service_id' => $services[0]->id,
            'booking_date' => now()->addDays(7)->format('Y-m-d'),
            'booking_time' => '10:00',
            'customer_name' => $customer->name,
            'customer_email' => $customer->email,
            'customer_phone' => $customer->phone,
            'special_requests' => 'I would like a clean white background for headshots.',
            'subtotal' => 3500,
            'tax' => 420,
            'discount' => 0,
            'total' => 3920,
            'status' => 'confirmed',
            'payment_method' => 'online',
        ]);

        Payment::create([
            'booking_id' => $booking1->id,
            'transaction_id' => 'TXN-' . strtoupper(Str::random(10)),
            'amount' => 3920,
            'method' => 'online',
            'status' => 'paid',
            'notes' => 'Payment received via GCash.',
        ]);

        $booking2 = Booking::create([
            'booking_reference' => 'LIGHT-' . strtoupper(Str::random(8)),
            'user_id' => $customer->id,
            'service_id' => $services[3]->id,
            'booking_date' => now()->addDays(30)->format('Y-m-d'),
            'booking_time' => '08:00',
            'customer_name' => 'Maria Santos',
            'customer_email' => 'customer@light.com',
            'customer_phone' => '+63 998 765 4321',
            'special_requests' => 'Full wedding at San Fernando Church, reception at Villa Escudero.',
            'subtotal' => 45000,
            'tax' => 5400,
            'discount' => 0,
            'total' => 50400,
            'status' => 'pending',
            'payment_method' => 'online',
        ]);

        Payment::create([
            'booking_id' => $booking2->id,
            'transaction_id' => 'TXN-' . strtoupper(Str::random(10)),
            'amount' => 50400,
            'method' => 'online',
            'status' => 'pending',
            'notes' => 'Awaiting bank transfer confirmation.',
        ]);

        $booking3 = Booking::create([
            'booking_reference' => 'LIGHT-' . strtoupper(Str::random(8)),
            'user_id' => $customer->id,
            'service_id' => $services[7]->id,
            'booking_date' => now()->addDays(14)->format('Y-m-d'),
            'booking_time' => '14:00',
            'customer_name' => 'Maria Santos',
            'customer_email' => 'customer@light.com',
            'customer_phone' => '+63 998 765 4321',
            'special_requests' => 'Partner will join for some shots. Prefer soft, dreamy editing style.',
            'subtotal' => 6000,
            'tax' => 720,
            'discount' => 0,
            'total' => 6720,
            'status' => 'confirmed',
            'payment_method' => 'online',
        ]);

        Payment::create([
            'booking_id' => $booking3->id,
            'transaction_id' => 'TXN-' . strtoupper(Str::random(10)),
            'amount' => 6720,
            'method' => 'online',
            'status' => 'paid',
        ]);

        echo "Database seeded successfully!\n";
        echo "Admin: admin@light.com / password\n";
        echo "Customer: customer@light.com / password\n";
    }
}
