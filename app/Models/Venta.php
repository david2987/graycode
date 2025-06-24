<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'ventas';

    protected $fillable = ['comprobante_externo','fecha','total'];
    public function detalles()
    {
        return $this->hasMany(DetalleVenta::class);
    }
}
