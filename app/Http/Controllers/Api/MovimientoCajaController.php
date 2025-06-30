<?php

namespace App\Http\Controllers\Api;

use App\Models\MovimientoCaja;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class MovimientoCajaController extends Controller
{
    public function getAll(Request $request)
    {
        $query = MovimientoCaja::query();

        if ($request->filled('desde')) {
            $query->whereDate('fecha', '>=', $request->desde);
        }

        if ($request->filled('hasta')) {
            $query->whereDate('fecha', '<=', $request->hasta);
        }

        if ($request->filled('tipo') && in_array($request->tipo, ['ingreso', 'egreso'])) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('monto_min')) {
            $query->where('monto', '>=', $request->input('monto_min'));
        }

        if ($request->filled('monto_max')) {
            $query->where('monto', '<=', $request->input('monto_max'));
        }

        if ($request->filled('descripcion')) {
            $query->where('descripcion', 'like', '%' . $request->input('descripcion') . '%');
        }

        return $query->orderByDesc('fecha')->get();
    }

    public function egresoManual(Request $request)
    {
        $validated = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'descripcion' => 'required|string|max:255',
        ]);

        $egreso = MovimientoCaja::create([
            'tipo' => 'egreso',
            'monto' => $validated['monto'],
            'descripcion' => $validated['descripcion'],
            'fecha' => Carbon::now(),
        ]);

        return response()->json($egreso, 201);
    }

    public function reporteDiario(Request $request)
    {
        $fecha = $request->input('fecha') ?? now()->toDateString();

        $ingresos = MovimientoCaja::whereDate('fecha', $fecha)->where('tipo', 'ingreso')->sum('monto');
        $egresos = MovimientoCaja::whereDate('fecha', $fecha)->where('tipo', 'egreso')->sum('monto');
        $saldo = $ingresos - $egresos;

        return response()->json([
            'fecha' => $fecha,
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'saldo' => $saldo,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:ingreso,egreso',
            'monto' => 'required|numeric|min:0.01',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $mov = MovimientoCaja::create([
            'tipo' => $validated['tipo'],
            'monto' => $validated['monto'],
            'descripcion' => $validated['descripcion'],
            'fecha' => Carbon::now(),
        ]);

        return response()->json($mov, 201);
    }

    public function balance()
    {
        $ingresos = MovimientoCaja::where('tipo', 'ingreso')->sum('monto');
        $egresos = MovimientoCaja::where('tipo', 'egreso')->sum('monto');
        $saldo = $ingresos - $egresos;

        return response()->json([
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'saldo' => $saldo,
        ]);
    }
}
