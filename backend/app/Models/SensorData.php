<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'left_weight',
        'right_weight',
        'left_mpu',
        'right_mpu',
        'piezo1',
        'piezo2',
        'piezo3',
        'piezo4',
        'piezo5',
      ];
      protected $casts = [
        'left_mpu' => 'array',  
        'right_mpu' => 'array',
        'left_weight' => 'decimal:2',
        'right_weight' => 'decimal:2',
        'piezo1' => 'decimal:2',
        'piezo2' => 'decimal:2',
        'piezo3' => 'decimal:2',
        'piezo4' => 'decimal:2',
        'piezo5' => 'decimal:2',
      ];
 
      public function user()
      {
          return $this->belongsTo(User::class);
      }
}
