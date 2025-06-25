<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;
use Faker\Factory as Faker;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('es_ES');

        // Obtener la cantidad desde el comando o usar 40 por defecto
        $count = $this->command ? $this->command->option('count') : 40;

        // Arrays de datos realistas para productos de ropa
        $tiposRopa = [
            'Camiseta', 'Pantalón', 'Vestido', 'Blusa', 'Camisa', 'Chaqueta', 'Sudadera',
            'Shorts', 'Falda', 'Traje', 'Abrigo', 'Chaleco', 'Top', 'Leggings', 'Jeans'
        ];

        $colores = [
            'Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Rosa', 'Morado',
            'Naranja', 'Gris', 'Marrón', 'Beige', 'Celeste', 'Violeta', 'Turquesa'
        ];

        $materiales = [
            'Algodón', 'Poliéster', 'Lana', 'Seda', 'Lino', 'Denim', 'Cuero', 'Gamuza',
            'Encaje', 'Seda', 'Lycra', 'Spandex', 'Viscosa', 'Modal', 'Bambú'
        ];

        $talles = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44'];

        $productos = [];

        for ($i = 1; $i <= $count; $i++) {
            $tipo = $faker->randomElement($tiposRopa);
            $color = $faker->randomElement($colores);
            $material = $faker->randomElement($materiales);
            $talle = $faker->randomElement($talles);

            // Generar nombres más realistas
            $nombres = [
                "{$tipo} {$color} {$material}",
                "{$tipo} {$color} Premium",
                "{$tipo} {$color} Clásico",
                "{$tipo} {$color} Moderno",
                "{$tipo} {$color} Elegante",
                "{$tipo} {$color} Casual",
                "{$tipo} {$color} Deportivo",
                "{$tipo} {$color} Formal"
            ];

            $nombre = $faker->randomElement($nombres);

            // Generar precios realistas según el tipo de ropa
            $precioBase = match($tipo) {
                'Camiseta', 'Top', 'Blusa' => $faker->numberBetween(15, 45),
                'Pantalón', 'Jeans', 'Shorts' => $faker->numberBetween(35, 85),
                'Vestido' => $faker->numberBetween(45, 120),
                'Camisa' => $faker->numberBetween(25, 65),
                'Chaqueta', 'Abrigo' => $faker->numberBetween(60, 150),
                'Sudadera', 'Chaleco' => $faker->numberBetween(40, 80),
                'Falda' => $faker->numberBetween(30, 70),
                'Traje' => $faker->numberBetween(120, 300),
                'Leggings' => $faker->numberBetween(25, 55),
                default => $faker->numberBetween(20, 100)
            };

            // Agregar variación al precio
            $precio = $precioBase + $faker->randomFloat(2, 0, 9.99);

            $productos[] = [
                'nombre' => $nombre,
                'codigo_barras' => $faker->unique()->ean13(),
                'descripcion' => $faker->optional(0.7)->sentence(10),
                'talle' => $talle,
                'color' => $color,
                'stock' => $faker->numberBetween(5, 100),
                'precio_venta' => $precio,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Mostrar progreso si se ejecuta desde comando
            if ($this->command && $i % 10 == 0) {
                $this->command->info("Progreso: {$i}/{$count} productos creados");
            }
        }

        // Insertar todos los productos de una vez
        Producto::insert($productos);

        if ($this->command) {
            $this->command->info("¡{$count} productos aleatorios creados exitosamente!");
        }
    }
}
