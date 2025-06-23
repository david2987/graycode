<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\VentaController;
use App\Http\Controllers\Api\MovimientoCajaController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



Route::prefix('productos')->group(function () {
    Route::get('/',  fn () => Inertia::render('ProductosPage'))->name('productos.index');
    Route::get('/getAll',[ProductoController::class, 'getAll']);
    Route::post('/', [ProductoController::class, 'store']);
    Route::get('{id}', [ProductoController::class, 'show']);
    Route::put('{id}', [ProductoController::class, 'update']);
    Route::delete('{id}', [ProductoController::class, 'destroy']);
});

Route::prefix('ventas')->group(function () {
    Route::post('/', [VentaController::class, 'store']);
    Route::get('/',  fn () => Inertia::render('VentasPage'))->name('ventas.index');
    Route::get('/getAll',[VentaController::class, 'getAll']);
    Route::get('{id}', [VentaController::class, 'show']);
});

Route::prefix('caja')->group(function () {
    Route::get('/' ,fn () => Inertia::render('CajaPage'))->name('caja.index');
    Route::get('/getAll',[MovimientoCajaController::class, 'getAll']);
    Route::post('/', [MovimientoCajaController::class, 'store']);
    Route::get('/balance', [MovimientoCajaController::class, 'balance']);
    Route::post('/egreso', [MovimientoCajaController::class, 'egresoManual']);
});

Route::get('/caja/reporte-diario', [MovimientoCajaController::class, 'reporteDiario']);
Route::get('/ventas/filtrar', [VentaController::class, 'filtrar']);
Route::post('/productos/importar', [ProductoController::class, 'importar']);



require __DIR__.'/auth.php';
