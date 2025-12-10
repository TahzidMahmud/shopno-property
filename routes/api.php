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
use App\Http\Controllers\AuthController;

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

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});


Route::prefix('properties')->group(function () {
    Route::get('/', [PropertyController::class, 'index']);
    Route::get('/{id}', [PropertyController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [PropertyController::class, 'store']);
        Route::put('/{id}', [PropertyController::class, 'update']);
        Route::delete('/{id}', [PropertyController::class, 'destroy']);
    });
});

Route::prefix('facilities')->group(function () {
    Route::get('/', [FacilityController::class, 'index']);
    Route::get('/{id}', [FacilityController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [FacilityController::class, 'store']);
        Route::put('/{id}', [FacilityController::class, 'update']);
        Route::delete('/{id}', [FacilityController::class, 'destroy']);
    });
});

// Home Page Management Routes
Route::prefix('hero-slides')->group(function () {
    Route::get('/', [HeroSlideController::class, 'index']);
    Route::get('/{id}', [HeroSlideController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [HeroSlideController::class, 'store']);
        Route::put('/{id}', [HeroSlideController::class, 'update']);
        Route::delete('/{id}', [HeroSlideController::class, 'destroy']);
    });
});

Route::prefix('why-choose-us-features')->group(function () {
    Route::get('/', [WhyChooseUsFeatureController::class, 'index']);
    Route::get('/{id}', [WhyChooseUsFeatureController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [WhyChooseUsFeatureController::class, 'store']);
        Route::put('/{id}', [WhyChooseUsFeatureController::class, 'update']);
        Route::delete('/{id}', [WhyChooseUsFeatureController::class, 'destroy']);
    });
});

Route::prefix('investment-benefits')->group(function () {
    Route::get('/', [InvestmentBenefitController::class, 'index']);
    Route::get('/{id}', [InvestmentBenefitController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [InvestmentBenefitController::class, 'store']);
        Route::put('/{id}', [InvestmentBenefitController::class, 'update']);
        Route::delete('/{id}', [InvestmentBenefitController::class, 'destroy']);
    });
});

Route::prefix('blog-posts')->group(function () {
    Route::get('/', [BlogPostController::class, 'index']);
    Route::get('/{id}', [BlogPostController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [BlogPostController::class, 'store']);
        Route::put('/{id}', [BlogPostController::class, 'update']);
        Route::delete('/{id}', [BlogPostController::class, 'destroy']);
    });
});

Route::prefix('partners')->group(function () {
    Route::get('/', [PartnerController::class, 'index']);
    Route::get('/{id}', [PartnerController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [PartnerController::class, 'store']);
        Route::put('/{id}', [PartnerController::class, 'update']);
        Route::delete('/{id}', [PartnerController::class, 'destroy']);
    });
});

Route::prefix('search-options')->group(function () {
    Route::get('/', [SearchOptionController::class, 'index']);
    Route::get('/{id}', [SearchOptionController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [SearchOptionController::class, 'store']);
        Route::put('/{id}', [SearchOptionController::class, 'update']);
        Route::delete('/{id}', [SearchOptionController::class, 'destroy']);
    });
});

Route::prefix('home-page-settings')->group(function () {
    Route::get('/', [HomePageSettingController::class, 'index']);
    Route::get('/{key}', [HomePageSettingController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [HomePageSettingController::class, 'store']);
        Route::put('/{key}', [HomePageSettingController::class, 'update']);
        Route::delete('/{key}', [HomePageSettingController::class, 'destroy']);
    });
});

Route::prefix('property-types')->group(function () {
    Route::get('/', [PropertyTypeController::class, 'index']);
    Route::get('/{id}', [PropertyTypeController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [PropertyTypeController::class, 'store']);
        Route::put('/{id}', [PropertyTypeController::class, 'update']);
        Route::delete('/{id}', [PropertyTypeController::class, 'destroy']);
    });
});

// Header Management Routes
Route::prefix('header')->group(function () {
    Route::get('/', [HeaderController::class, 'index']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/settings', [HeaderController::class, 'updateSetting']);
    });
});

Route::prefix('header-navigation-links')->group(function () {
    Route::get('/', [HeaderNavigationLinkController::class, 'index']);
    Route::get('/{id}', [HeaderNavigationLinkController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [HeaderNavigationLinkController::class, 'store']);
        Route::put('/{id}', [HeaderNavigationLinkController::class, 'update']);
        Route::delete('/{id}', [HeaderNavigationLinkController::class, 'destroy']);
    });
});

Route::prefix('header-dropdown-items')->group(function () {
    Route::get('/navigation-link/{navigationLinkId}', [HeaderDropdownItemController::class, 'index']);
    Route::get('/{id}', [HeaderDropdownItemController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [HeaderDropdownItemController::class, 'store']);
        Route::put('/{id}', [HeaderDropdownItemController::class, 'update']);
        Route::delete('/{id}', [HeaderDropdownItemController::class, 'destroy']);
    });
});

// Footer Management Routes
Route::prefix('footer')->group(function () {
    Route::get('/', [FooterController::class, 'index']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/settings', [FooterController::class, 'updateSetting']);
    });
});

Route::prefix('footer-quick-links')->group(function () {
    Route::get('/', [FooterQuickLinkController::class, 'index']);
    Route::get('/{id}', [FooterQuickLinkController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [FooterQuickLinkController::class, 'store']);
        Route::put('/{id}', [FooterQuickLinkController::class, 'update']);
        Route::delete('/{id}', [FooterQuickLinkController::class, 'destroy']);
    });
});

Route::prefix('footer-discover-links')->group(function () {
    Route::get('/', [FooterDiscoverLinkController::class, 'index']);
    Route::get('/{id}', [FooterDiscoverLinkController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [FooterDiscoverLinkController::class, 'store']);
        Route::put('/{id}', [FooterDiscoverLinkController::class, 'update']);
        Route::delete('/{id}', [FooterDiscoverLinkController::class, 'destroy']);
    });
});

Route::prefix('footer-social-links')->group(function () {
    Route::get('/', [FooterSocialLinkController::class, 'index']);
    Route::get('/{id}', [FooterSocialLinkController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [FooterSocialLinkController::class, 'store']);
        Route::put('/{id}', [FooterSocialLinkController::class, 'update']);
        Route::delete('/{id}', [FooterSocialLinkController::class, 'destroy']);
    });
});

// Contact Page Management Routes
Route::prefix('contact-page')->group(function () {
    Route::get('/', [ContactPageSettingController::class, 'index']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/settings', [ContactPageSettingController::class, 'updateSetting']);
    });
});

Route::prefix('contact-page-key-transports')->group(function () {
    Route::get('/', [ContactPageKeyTransportController::class, 'index']);
    Route::get('/{id}', [ContactPageKeyTransportController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [ContactPageKeyTransportController::class, 'store']);
        Route::put('/{id}', [ContactPageKeyTransportController::class, 'update']);
        Route::delete('/{id}', [ContactPageKeyTransportController::class, 'destroy']);
    });
});

// About Page Management Routes
Route::prefix('about-page')->group(function () {
    Route::get('/', [AboutPageSettingController::class, 'index']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/settings', [AboutPageSettingController::class, 'updateSetting']);
    });
});

Route::prefix('about-page-projects')->group(function () {
    Route::get('/', [AboutPageProjectController::class, 'index']);
    Route::get('/{id}', [AboutPageProjectController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [AboutPageProjectController::class, 'store']);
        Route::put('/{id}', [AboutPageProjectController::class, 'update']);
        Route::delete('/{id}', [AboutPageProjectController::class, 'destroy']);
    });
});

Route::prefix('about-page-team-members')->group(function () {
    Route::get('/', [AboutPageTeamMemberController::class, 'index']);
    Route::get('/{id}', [AboutPageTeamMemberController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [AboutPageTeamMemberController::class, 'store']);
        Route::put('/{id}', [AboutPageTeamMemberController::class, 'update']);
        Route::delete('/{id}', [AboutPageTeamMemberController::class, 'destroy']);
    });
});

Route::prefix('about-page-testimonials')->group(function () {
    Route::get('/', [AboutPageTestimonialController::class, 'index']);
    Route::get('/{id}', [AboutPageTestimonialController::class, 'show']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [AboutPageTestimonialController::class, 'store']);
        Route::put('/{id}', [AboutPageTestimonialController::class, 'update']);
        Route::delete('/{id}', [AboutPageTestimonialController::class, 'destroy']);
    });
});
