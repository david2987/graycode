<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoCaja extends Model
{
    //
    protected $table = 'movimiento_cajas';

    protected $fillable = ['tipo','monto','descripcion','fecha','usuario_id'];
}
