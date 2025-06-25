<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\ProductoSeeder;

class SeedProductos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:productos {--count=40 : Número de productos a crear} {--truncate : Limpiar tabla antes de crear}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crear productos aleatorios para testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = $this->option('count');
        $truncate = $this->option('truncate');

        if ($truncate) {
            if ($this->confirm('¿Estás seguro de que quieres eliminar todos los productos existentes?')) {
                \App\Models\Producto::truncate();
                $this->info('Tabla de productos limpiada.');
            } else {
                $this->info('Operación cancelada.');
                return;
            }
        }

        $this->info("Creando {$count} productos aleatorios...");

        // Ejecutar el seeder
        $seeder = new ProductoSeeder();
        $seeder->setCommand($this);
        $seeder->run();

        $this->info("¡{$count} productos creados exitosamente!");
    }
}
