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
            $table->integer('age')->nullable()->after('name');
            $table->decimal('weight', 5, 2)->nullable()->after('age');  
            $table->decimal('height', 4, 2)->nullable()->after('weight');  
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('height');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['age', 'weight', 'height', 'gender']);
        });
    }
};
