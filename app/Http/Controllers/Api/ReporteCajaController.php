<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\MovimientoCaja;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Controllers\Controller;

class ReporteCajaController extends Controller
{
    public function exportarPDF(Request $request)
    {
        $desde = $request->input('desde');
        $hasta = $request->input('hasta');
        $tipo = $request->input('tipo');
        $montoMin = $request->input('monto_min');
        $montoMax = $request->input('monto_max');
        $descripcion = $request->input('descripcion');

        $movimientos = MovimientoCaja::query()
            ->when($desde, fn($q) => $q->whereDate('fecha', '>=', $desde))
            ->when($hasta, fn($q) => $q->whereDate('fecha', '<=', $hasta))
            ->when($tipo && in_array($tipo, ['ingreso', 'egreso']), fn($q) => $q->where('tipo', $tipo))
            ->when($montoMin, fn($q) => $q->where('monto', '>=', $montoMin))
            ->when($montoMax, fn($q) => $q->where('monto', '<=', $montoMax))
            ->when($descripcion, fn($q) => $q->where('descripcion', 'like', '%' . $descripcion . '%'))
            ->orderBy('fecha')
            ->get();

        $ingresos = $movimientos->where('tipo', 'ingreso')->sum('monto');
        $egresos = $movimientos->where('tipo', 'egreso')->sum('monto');
        $saldo = $ingresos - $egresos;

        $pdf = PDF::loadView('reportes.caja', [
            'movimientos' => $movimientos,
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'saldo' => $saldo,
            'desde' => $desde,
            'hasta' => $hasta,
        ]);

        return $pdf->download('reporte_caja.pdf');
    }
}
