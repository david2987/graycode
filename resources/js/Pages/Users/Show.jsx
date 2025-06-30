import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Show({ user, roleDisplayName }) {
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'administrador':
                return 'bg-red-100 text-red-800';
            case 'vendedor1':
                return 'bg-blue-100 text-blue-800';
            case 'vendedor2':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detalles del Usuario</h2>}
        >
            <Head title="Detalles del Usuario" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-6">
                                {/* Información del usuario */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Usuario</h3>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Rol</label>
                                            <div className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                    {roleDisplayName}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(user.updated_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Permisos del rol */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Permisos del Rol</h3>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-gray-900">Dashboard</span>
                                            </div>
                                            
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-gray-900">Ventas</span>
                                            </div>
                                            
                                            {user.role === 'administrador' && (
                                                <>
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-900">Compras</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-900">Productos</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-900">Caja</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm text-gray-900">Usuarios</span>
                                                    </div>
                                                </>
                                            )}
                                            
                                            {user.role === 'vendedor1' && (
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-900">Productos</span>
                                                </div>
                                            )}
                                            
                                            {(user.role === 'vendedor1' || user.role === 'vendedor2') && (
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Compras</span>
                                                </div>
                                            )}
                                            
                                            {(user.role === 'vendedor1' || user.role === 'vendedor2') && (
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Caja</span>
                                                </div>
                                            )}
                                            
                                            {user.role === 'vendedor2' && (
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Productos</span>
                                                </div>
                                            )}
                                            
                                            {(user.role === 'vendedor1' || user.role === 'vendedor2') && (
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    <span className="text-sm text-gray-500">Usuarios</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                                    <SecondaryButton
                                        onClick={() => window.history.back()}
                                    >
                                        Volver
                                    </SecondaryButton>
                                    <Link href={route('users.edit', user.id)}>
                                        <PrimaryButton>
                                            Editar Usuario
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 