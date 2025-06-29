<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('total');
            $table->decimal('descuento_porcentaje', 5, 2)->default(0)->after('subtotal');
            $table->decimal('descuento_monto', 10, 2)->default(0)->after('descuento_porcentaje');
            $table->decimal('total_final', 10, 2)->default(0)->after('descuento_monto');
            $table->string('motivo_descuento')->nullable()->after('total_final');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal',
                'descuento_porcentaje', 
                'descuento_monto',
                'total_final',
                'motivo_descuento'
            ]);
        });
    }
}; 