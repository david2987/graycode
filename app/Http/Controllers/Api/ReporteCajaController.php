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

        $movimientos = MovimientoCaja::query()
            ->when($desde, fn($q) => $q->whereDate('fecha', '>=', $desde))
            ->when($hasta, fn($q) => $q->whereDate('fecha', '<=', $hasta))
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
