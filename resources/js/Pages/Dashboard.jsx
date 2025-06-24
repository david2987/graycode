import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ProductosPage from './ProductosPage';
import VentasPage from './VentasPage';
import CajaPage from './CajaPage';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('productos');

    const renderContent = () => {
        switch (activeTab) {
            case 'caja':
                return <CajaPage></CajaPage>
            case 'productos':
                return <ProductosPage />;
            case 'ventas':
                return <VentasPage />;
            default:
                return <div>Contenido por defecto</div>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between" >                   
                    <div className="space-x-4 inline-flex">
                        <button
                            onClick={() => setActiveTab('productos')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'productos'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            } flex items-center gap-2`}
                        >
                            <i className="fas fa-box"></i>
                            Productos
                        </button>
                        <button
                            onClick={() => setActiveTab('ventas')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'ventas'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            } flex items-center gap-2`}
                        >
                            <i className="fas fa-shopping-cart"></i>
                            Ventas
                        </button>
                        <button
                            onClick={() => setActiveTab('caja')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'caja'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            } flex items-center gap-2`}
                        >
                            <i className="fas fa-cash-register"></i>
                            Caja
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="GrayCode" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
