<?php

namespace App\Http\Controllers\Api;

use App\Models\Venta;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller
{
    public function getEstadisticas(Request $request)
    {
        $periodo = $request->input('periodo', 'dia');
        $fecha = $request->input('fecha', now()->toDateString());

        switch ($periodo) {
            case 'dia':
                return $this->getEstadisticasDia($fecha);
            case 'mes':
                return $this->getEstadisticasMes($fecha);
            case 'año':
                return $this->getEstadisticasAño($fecha);
            default:
                return $this->getEstadisticasDia($fecha);
        }
    }

    private function getEstadisticasDia($fecha)
    {
        $fechaCarbon = Carbon::parse($fecha);
        
        $ventasPorHora = Venta::selectRaw('HOUR(fecha) as hora, COUNT(*) as cantidad, SUM(total) as total_ventas')
            ->whereDate('fecha', $fechaCarbon)
            ->groupBy('hora')
            ->orderBy('hora')
            ->get();

        $ventasPorFormaPago = Venta::selectRaw('forma_pago, COUNT(*) as cantidad, SUM(total) as total_ventas')
            ->whereDate('fecha', $fechaCarbon)
            ->groupBy('forma_pago')
            ->get();

        $resumen = Venta::selectRaw('COUNT(*) as total_ventas, SUM(total) as monto_total, AVG(total) as promedio_venta')
            ->whereDate('fecha', $fechaCarbon)
            ->first();

        return response()->json([
            'periodo' => 'dia',
            'fecha' => $fecha,
            'ventas_por_hora' => $ventasPorHora,
            'ventas_por_forma_pago' => $ventasPorFormaPago,
            'resumen' => $resumen
        ]);
    }

    private function getEstadisticasMes($fecha)
    {
        $fechaCarbon = Carbon::parse($fecha);
        
        $ventasPorDia = Venta::selectRaw('DATE(fecha) as dia, COUNT(*) as cantidad, SUM(total) as total_ventas')
            ->whereYear('fecha', $fechaCarbon->year)
            ->whereMonth('fecha', $fechaCarbon->month)
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        $ventasPorFormaPago = Venta::selectRaw('forma_pago, COUNT(*) as cantidad, SUM(total) as total_ventas')
            ->whereYear('fecha', $fechaCarbon->year)
            ->whereMonth('fecha', $fechaCarbon->month)
            ->groupBy('forma_pago')
            ->get();

        $resumen = Venta::selectRaw('COUNT(*) as total_ventas, SUM(total) as monto_total, AVG(total) as promedio_venta')
            ->whereYear('fecha', $fechaCarbon->year)
            ->whereMonth('fecha', $fechaCarbon->month)
            ->first();

        return response()->json([
            'periodo' => 'mes',
            'fecha' => $fecha,
            'ventas_por_dia' => $ventasPorDia,
            'ventas_por_forma_pago' => $ventasPorFormaPago,
            'resumen' => $resumen
        ]);
    }

    private function getEstadisticasAño($fecha)
    {
        $fechaCarbon = Carbon::parse($fecha);
        
        $ventasPorMes = Venta::selectRaw('MONTH(fecha) as mes, COUNT(*) as cantidad, SUM(total) as total_ventas')
            ->whereYear('fecha', $fechaCarbon->year)
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        $ventasPorFormaPago = Venta::selectRaw('forma_pago, COUNT(*) as cantidad, SUM(total) as total_ventas')
            ->whereYear('fecha', $fechaCarbon->year)
            ->groupBy('forma_pago')
            ->get();

        $resumen = Venta::selectRaw('COUNT(*) as total_ventas, SUM(total) as monto_total, AVG(total) as promedio_venta')
            ->whereYear('fecha', $fechaCarbon->year)
            ->first();

        return response()->json([
            'periodo' => 'año',
            'fecha' => $fecha,
            'ventas_por_mes' => $ventasPorMes,
            'ventas_por_forma_pago' => $ventasPorFormaPago,
            'resumen' => $resumen
        ]);
    }

    public function getComparacion(Request $request)
    {
        $periodo = $request->input('periodo', 'mes');
        $fecha1 = $request->input('fecha1', now()->subMonth()->toDateString());
        $fecha2 = $request->input('fecha2', now()->toDateString());

        $fecha1Carbon = Carbon::parse($fecha1);
        $fecha2Carbon = Carbon::parse($fecha2);

        // Estadísticas del período 1
        $stats1 = Venta::selectRaw('COUNT(*) as total_ventas, SUM(total) as monto_total, AVG(total) as promedio_venta')
            ->whereBetween('fecha', [$fecha1Carbon, $fecha2Carbon])
            ->first();

        // Estadísticas del período anterior (mismo rango de días)
        $diasDiferencia = $fecha1Carbon->diffInDays($fecha2Carbon);
        $fechaAnterior1 = $fecha1Carbon->copy()->subDays($diasDiferencia);
        $fechaAnterior2 = $fecha1Carbon->copy()->subDay();

        $stats2 = Venta::selectRaw('COUNT(*) as total_ventas, SUM(total) as monto_total, AVG(total) as promedio_venta')
            ->whereBetween('fecha', [$fechaAnterior1, $fechaAnterior2])
            ->first();

        return response()->json([
            'periodo_actual' => [
                'fecha_inicio' => $fecha1,
                'fecha_fin' => $fecha2,
                'total_ventas' => $stats1->total_ventas ?? 0,
                'monto_total' => $stats1->monto_total ?? 0,
                'promedio_venta' => $stats1->promedio_venta ?? 0
            ],
            'periodo_anterior' => [
                'fecha_inicio' => $fechaAnterior1->toDateString(),
                'fecha_fin' => $fechaAnterior2->toDateString(),
                'total_ventas' => $stats2->total_ventas ?? 0,
                'monto_total' => $stats2->monto_total ?? 0,
                'promedio_venta' => $stats2->promedio_venta ?? 0
            ]
        ]);
    }
} 