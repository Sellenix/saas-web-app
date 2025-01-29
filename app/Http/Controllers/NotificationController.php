<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return $user->notifications()->orderBy('created_at', 'desc')->get();
    }

    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $this->authorize('update', $notification);
        
        $notification->update(['read' => true]);
        return response()->json(['message' => 'Notification marked as read']);
    }
}

