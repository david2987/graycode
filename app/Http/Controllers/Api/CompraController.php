<?php

namespace App\Http\Controllers\Api;

use App\Models\Compra;
use App\Models\DetalleCompra;
use App\Models\Producto;
use App\Models\MovimientoCaja;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class CompraController extends Controller
{
    public function getAll(Request $request)
    {
        $query = Compra::with('detalles');

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
        $query = Compra::with('detalles.producto');

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
            'productos.*.producto_id' => 'required_without:productos.*.nuevo_producto',
            'productos.*.nuevo_producto' => 'required_without:productos.*.producto_id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio_compra' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Calcular total
            $total = 0;
            foreach ($validated['productos'] as $item) {
                $total += $item['precio_compra'] * $item['cantidad'];
            }

            // Crear la compra
            $compra = Compra::create([
                'comprobante_externo' => $validated['comprobante_externo'],
                'fecha' => Carbon::now(),
                'total' => $total,
            ]);

            // Procesar detalles
            foreach ($validated['productos'] as $item) {
                $producto = null;
                
                // Si es un producto nuevo, crearlo
                if (isset($item['nuevo_producto']) && $item['nuevo_producto']) {
                    $producto = Producto::create([
                        'nombre' => $item['nombre'],
                        'precio_venta' => $item['precio_venta'] ?? $item['precio_compra'] * 1.3, // 30% de ganancia por defecto
                        'stock' => $item['cantidad'],
                        'talle' => $item['talle'] ?? 'Único',
                    ]);
                } else {
                    // Producto existente, actualizar stock
                    $producto = Producto::find($item['producto_id']);
                    $producto->stock += $item['cantidad'];
                    $producto->save();
                }

                DetalleCompra::create([
                    'compra_id' => $compra->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_compra'],
                ]);
            }

            // Agregar egreso en la caja
            MovimientoCaja::create([
                'tipo' => 'egreso',
                'monto' => $total,
                'descripcion' => "Compra ID {$compra->id} - Comprobante {$compra->comprobante_externo}",
                'fecha' => Carbon::now(),
            ]);

            DB::commit();

            return response()->json($compra, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function generarComprobante($id)
    {
        try {
            $compra = Compra::with('detalles.producto')->findOrFail($id);

            $dompdf = new \Dompdf\Dompdf();
            $html = view('comprobantes.compra', compact('compra'))->render();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            return $dompdf->stream("comprobante-compra-{$compra->id}.pdf");
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al generar el comprobante: ' . $e->getMessage()], 500);
        }
    }
} 