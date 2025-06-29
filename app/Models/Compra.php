<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    protected $table = 'compras';

    protected $fillable = ['comprobante_externo','fecha','total'];
    
    public function detalles()
    {
        return $this->hasMany(DetalleCompra::class);
    }
} 