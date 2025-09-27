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
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');  
            $table->decimal('left_weight', 8, 2)->nullable();  
            $table->decimal('right_weight', 8, 2)->nullable();  
            $table->json('left_mpu')->nullable(); 
            $table->json('right_mpu')->nullable();  
            $table->decimal('piezo1', 6, 2)->nullable();  
            $table->decimal('piezo2', 6, 2)->nullable();
            $table->decimal('piezo3', 6, 2)->nullable();
            $table->decimal('piezo4', 6, 2)->nullable();
            $table->decimal('piezo5', 6, 2)->nullable();
            $table->timestamps();  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_data');
    }
};
