<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropertyController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('properties')->group(function () {
    Route::get('/', [PropertyController::class, 'index']);
    Route::post('/', [PropertyController::class, 'store']);
    Route::get('/{id}', [PropertyController::class, 'show']);
    Route::put('/{id}', [PropertyController::class, 'update']);
    Route::delete('/{id}', [PropertyController::class, 'destroy']);
});

Route::prefix('facilities')->group(function () {
    Route::get('/', [App\Http\Controllers\FacilityController::class, 'index']);
    Route::post('/', [App\Http\Controllers\FacilityController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\FacilityController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\FacilityController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\FacilityController::class, 'destroy']);
});
