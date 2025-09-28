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
        Schema::table('sensors', function (Blueprint $table) {
            $table->decimal('rom_knee_left', 8, 2)->nullable();
            $table->decimal('rom_knee_right', 8, 2)->nullable(); 
            $table->decimal('gait_duration', 8, 2)->nullable();  
            $table->decimal('stance_time_left', 8, 2)->nullable();
            $table->decimal('stance_time_right', 8, 2)->nullable();
            $table->decimal('weight_left', 8, 2)->nullable();   
            $table->decimal('weight_right', 8, 2)->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sensors', function (Blueprint $table) {
            $table->dropColumn([
                'rom_knee_left', 'rom_knee_right', 'gait_duration',
                'stance_time_left', 'stance_time_right', 'weight_left', 'weight_right'
            ]);
        });
    }
};
