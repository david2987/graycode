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
        $query = Producto::query();

        // Búsqueda general (nombre, talle)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('talle', 'like', "%{$search}%");
            });
        }

        // Filtro por nombre específico
        if ($request->filled('nombre')) {
            $query->where('nombre', 'like', "%{$request->nombre}%");
        }

        // Filtro por talle específico
        if ($request->filled('talle')) {
            $query->where('talle', 'like', "%{$request->talle}%");
        }

        // Filtro por rango de precios
        if ($request->filled('precio_min')) {
            $query->where('precio_venta', '>=', $request->precio_min);
        }
        if ($request->filled('precio_max')) {
            $query->where('precio_venta', '<=', $request->precio_max);
        }

        // Filtro por rango de stock
        if ($request->filled('stock_min')) {
            $query->where('stock', '>=', $request->stock_min);
        }
        if ($request->filled('stock_max')) {
            $query->where('stock', '<=', $request->stock_max);
        }

        // Filtro por stock bajo (productos con poco stock)
        if ($request->filled('stock_bajo') && $request->stock_bajo) {
            $query->where('stock', '<=', 10);
        }

        // Filtro por stock agotado
        if ($request->filled('stock_agotado') && $request->stock_agotado) {
            $query->where('stock', '=', 0);
        }

        // Ordenamiento
        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = $request->input('sort_order', 'desc');
        
        // Validar campos de ordenamiento permitidos
        $allowedSortFields = ['id', 'nombre', 'precio_venta', 'stock', 'talle', 'created_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'id';
        }
        
        $query->orderBy($sortBy, $sortOrder);

        // Paginación
        $perPage = $request->input('per_page', 10);
        $perPage = min(max($perPage, 5), 100); // Limitar entre 5 y 100

        return response()->json($query->paginate($perPage));
    }

    public function getAllForVentas()
    {
        return response()->json(Producto::orderBy('id', 'desc')->get());
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

    public function descargarPlantilla()
    {
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="plantilla_productos.xlsx"',
        ];

        $data = [
            ['nombre', 'precio_venta', 'stock', 'talle'],
            ['Camiseta Básica', '25.50', '100', 'M'],
            ['Pantalón Jeans', '45.00', '50', '32'],
            ['Zapatillas Deportivas', '89.99', '30', '42'],
        ];

        return response()->download(
            $this->crearArchivoExcel($data),
            'plantilla_productos.xlsx',
            $headers
        )->deleteFileAfterSend();
    }

    private function crearArchivoExcel($data)
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($data as $rowIndex => $row) {
            foreach ($row as $colIndex => $value) {
                $sheet->setCellValueByColumnAndRow($colIndex + 1, $rowIndex + 1, $value);
            }
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'plantilla_productos');
        $writer->save($tempFile);

        return $tempFile;
    }
}
