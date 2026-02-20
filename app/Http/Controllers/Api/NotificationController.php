<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::latest()->take(50)->get();
        return response()->json($notifications);
    }

    public function unreadCount()
    {
        $count = Notification::where('read', false)->count();
        return response()->json(['count' => $count]);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update(['read' => true]);
        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllAsRead()
    {
        Notification::where('read', false)->update(['read' => true]);
        return response()->json(['message' => 'All marked as read']);
    }
}
