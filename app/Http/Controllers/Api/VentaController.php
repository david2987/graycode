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

class VentaController extends Controller
{
    public function getAll()
    {
        return response()->json(Venta::with('detalles')->orderByDesc('fecha')->get());
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'comprobante_externo' => 'required|string|max:255',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);
      
        DB::beginTransaction();
        try {
            // Calcular total
            $total = 0;
            foreach ($validated['productos'] as $item) {
                $producto = \App\Models\Producto::find($item['producto_id']);
                if ($producto->stock < $item['cantidad']) {
                    throw new \Exception("No hay stock suficiente para el producto: {$producto->nombre}");
                }
                $total += $producto->precio_venta * $item['cantidad'];
            }
            
            
            // Crear la venta
            $venta = Venta::create([
                'comprobante_externo' => $validated['comprobante_externo'],
                'fecha' => Carbon::now(),
                'total' => $total,               
            ]);

            // Detalles
            foreach ($validated['productos'] as $item) {
                
                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $item['producto_id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $producto->precio_venta,
                ]);

                // Descontar stock
                $producto = \App\Models\Producto::find($item['producto_id']);
                $producto->stock -= $item['cantidad'];
                $producto->save();
            }

            // Agregar ingreso en la caja
            MovimientoCaja::create([
                'tipo' => 'ingreso',
                'monto' => $total,
                'descripcion' => "Venta ID {$venta->id} - Comprobante {$venta->comprobante_externo}",
                'fecha' => Carbon::now(),
            ]);

            DB::commit();

            return response()->json($venta, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);            
        }
    }
    public function filtrar(Request $request)
    {
        $query = Venta::with('detalles.producto');

        if ($request->filled('desde')) {
            $query->whereDate('fecha', '>=', $request->desde);
        }

        if ($request->filled('hasta')) {
            $query->whereDate('fecha', '<=', $request->hasta);
        }

        if ($request->filled('producto')) {
            $query->whereHas('detalles.producto', function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->producto . '%');
            });
        }

        return response()->json($query->orderByDesc('fecha')->get());
    }
}
