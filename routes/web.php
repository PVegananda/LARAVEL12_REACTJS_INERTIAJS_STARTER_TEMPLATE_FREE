<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PostAdminController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Admin\AdminProfileController;


// PUBLIC HOMEPAGE
Route::get('/', function () {
    return Inertia::render('Home');
});

// LOGIN ADMIN (tidak perlu middleware)
Route::get('/admin', function () {
    return Inertia::render('Admin/Login');
});

// =========================================
// ADMIN AREA (PROTECTED)
// =========================================
Route::middleware(['auth', 'isAdmin'])
    ->prefix('admin')
    ->group(function () {

    // DASHBOARD
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Posts admin resource (use PostAdminController)
    Route::resource('/posts', PostAdminController::class)->names('admin.posts');

    // bulk delete (POST)
    Route::post('/posts/bulk-delete', [PostAdminController::class, 'bulkDelete'])->name('admin.posts.bulk-delete');

    // Profile routes (view & update)
    Route::get('/profile', [AdminProfileController::class, 'index'])->name('admin.profile');
    Route::put('/profile', [AdminProfileController::class, 'update'])->name('admin.profile.update');


    });

// =========================================
// PUBLIC POSTS API (optional)
// =========================================

Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
