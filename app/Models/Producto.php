<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    //
    protected $table = 'productos';

    protected $fillable = ['nombre','precio_venta','talle','stock'];
}
