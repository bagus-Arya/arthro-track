<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
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
      'param1',
      'param2',
      'param3',
      'param4',
      'param5',
      'param6',
      'oa_score',
      'oa_risk_category',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
