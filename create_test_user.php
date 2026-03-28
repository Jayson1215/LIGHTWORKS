<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$app = app();

// Clear old user
User::where('email', 'admin@light.com')->delete();

// Create new user
$user = User::create([
    'name' => 'Admin User',
    'email' => 'admin@light.com',
    'password' => Hash::make('12345678'),
    'email_verified_at' => now(),
    'role' => 'customer'
]);

echo "✓ User created successfully!\n";
echo "Email: admin@light.com\n";
echo "Password: 12345678\n";
