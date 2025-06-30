<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is administrator
     */
    public function isAdmin(): bool
    {
        return $this->role === 'administrador';
    }

    /**
     * Check if user is vendor 1
     */
    public function isVendedor1(): bool
    {
        return $this->role === 'vendedor1';
    }

    /**
     * Check if user is vendor 2
     */
    public function isVendedor2(): bool
    {
        return $this->role === 'vendedor2';
    }

    /**
     * Check if user has access to a specific feature
     */
    public function canAccess($feature): bool
    {
        $permissions = [
            'dashboard' => ['administrador', 'vendedor1', 'vendedor2'],
            'ventas' => ['administrador', 'vendedor1', 'vendedor2'],
            'compras' => ['administrador'],
            'productos' => ['administrador', 'vendedor1'],
            'caja' => ['administrador'],
            'reportes' => ['administrador'],
            'usuarios' => ['administrador'],
        ];

        return in_array($this->role, $permissions[$feature] ?? []);
    }

    /**
     * Get role display name
     */
    public function getRoleDisplayName(): string
    {
        return match($this->role) {
            'administrador' => 'Administrador',
            'vendedor1' => 'Vendedor 1',
            'vendedor2' => 'Vendedor 2',
            default => 'Usuario'
        };
    }
}
