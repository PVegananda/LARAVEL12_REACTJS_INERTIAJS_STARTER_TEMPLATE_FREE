<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class AdminProfileController extends Controller
{
    /**
     * Show the profile page (Inertia)
     */
    public function index()
    {
        // Inertia shared props should include auth.user already if you set it up.
        // Otherwise we explicitly send user data.
        $user = Auth::user();

        return Inertia::render('Admin/Profile', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * Update the profile (only name in this example)
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            // intentionally no password change here
        ]);

        $user = Auth::user();
        $user->name = $request->input('name');
        $user->save();

        // optional: redirect back with flash message
        return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
    }
}
