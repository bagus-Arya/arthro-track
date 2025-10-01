<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SensorData;

class SensorDataController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'left_weight' => 'required|numeric',
            'right_weight' => 'required|numeric',
            'left_mpu' => 'required|numeric',
            'right_mpu' => 'required|numeric',
            'piezo1' => 'required|integer',
            'piezo2' => 'required|integer',
            'piezo3' => 'required|integer',
            'piezo4' => 'required|integer',
            'piezo5' => 'required|integer',
        ]);

        // Calculate OA parameters 
        $param1 = $this->calculateFlexionAngleCategory($validated);
        $param2 = $this->calculateLeftRightAsymmetryCategory($validated);
        $param3 = $this->calculateStepSpeedCategory($validated);
        $param4 = $this->calculateParameter4Category($validated);
        $param5 = $this->calculateParameter5Category($validated);
        $param6 = $this->calculateParameter6Category($validated);

        // Map OA categories to points
        $pointsMap = [
            'Non-OA' => 0,
            'OA Rendah' => 5.56,
            'OA Sedang' => 11.11,
            'OA Tinggi' => 16.67,
        ];

        // Sum points from all 6 parameters
        $params = [$param1, $param2, $param3, $param4, $param5, $param6];
        $totalPoints = 0;
        foreach ($params as $p) {
            $totalPoints += $pointsMap[$p] ?? 0;
        }

        // Classify final OA risk category based on total points
        if ($totalPoints == 0) {
            $riskCategory = 'Non OA';
        } elseif ($totalPoints <= 33) {
            $riskCategory = 'Risiko Rendah';
        } elseif ($totalPoints <= 66) {
            $riskCategory = 'Risiko Sedang';
        } else {
            $riskCategory = 'Risiko Tinggi';
        }

        // Store sensor data + calculated OA parameters and risk info
        $sensorData = SensorData::create(array_merge($validated, [
            'param1' => $param1,
            'param2' => $param2,
            'param3' => $param3,
            'param4' => $param4,
            'param5' => $param5,
            'param6' => $param6,
            'oa_score' => $totalPoints,
            'oa_risk_category' => $riskCategory,
        ]));

        return response()->json([
            'success' => true,
            'oa_score' => $totalPoints,
            'oa_risk_category' => $riskCategory,
            'data' => $sensorData,
        ], 201);
    }

    // Example calculation functions for OA parameters
    private function calculateFlexionAngleCategory($data)
    {
        // Example: use left_mpu as proxy for flexion angle
        $val = $data['left_mpu'];
        if ($val < 0.5) return 'Non-OA';
        if ($val < 1.0) return 'OA Rendah';
        if ($val < 1.5) return 'OA Sedang';
        return 'OA Tinggi';
    }

    private function calculateLeftRightAsymmetryCategory($data)
    {
        // Example: calculate asymmetry ratio of weights
        $ratio = $data['left_weight'] / max($data['right_weight'], 0.01);
        $diff = abs(1 - $ratio);
        if ($diff < 0.1) return 'Non-OA';
        if ($diff < 0.2) return 'OA Rendah';
        if ($diff < 0.3) return 'OA Sedang';
        return 'OA Tinggi';
    }

    private function calculateStepSpeedCategory($data)
    {
        // Placeholder: use average of MPU magnitudes as proxy for step speed
        $avgMpu = ($data['left_mpu'] + $data['right_mpu']) / 2;
        if ($avgMpu > 1.5) return 'Non-OA';
        if ($avgMpu > 1.0) return 'OA Rendah';
        if ($avgMpu > 0.5) return 'OA Sedang';
        return 'OA Tinggi';
    }

    private function calculateParameter4Category($data)
    {
        // Placeholder logic using piezo1 sensor
        $val = $data['piezo1'];
        if ($val > 3000) return 'Non-OA';
        if ($val > 2000) return 'OA Rendah';
        if ($val > 1000) return 'OA Sedang';
        return 'OA Tinggi';
    }

    private function calculateParameter5Category($data)
    {
        // Placeholder logic using piezo2 sensor
        $val = $data['piezo2'];
        if ($val > 3000) return 'Non-OA';
        if ($val > 2000) return 'OA Rendah';
        if ($val > 1000) return 'OA Sedang';
        return 'OA Tinggi';
    }

    private function calculateParameter6Category($data)
    {
        // Placeholder logic using piezo3 sensor
        $val = $data['piezo3'];
        if ($val > 3000) return 'Non-OA';
        if ($val > 2000) return 'OA Rendah';
        if ($val > 1000) return 'OA Sedang';
        return 'OA Tinggi';
    }
}