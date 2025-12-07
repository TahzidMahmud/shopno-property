<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\HeroSlideController;
use App\Http\Controllers\WhyChooseUsFeatureController;
use App\Http\Controllers\InvestmentBenefitController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\SearchOptionController;
use App\Http\Controllers\HomePageSettingController;
use App\Http\Controllers\PropertyTypeController;

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
    Route::get('/', [FacilityController::class, 'index']);
    Route::post('/', [FacilityController::class, 'store']);
    Route::get('/{id}', [FacilityController::class, 'show']);
    Route::put('/{id}', [FacilityController::class, 'update']);
    Route::delete('/{id}', [FacilityController::class, 'destroy']);
});

// Home Page Management Routes
Route::prefix('hero-slides')->group(function () {
    Route::get('/', [HeroSlideController::class, 'index']);
    Route::post('/', [HeroSlideController::class, 'store']);
    Route::get('/{id}', [HeroSlideController::class, 'show']);
    Route::put('/{id}', [HeroSlideController::class, 'update']);
    Route::delete('/{id}', [HeroSlideController::class, 'destroy']);
});

Route::prefix('why-choose-us-features')->group(function () {
    Route::get('/', [WhyChooseUsFeatureController::class, 'index']);
    Route::post('/', [WhyChooseUsFeatureController::class, 'store']);
    Route::get('/{id}', [WhyChooseUsFeatureController::class, 'show']);
    Route::put('/{id}', [WhyChooseUsFeatureController::class, 'update']);
    Route::delete('/{id}', [WhyChooseUsFeatureController::class, 'destroy']);
});

Route::prefix('investment-benefits')->group(function () {
    Route::get('/', [InvestmentBenefitController::class, 'index']);
    Route::post('/', [InvestmentBenefitController::class, 'store']);
    Route::get('/{id}', [InvestmentBenefitController::class, 'show']);
    Route::put('/{id}', [InvestmentBenefitController::class, 'update']);
    Route::delete('/{id}', [InvestmentBenefitController::class, 'destroy']);
});

Route::prefix('blog-posts')->group(function () {
    Route::get('/', [BlogPostController::class, 'index']);
    Route::post('/', [BlogPostController::class, 'store']);
    Route::get('/{id}', [BlogPostController::class, 'show']);
    Route::put('/{id}', [BlogPostController::class, 'update']);
    Route::delete('/{id}', [BlogPostController::class, 'destroy']);
});

Route::prefix('partners')->group(function () {
    Route::get('/', [PartnerController::class, 'index']);
    Route::post('/', [PartnerController::class, 'store']);
    Route::get('/{id}', [PartnerController::class, 'show']);
    Route::put('/{id}', [PartnerController::class, 'update']);
    Route::delete('/{id}', [PartnerController::class, 'destroy']);
});

Route::prefix('search-options')->group(function () {
    Route::get('/', [SearchOptionController::class, 'index']);
    Route::post('/', [SearchOptionController::class, 'store']);
    Route::get('/{id}', [SearchOptionController::class, 'show']);
    Route::put('/{id}', [SearchOptionController::class, 'update']);
    Route::delete('/{id}', [SearchOptionController::class, 'destroy']);
});

Route::prefix('home-page-settings')->group(function () {
    Route::get('/', [HomePageSettingController::class, 'index']);
    Route::post('/', [HomePageSettingController::class, 'store']);
    Route::get('/{key}', [HomePageSettingController::class, 'show']);
    Route::put('/{key}', [HomePageSettingController::class, 'update']);
    Route::delete('/{key}', [HomePageSettingController::class, 'destroy']);
});

Route::prefix('property-types')->group(function () {
    Route::get('/', [PropertyTypeController::class, 'index']);
    Route::post('/', [PropertyTypeController::class, 'store']);
    Route::get('/{id}', [PropertyTypeController::class, 'show']);
    Route::put('/{id}', [PropertyTypeController::class, 'update']);
    Route::delete('/{id}', [PropertyTypeController::class, 'destroy']);
});
