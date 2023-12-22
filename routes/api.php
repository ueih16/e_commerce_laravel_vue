<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum', 'admin'])
    ->group(function() {
        Route::get('user',  [AuthController::class, 'getUser']);
        Route::post('logout', [AuthController::class, 'logout']);

        // Products
        Route::apiResource('/products', ProductController::class);

        // Users
        Route::apiResource('/users', UserController::class);

        // Customers
        Route::apiResource('/customers', CustomerController::class);

        // Get Countries
        Route::get('/countries', [CustomerController::class, 'countries']);

        // Orders
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{order}', [OrderController::class, 'view']);
        Route::get('get-order-statuses', [OrderController::class, 'getStatuses']);
        Route::post('orders/change-status/{order}/{status}', [OrderController::class, 'changeStatus']);

        // Dashboard
        Route::get('/dashboard/customers-count', [DashboardController::class, 'activeCustomers']);
        Route::get('/dashboard/products-count', [DashboardController::class, 'activeProducts']);
        Route::get('/dashboard/orders-count', [DashboardController::class, 'paidOrders']);
        Route::get('/dashboard/income-amount', [DashboardController::class, 'totalIncome']);
        Route::get('/dashboard/orders-by-country', [DashboardController::class, 'ordersByCountry']);
        Route::get('/dashboard/latest-customers', [DashboardController::class, 'latestCustomers']);
    });


Route::post('login',[ AuthController::class, 'login']);
