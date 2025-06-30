import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import Toast from '@/Components/Toast';
import Paginator from '@/Components/Paginator';

export default function UsersPage({ users, filters, roles }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.message) {
            setToastMessage(flash.message);
            setToastType('success');
            setShowToast(true);
        }
        if (flash.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(route('users.index'), {
            search: searchTerm,
            role: roleFilter,
            sort_by: sortBy,
            sort_order: sortOrder
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(newOrder);
        router.get(route('users.index'), {
            search: searchTerm,
            role: roleFilter,
            sort_by: field,
            sort_order: newOrder
        }, {
            preserveState: true,
            replace: true
        });
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const deleteUser = () => {
        router.delete(route('users.destroy', userToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setUserToDelete(null);
            }
        });
    };

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

    const getRoleDisplayName = (role) => {
        return roles[role] || role;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Usuarios</h2>}
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header con búsqueda y filtros */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h3 className="text-lg font-medium">Lista de Usuarios</h3>
                                <Link href={route('users.create')}>
                                    <PrimaryButton>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Nuevo Usuario
                                    </PrimaryButton>
                                </Link>
                            </div>

                            {/* Filtros */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Buscar
                                        </label>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Nombre o email..."
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rol
                                        </label>
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Todos los roles</option>
                                            {Object.entries(roles).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <SecondaryButton onClick={handleSearch} className="w-full">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Buscar
                                        </SecondaryButton>
                                    </div>
                                    <div className="flex items-end">
                                        <SecondaryButton 
                                            onClick={() => {
                                                setSearchTerm('');
                                                setRoleFilter('');
                                                setSortBy('created_at');
                                                setSortOrder('desc');
                                                router.get(route('users.index'));
                                            }}
                                            className="w-full"
                                        >
                                            Limpiar
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de usuarios */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center">
                                                    Nombre
                                                    {sortBy === 'name' && (
                                                        <svg className={`ml-1 w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                <div className="flex items-center">
                                                    Fecha Creación
                                                    {sortBy === 'created_at' && (
                                                        <svg className={`ml-1 w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                        {getRoleDisplayName(user.role)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={route('users.show', user.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link
                                                            href={route('users.edit', user.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmDelete(user)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {users.data.length > 0 && (
                                <div className="mt-6">
                                    <Paginator links={users.links} />
                                </div>
                            )}

                            {/* Mensaje cuando no hay usuarios */}
                            {users.data.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm || roleFilter ? 'No se encontraron usuarios con los filtros aplicados.' : 'Comienza creando un nuevo usuario.'}
                                    </p>
                                    {!searchTerm && !roleFilter && (
                                        <div className="mt-6">
                                            <Link href={route('users.create')}>
                                                <PrimaryButton>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Nuevo Usuario
                                                </PrimaryButton>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Confirmar eliminación
                            </h3>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            ¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete?.name}</strong>? 
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <DangerButton
                            onClick={deleteUser}
                            className="w-full sm:w-auto sm:ml-3"
                        >
                            Eliminar
                        </DangerButton>
                        <SecondaryButton
                            onClick={() => setShowDeleteModal(false)}
                            className="w-full sm:w-auto mt-3 sm:mt-0"
                        >
                            Cancelar
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            {/* Toast de notificaciones */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                type={toastType}
                message={toastMessage}
            />
        </AuthenticatedLayout>
    );
} 