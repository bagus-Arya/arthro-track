<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OARiskService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class SensorController extends Controller
{
    protected OARiskService $riskService;

    public function __construct(OARiskService $riskService)
    {
        $this->riskService = $riskService;  
    }

    public function getRiskAssessment(string $patientId): JsonResponse
    {
        try {
            $sensorData = DB::table('sensors')
                ->where('patient_id', $patientId)
                ->orderBy('timestamp', 'desc')
                ->first();

            if (!$sensorData) {
                return response()->json(['error' => 'No sensor data found for patient'], 404);
            }

            $data = [
                'rom_knee_left' => (float) $sensorData->rom_knee_left ?? 0,
                'rom_knee_right' => (float) $sensorData->rom_knee_right ?? 0,
                'gait_duration' => (float) $sensorData->gait_duration ?? 1,
                'stance_time_left' => (float) $sensorData->stance_time_left ?? 0,
                'stance_time_right' => (float) $sensorData->stance_time_right ?? 0,
                'weight_left' => (float) $sensorData->weight_left ?? 0,
                'weight_right' => (float) $sensorData->weight_right ?? 0
            ];

            $result = $this->riskService->calculate($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'patient_id' => $patientId,
                'timestamp' => $sensorData->timestamp ?? now()
            ]);

        } catch (\Exception $e) {
            \Log::error('OA Risk Calculation Error: ' . $e->getMessage());  // Log for debugging
            return response()->json(['error' => 'Calculation failed: ' . $e->getMessage()], 500);
        }
    }

    public function calculateRisk(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'patient_id' => 'required|string|max:255',
                'rom_knee_left' => 'required|numeric|min:0',
                'rom_knee_right' => 'required|numeric|min:0',
                'gait_duration' => 'required|numeric|min:0.1',
                'stance_time_left' => 'required|numeric|min:0',
                'stance_time_right' => 'required|numeric|min:0',
                'weight_left' => 'required|numeric|min:0',
                'weight_right' => 'required|numeric|min:0'
            ]);

            $data = $request->only([
                'rom_knee_left', 'rom_knee_right', 'gait_duration',
                'stance_time_left', 'stance_time_right', 'weight_left', 'weight_right'
            ]);

            $result = $this->riskService->calculate($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'patient_id' => $request->input('patient_id')
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('OA Risk POST Error: ' . $e->getMessage());
            return response()->json(['error' => 'Calculation failed: ' . $e->getMessage()], 500);
        }
    }
}