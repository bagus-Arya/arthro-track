<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SensorDataController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'left_weight' => 'required|numeric|min:0|max:200',  // kg limit
            'right_weight' => 'required|numeric|min:0|max:200',
            'left_mpu' => 'required|json',  // Validate as JSON string
            'right_mpu' => 'required|json',
            'piezo1' => 'required|numeric|min:0|max:1000',  // Arbitrary units
            'piezo2' => 'required|numeric|min:0|max:1000',
            'piezo3' => 'required|numeric|min:0|max:1000',
            'piezo4' => 'required|numeric|min:0|max:1000',
            'piezo5' => 'required|numeric|min:0|max:1000',
        ]);
        
        $leftMpu = json_decode($validated['left_mpu'], true);
        $rightMpu = json_decode($validated['right_mpu'], true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($leftMpu) || !is_array($rightMpu)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid MPU data format. Use JSON object (e.g., {"accel_x": 0.1}).'
            ], 422);
        }
        
        $sensorData = SensorData::create([
            'user_id' => Auth::id(),
            'left_weight' => $validated['left_weight'],
            'right_weight' => $validated['right_weight'],
            'left_mpu' => $leftMpu,  // Stored as JSON in DB
            'right_mpu' => $rightMpu,
            'piezo1' => $validated['piezo1'],
            'piezo2' => $validated['piezo2'],
            'piezo3' => $validated['piezo3'],
            'piezo4' => $validated['piezo4'],
            'piezo5' => $validated['piezo5'],
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Sensor data stored successfully',
            'data' => $sensorData->only(['id', 'left_weight', 'right_weight', 'left_mpu', 'right_mpu', 'piezo1', 'piezo2', 'piezo3', 'piezo4', 'piezo5', 'created_at'])
        ], 201);
    }
    
    public function index()
    {
        $sensorData = Auth::user()->sensorData()->latest()->limit(10)->get();
        
        return response()->json([
            'success' => true,
            'data' => $sensorData->map(function ($item) {
                return [
                    'id' => $item->id,
                    'left_weight' => $item->left_weight,
                    'right_weight' => $item->right_weight,
                    'left_mpu' => $item->left_mpu,
                    'right_mpu' => $item->right_mpu,
                    'piezo1' => $item->piezo1,
                    'piezo2' => $item->piezo2,
                    'piezo3' => $item->piezo3,
                    'piezo4' => $item->piezo4,
                    'piezo5' => $item->piezo5,
                    'created_at' => $item->created_at,
                ];
            })
        ]);
    }
}    