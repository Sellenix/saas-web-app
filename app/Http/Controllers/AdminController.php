<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user->update($validatedData);

        return response()->json($user);
    }
}

