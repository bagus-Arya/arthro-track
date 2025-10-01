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

    
            $table->decimal('left_mpu', 8, 4)->nullable();  
            $table->decimal('right_mpu', 8, 4)->nullable();  

            $table->decimal('piezo1', 8, 2)->nullable();  
            $table->decimal('piezo2', 8, 2)->nullable();
            $table->decimal('piezo3', 8, 2)->nullable();
            $table->decimal('piezo4', 8, 2)->nullable();
            $table->decimal('piezo5', 8, 2)->nullable();

            $table->string('param1')->nullable();
            $table->string('param2')->nullable();
            $table->string('param3')->nullable();
            $table->string('param4')->nullable();
            $table->string('param5')->nullable();
            $table->string('param6')->nullable();

            $table->decimal('oa_score', 5, 2)->nullable();
            $table->string('oa_risk_category')->nullable();

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
