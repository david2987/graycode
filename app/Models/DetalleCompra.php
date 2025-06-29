<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleCompra extends Model
{
    protected $table = 'detalle_compras';
    
    protected $fillable = [
        'compra_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
    ];
    
    public function compra()
    {
        return $this->belongsTo(Compra::class);
    }
    
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
} 