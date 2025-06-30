import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Función para verificar si el usuario puede acceder a una funcionalidad
    const canAccess = (feature) => {
        const permissions = {
            dashboard: ['administrador', 'vendedor1', 'vendedor2'],
            ventas: ['administrador', 'vendedor1', 'vendedor2'],
            compras: ['administrador'],
            productos: ['administrador', 'vendedor1'],
            caja: ['administrador'],
            reportes: ['administrador'],
            usuarios: ['administrador'],
        };

        return permissions[feature]?.includes(user.role) || false;
    };

    // Función para obtener el nombre del rol
    const getRoleDisplayName = (role) => {
        const roleNames = {
            'administrador': 'Administrador',
            'vendedor1': 'Vendedor 1',
            'vendedor2': 'Vendedor 2'
        };
        return roleNames[role] || 'Usuario';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100" style={{ backgroundColor: '#f0f0f0' }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex ">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    style={{ border: '0' }}                                >
                                    <h2 className="text-xl font-semibold leading-tight text-gray-800">GrayCode</h2>
                                </NavLink>
                            </div>

                            {/* Navegación principal */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {canAccess('ventas') && (
                                    <NavLink
                                        href={route('ventas.index')}
                                        active={route().current('ventas.index')}
                                    >
                                        Ventas
                                    </NavLink>
                                )}
                                
                                {canAccess('compras') && (
                                    <NavLink
                                        href={route('compras.index')}
                                        active={route().current('compras.index')}
                                    >
                                        Compras
                                    </NavLink>
                                )}
                                
                                {canAccess('productos') && (
                                    <NavLink
                                        href={route('productos.index')}
                                        active={route().current('productos.index')}
                                    >
                                        Productos
                                    </NavLink>
                                )}
                                
                                {canAccess('caja') && (
                                    <NavLink
                                        href={route('caja.index')}
                                        active={route().current('caja.index')}
                                    >
                                        Caja
                                    </NavLink>
                                )}
                                
                                {canAccess('usuarios') && (
                                    <NavLink
                                        href={route('users.index')}
                                        active={route().current('users.index')}
                                    >
                                        Usuarios
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                <div className="text-left">
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-gray-400">{getRoleDisplayName(user.role)}</div>
                                                </div>

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Salir
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Inicio
                        </ResponsiveNavLink>
                        
                        {canAccess('ventas') && (
                            <ResponsiveNavLink
                                href={route('ventas.index')}
                                active={route().current('ventas.index')}
                            >
                                Ventas
                            </ResponsiveNavLink>
                        )}
                        
                        {canAccess('compras') && (
                            <ResponsiveNavLink
                                href={route('compras.index')}
                                active={route().current('compras.index')}
                            >
                                Compras
                            </ResponsiveNavLink>
                        )}
                        
                        {canAccess('productos') && (
                            <ResponsiveNavLink
                                href={route('productos.index')}
                                active={route().current('productos.index')}
                            >
                                Productos
                            </ResponsiveNavLink>
                        )}
                        
                        {canAccess('caja') && (
                            <ResponsiveNavLink
                                href={route('caja.index')}
                                active={route().current('caja.index')}
                            >
                                Caja
                            </ResponsiveNavLink>
                        )}
                        
                        {canAccess('usuarios') && (
                            <ResponsiveNavLink
                                href={route('users.index')}
                                active={route().current('users.index')}
                            >
                                Usuarios
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                            <div className="text-xs text-gray-400">
                                {getRoleDisplayName(user.role)}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Salir
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
