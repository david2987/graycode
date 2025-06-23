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

class VentaController extends Controller
{
    public function index()
    {
        return response()->json(Venta::with('detalles')->orderByDesc('fecha')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'comprobante_externo' => 'nullable|string',
            'productos' => 'required|array',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $total = 0;
            $venta = Venta::create([
                'comprobante_externo' => $validated['comprobante_externo'] ?? null,
                'fecha' => Carbon::now(),
                'total' => 0,
            ]);

            foreach ($validated['productos'] as $item) {
                $producto = Producto::findOrFail($item['id']);
                if ($producto->stock < $item['cantidad']) {
                    throw new \Exception("No hay stock suficiente para {$producto->nombre}");
                }

                $subtotal = $producto->precio_venta * $item['cantidad'];
                $total += $subtotal;

                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $producto->precio_venta,
                ]);

                $producto->decrement('stock', $item['cantidad']);
            }

            $venta->update(['total' => $total]);

            MovimientoCaja::create([
                'tipo' => 'ingreso',
                'monto' => $total,
                'descripcion' => 'Venta #' . $venta->id,
                'fecha' => Carbon::now(),
            ]);

            DB::commit();

            return response()->json(['venta' => $venta->load('detalles')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 400);
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
