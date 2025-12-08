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
use App\Http\Controllers\HeaderController;
use App\Http\Controllers\HeaderNavigationLinkController;
use App\Http\Controllers\HeaderDropdownItemController;
use App\Http\Controllers\FooterController;
use App\Http\Controllers\FooterQuickLinkController;
use App\Http\Controllers\FooterDiscoverLinkController;
use App\Http\Controllers\FooterSocialLinkController;
use App\Http\Controllers\ContactPageSettingController;
use App\Http\Controllers\ContactPageKeyTransportController;
use App\Http\Controllers\AboutPageSettingController;
use App\Http\Controllers\AboutPageProjectController;
use App\Http\Controllers\AboutPageTeamMemberController;
use App\Http\Controllers\AboutPageTestimonialController;

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

// Header Management Routes
Route::prefix('header')->group(function () {
    Route::get('/', [HeaderController::class, 'index']);
    Route::post('/settings', [HeaderController::class, 'updateSetting']);
});

Route::prefix('header-navigation-links')->group(function () {
    Route::get('/', [HeaderNavigationLinkController::class, 'index']);
    Route::post('/', [HeaderNavigationLinkController::class, 'store']);
    Route::get('/{id}', [HeaderNavigationLinkController::class, 'show']);
    Route::put('/{id}', [HeaderNavigationLinkController::class, 'update']);
    Route::delete('/{id}', [HeaderNavigationLinkController::class, 'destroy']);
});

Route::prefix('header-dropdown-items')->group(function () {
    Route::get('/navigation-link/{navigationLinkId}', [HeaderDropdownItemController::class, 'index']);
    Route::post('/', [HeaderDropdownItemController::class, 'store']);
    Route::get('/{id}', [HeaderDropdownItemController::class, 'show']);
    Route::put('/{id}', [HeaderDropdownItemController::class, 'update']);
    Route::delete('/{id}', [HeaderDropdownItemController::class, 'destroy']);
});

// Footer Management Routes
Route::prefix('footer')->group(function () {
    Route::get('/', [FooterController::class, 'index']);
    Route::post('/settings', [FooterController::class, 'updateSetting']);
});

Route::prefix('footer-quick-links')->group(function () {
    Route::get('/', [FooterQuickLinkController::class, 'index']);
    Route::post('/', [FooterQuickLinkController::class, 'store']);
    Route::get('/{id}', [FooterQuickLinkController::class, 'show']);
    Route::put('/{id}', [FooterQuickLinkController::class, 'update']);
    Route::delete('/{id}', [FooterQuickLinkController::class, 'destroy']);
});

Route::prefix('footer-discover-links')->group(function () {
    Route::get('/', [FooterDiscoverLinkController::class, 'index']);
    Route::post('/', [FooterDiscoverLinkController::class, 'store']);
    Route::get('/{id}', [FooterDiscoverLinkController::class, 'show']);
    Route::put('/{id}', [FooterDiscoverLinkController::class, 'update']);
    Route::delete('/{id}', [FooterDiscoverLinkController::class, 'destroy']);
});

Route::prefix('footer-social-links')->group(function () {
    Route::get('/', [FooterSocialLinkController::class, 'index']);
    Route::post('/', [FooterSocialLinkController::class, 'store']);
    Route::get('/{id}', [FooterSocialLinkController::class, 'show']);
    Route::put('/{id}', [FooterSocialLinkController::class, 'update']);
    Route::delete('/{id}', [FooterSocialLinkController::class, 'destroy']);
});

// Contact Page Management Routes
Route::prefix('contact-page')->group(function () {
    Route::get('/', [ContactPageSettingController::class, 'index']);
    Route::post('/settings', [ContactPageSettingController::class, 'updateSetting']);
});

Route::prefix('contact-page-key-transports')->group(function () {
    Route::get('/', [ContactPageKeyTransportController::class, 'index']);
    Route::post('/', [ContactPageKeyTransportController::class, 'store']);
    Route::get('/{id}', [ContactPageKeyTransportController::class, 'show']);
    Route::put('/{id}', [ContactPageKeyTransportController::class, 'update']);
    Route::delete('/{id}', [ContactPageKeyTransportController::class, 'destroy']);
});

// About Page Management Routes
Route::prefix('about-page')->group(function () {
    Route::get('/', [AboutPageSettingController::class, 'index']);
    Route::post('/settings', [AboutPageSettingController::class, 'updateSetting']);
});

Route::prefix('about-page-projects')->group(function () {
    Route::get('/', [AboutPageProjectController::class, 'index']);
    Route::post('/', [AboutPageProjectController::class, 'store']);
    Route::get('/{id}', [AboutPageProjectController::class, 'show']);
    Route::put('/{id}', [AboutPageProjectController::class, 'update']);
    Route::delete('/{id}', [AboutPageProjectController::class, 'destroy']);
});

Route::prefix('about-page-team-members')->group(function () {
    Route::get('/', [AboutPageTeamMemberController::class, 'index']);
    Route::post('/', [AboutPageTeamMemberController::class, 'store']);
    Route::get('/{id}', [AboutPageTeamMemberController::class, 'show']);
    Route::put('/{id}', [AboutPageTeamMemberController::class, 'update']);
    Route::delete('/{id}', [AboutPageTeamMemberController::class, 'destroy']);
});

Route::prefix('about-page-testimonials')->group(function () {
    Route::get('/', [AboutPageTestimonialController::class, 'index']);
    Route::post('/', [AboutPageTestimonialController::class, 'store']);
    Route::get('/{id}', [AboutPageTestimonialController::class, 'show']);
    Route::put('/{id}', [AboutPageTestimonialController::class, 'update']);
    Route::delete('/{id}', [AboutPageTestimonialController::class, 'destroy']);
});
