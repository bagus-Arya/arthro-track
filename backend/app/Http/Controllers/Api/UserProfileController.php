<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'age' => $user->age,
                'weight' => $user->weight,
                'height' => $user->height,
                'gender' => $user->gender,
                'email' => $user->email,  
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'age' => 'sometimes|required|integer|min:1|max:120',
            'weight' => 'sometimes|required|numeric|min:0|max:500',
            'height' => 'sometimes|required|numeric|min:0|max:300',
            'gender' => ['sometimes', 'required', Rule::in(['male', 'female', 'other'])],
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'age' => $user->age,
                'weight' => $user->weight,
                'height' => $user->height,
                'gender' => $user->gender,
            ]
        ]);
    }
}