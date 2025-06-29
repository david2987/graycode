<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'ventas';

    protected $fillable = [
        'comprobante_externo',
        'fecha',
        'total',
        'subtotal',
        'descuento_porcentaje',
        'descuento_monto',
        'total_final',
        'motivo_descuento'
    ];
    
    public function detalles()
    {
        return $this->hasMany(DetalleVenta::class);
    }
}
