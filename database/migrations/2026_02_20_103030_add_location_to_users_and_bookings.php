<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('address')->nullable()->after('phone');
            $table->decimal('latitude', 10, 7)->nullable()->after('address');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->string('location_address')->nullable()->after('customer_phone');
            $table->decimal('location_lat', 10, 7)->nullable()->after('location_address');
            $table->decimal('location_lng', 10, 7)->nullable()->after('location_lat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['address', 'latitude', 'longitude']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['location_address', 'location_lat', 'location_lng']);
        });
    }
};
