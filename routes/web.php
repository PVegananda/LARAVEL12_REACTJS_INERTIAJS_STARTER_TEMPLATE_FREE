<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PostAdminController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\CategoryAdminController;
use App\Http\Controllers\Admin\TagAdminController;
use App\Http\Controllers\Api\PostController;

// =============================
// PUBLIC HOMEPAGE
// =============================
Route::get('/', function () {
    return Inertia::render('Home');
});

// =============================
// ADMIN LOGIN PAGE
// =============================
Route::get('/admin/login', function () {
    return Inertia::render('Admin/Login');
})->name('admin.login');

// =============================
// AUTO REDIRECT /admin
// =============================
Route::get('/admin', function () {
    if (Auth::check() && Auth::user()->is_admin) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('admin.login');
})->name('admin.redirect');

// =============================
// ADMIN PROTECTED ROUTES
// =============================
Route::middleware(['auth', 'isAdmin'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        Route::resource('posts', PostAdminController::class);
        Route::post('/posts/bulk-delete', [PostAdminController::class, 'bulkDelete'])
            ->name('posts.bulk-delete');

        Route::get('/profile', [AdminProfileController::class, 'index'])->name('profile');
        Route::put('/profile', [AdminProfileController::class, 'update'])->name('profile.update');

        Route::resource('categories', CategoryAdminController::class);
        Route::resource('tags', TagAdminController::class);
    });

// PUBLIC API POSTS
Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
