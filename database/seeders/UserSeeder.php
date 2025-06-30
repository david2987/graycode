<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@graycode.com',
            'password' => Hash::make('password'),
            'role' => 'administrador',
        ]);

        // Crear vendedor 1
        User::create([
            'name' => 'Vendedor 1',
            'email' => 'vendedor1@graycode.com',
            'password' => Hash::make('password'),
            'role' => 'vendedor1',
        ]);

        // Crear vendedor 2
        User::create([
            'name' => 'Vendedor 2',
            'email' => 'vendedor2@graycode.com',
            'password' => Hash::make('password'),
            'role' => 'vendedor2',
        ]);
    }
} 