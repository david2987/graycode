<?php

namespace App\Imports;

use App\Models\Producto;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProductosImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Producto([
            'nombre' => $row['nombre'],
            'codigo_barras' => $row['codigo_barras'] ?? null,
            'descripcion' => $row['descripcion'] ?? null,
            'talle' => $row['talle'] ?? null,
            'color' => $row['color'] ?? null,
            'stock' => $row['stock'] ?? 0,
            'precio_venta' => $row['precio_venta'],
        ]);
    }
}

