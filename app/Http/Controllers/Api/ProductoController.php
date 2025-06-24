<?php
namespace App\Http\Controllers\Api;

use App\Models\Producto;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Imports\ProductosImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    public function getAll(Request $request)
    {
        $search = $request->input('search');
    $query = Producto::query();

    if ($search) {
        $query->where('nombre', 'like', "%{$search}%");
    }

    return response()->json($query->orderBy('id', 'desc')->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'precio_venta' => 'required|numeric',
            'stock' => 'required|integer',
            'talle' => 'required|string'
        ]);

        $producto = Producto::create($validated);

        return response()->json($producto, 201);
    }

    public function show($id)
    {
        return response()->json(Producto::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        return response()->json($producto);
    }

    public function destroy($id)
    {
        Producto::destroy($id);
        return response()->json(['message' => 'Producto eliminado']);
    }



public function importar(Request $request)
{
    $request->validate([
        'archivo' => 'required|file|mimes:xlsx,xls,csv',
    ]);

    Excel::import(new ProductosImport, $request->file('archivo'));

    return response()->json(['message' => 'Productos importados correctamente']);
}

}
