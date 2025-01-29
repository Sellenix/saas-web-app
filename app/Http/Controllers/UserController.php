<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function show(Request $request)
    {
        return $request->user();
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
            'custom_url' => 'required|string|max:255|unique:users,custom_url,' . $request->user()->id,
        ]);

        $request->user()->update($validatedData);

        return response()->json($request->user());
    }

    public function updatePassword(Request $request)
    {
        $validatedData = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->update([
            'password' => Hash::make($validatedData['password']),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}

