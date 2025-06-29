<?php

namespace App\Http\Controllers\Api;

use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\MovimientoCaja;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class VentaController extends Controller
{
    public function getAll(Request $request)
    {
        $query = Venta::with('detalles');

        // Aplicar filtros si se proporcionan
        if ($request->input('desde')) {
            $query->whereDate('fecha', '>=', $request->input('desde'));
        }

        if ($request->input('hasta')) {
            $query->whereDate('fecha', '<=', $request->input('hasta'));
        }

        if ($request->filled('producto')) {
            $query->whereHas('detalles.producto', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->producto . '%');
            });
        }

        return response()->json($query->orderByDesc('fecha')->paginate(10));
    }
    public function filtrar(Request $request)
    {
        $query = Venta::with('detalles.producto');

        if ($request->input('desde')) {
            $query->whereDate('fecha', '>=', $request->input('desde'));
        }

        if ($request->input('hasta')) {
            $query->whereDate('fecha', '<=', $request->input('hasta'));
        }

        if ($request->filled('producto')) {
            $query->whereHas('detalles.producto', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->producto . '%');
            });
        }

        return response()->json($query->orderByDesc('fecha')->get());
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'comprobante_externo' => 'required|string|max:255',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio_venta' => 'required|numeric|min:0',
            'descuento_porcentaje' => 'nullable|numeric|min:0|max:100',
            'descuento_monto' => 'nullable|numeric|min:0',
            'motivo_descuento' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            // Calcular subtotal
            $subtotal = 0;
            foreach ($validated['productos'] as $item) {
                $producto = \App\Models\Producto::find($item['producto_id']);
                if ($producto->stock < $item['cantidad']) {
                    throw new \Exception("No hay stock suficiente para el producto: {$producto->nombre}");
                }
                $subtotal += $item['precio_venta'] * $item['cantidad'];
            }

            // Calcular descuentos
            $descuentoPorcentaje = $validated['descuento_porcentaje'] ?? 0;
            $descuentoMonto = $validated['descuento_monto'] ?? 0;
            
            $descuentoPorcentajeCalculado = $subtotal * ($descuentoPorcentaje / 100);
            $descuentoTotal = $descuentoPorcentajeCalculado + $descuentoMonto;
            
            // Calcular total final
            $totalFinal = $subtotal - $descuentoTotal;
            
            // Asegurar que el total final no sea negativo
            if ($totalFinal < 0) {
                $totalFinal = 0;
                $descuentoTotal = $subtotal;
            }

            // Crear la venta
            $venta = Venta::create([
                'comprobante_externo' => $validated['comprobante_externo'],
                'fecha' => Carbon::now(),
                'total' => $totalFinal, // Mantener compatibilidad
                'subtotal' => $subtotal,
                'descuento_porcentaje' => $descuentoPorcentaje,
                'descuento_monto' => $descuentoMonto,
                'total_final' => $totalFinal,
                'motivo_descuento' => $validated['motivo_descuento'] ?? null,
            ]);

            // Detalles
            foreach ($validated['productos'] as $item) {
                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $item['producto_id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_venta'],
                ]);

                // Descontar stock
                $producto = \App\Models\Producto::find($item['producto_id']);
                $producto->stock -= $item['cantidad'];
                $producto->save();
            }

            // Agregar ingreso en la caja (solo el total final)
            MovimientoCaja::create([
                'tipo' => 'ingreso',
                'monto' => $totalFinal,
                'descripcion' => "Venta ID {$venta->id} - Comprobante {$venta->comprobante_externo}" . 
                               ($descuentoTotal > 0 ? " (Descuento: ${$descuentoTotal})" : ""),
                'fecha' => Carbon::now(),
            ]);

            DB::commit();

            return response()->json($venta, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function generarComprobante($id)
    {
        try {
            $venta = Venta::with('detalles.producto')->findOrFail($id);

            $dompdf = new \Dompdf\Dompdf();
            $html = view('comprobantes.venta', compact('venta'))->render();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            return $dompdf->stream("comprobante-venta-{$venta->id}.pdf");
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al generar el comprobante: ' . $e->getMessage()], 500);
        }
    }
}
