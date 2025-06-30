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
            $table->enum('forma_pago', ['efectivo', 'transferencia', 'tarjeta_debito', 'tarjeta_credito'])->default('efectivo')->after('total');
        });

        Schema::table('compras', function (Blueprint $table) {
            $table->enum('forma_pago', ['efectivo', 'transferencia', 'tarjeta_debito', 'tarjeta_credito'])->default('efectivo')->after('total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn('forma_pago');
        });

        Schema::table('compras', function (Blueprint $table) {
            $table->dropColumn('forma_pago');
        });
    }
}; 