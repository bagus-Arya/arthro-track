<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\SensorDataController;
use App\Http\Controllers\Api\SensorController;

Route::post('/register', function (Request $request) {
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'age' => 'nullable|integer|min:1|max:120',
            'weight' => 'nullable|numeric|min:0|max:500',
            'height' => 'nullable|numeric|min:0|max:300',
            'gender' => 'nullable|in:male,female,other',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $user = \App\Models\User::create($validated);

        $token = $user->createToken('arthrotrack-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User  registered successfully',
            'token' => $token,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Server error: ' . $e->getMessage(),
        ], 500);
    }
});

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        $token = $user->createToken('arthrotrack-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Invalid credentials'
    ], 401);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/profile', [UserProfileController::class, 'show']);
    Route::put('/user/profile', [UserProfileController::class, 'update']);
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logged out']);
    });
    
    Route::get('/sensor-data/{patientId}/risk', [SensorController::class, 'getRiskAssessment'])->name('sensor.risk');  
    Route::post('/oa-risk', [SensorController::class, 'calculateRisk'])->name('oa.risk'); 
});
// API endpoint sensor
Route::get('/sensor-data', [SensorDataController::class, 'index']); 
Route::post('/sensor-data', [SensorDataController::class, 'store']); 