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
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <div className="space-x-4">
                        <button
                            onClick={() => setActiveTab('productos')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'productos'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Productos
                        </button>
                        <button
                            onClick={() => setActiveTab('ventas')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'ventas'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Ventas
                        </button>
                        <button 
                            onClick={()=> setActiveTab('caja')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'ventas'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            }`}>
                            Caja
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

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
