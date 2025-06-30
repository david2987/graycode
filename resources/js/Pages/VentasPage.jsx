import Layout from '../Components/Layout';
import Modal from '../Components/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../Components/Toast';
import VentaForm from '../Components/ventas/VentaForm';
import Paginator from '../Components/Paginator';

function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [toast, setToast] = useState({ message: "", onClose: () => {} });
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtros, setFiltros] = useState({
    desde: '',
    hasta: '',
    forma_pago: '',
    monto_min: '',
    monto_max: '',
    comprobante: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const cargarVentas = () => {
    const params = new URLSearchParams({
      page: currentPage,
      ...filtros
    });
    
    return axios.get(`/ventas/getAll?${params}`).then(res => {
      console.log(res.data);
      setVentas(res.data.data);
      setMeta(res.data);
    });
  };

  useEffect(() => {
    cargarVentas();
  }, [currentPage, filtros]);

  const handleVentaRealizada = () => {
    cargarVentas();
    setToast({
      message: "Venta registrada exitosamente",
      error: false,
      onClose: () => setToast({ message: "", error: false, onClose: () => {} })
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      desde: '',
      hasta: '',
      forma_pago: '',
      monto_min: '',
      monto_max: '',
      comprobante: ''
    });
    setCurrentPage(1);
  };

  const aplicarFiltros = () => {
    setCurrentPage(1);
  };

  return (
    <div>
      <Toast message={toast.message} error={toast.error} onClose={toast.onClose} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ventas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            <i className={`fas fa-filter mr-2`}></i>
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros
          </button>
          <button
            onClick={() => setModalVisible(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <i className="fas fa-plus mr-2"></i>
            Registrar Venta
          </button>
        </div>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-semibold mb-3">Filtros de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) => setFiltros({...filtros, desde: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) => setFiltros({...filtros, hasta: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma de Pago
              </label>
              <select
                value={filtros.forma_pago}
                onChange={(e) => setFiltros({...filtros, forma_pago: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las formas</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="tarjeta_debito">Tarjeta de Débito</option>
                <option value="tarjeta_credito">Tarjeta de Crédito</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Mínimo
              </label>
              <input
                type="number"
                step="0.01"
                value={filtros.monto_min}
                onChange={(e) => setFiltros({...filtros, monto_min: e.target.value})}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Máximo
              </label>
              <input
                type="number"
                step="0.01"
                value={filtros.monto_max}
                onChange={(e) => setFiltros({...filtros, monto_max: e.target.value})}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comprobante
              </label>
              <input
                type="text"
                value={filtros.comprobante}
                onChange={(e) => setFiltros({...filtros, comprobante: e.target.value})}
                placeholder="Buscar por comprobante..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={aplicarFiltros}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <i className="fas fa-search mr-2"></i>
              Aplicar Filtros
            </button>
            <button
              onClick={limpiarFiltros}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              <i className="fas fa-times mr-2"></i>
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Indicador de filtros aplicados */}
      {(filtros.desde || filtros.hasta || filtros.forma_pago || filtros.monto_min || filtros.monto_max || filtros.comprobante) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-filter text-blue-600 mr-2"></i>
              <span className="text-sm font-medium text-blue-800">Filtros aplicados:</span>
            </div>
            <button
              onClick={limpiarFiltros}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              <i className="fas fa-times mr-1"></i>
              Limpiar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {filtros.desde && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Desde: {filtros.desde}
              </span>
            )}
            {filtros.hasta && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Hasta: {filtros.hasta}
              </span>
            )}
            {filtros.forma_pago && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Forma: {filtros.forma_pago === 'efectivo' ? 'Efectivo' :
                       filtros.forma_pago === 'transferencia' ? 'Transferencia' :
                       filtros.forma_pago === 'tarjeta_debito' ? 'T. Débito' : 'T. Crédito'}
              </span>
            )}
            {filtros.monto_min && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Min: ${filtros.monto_min}
              </span>
            )}
            {filtros.monto_max && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Max: ${filtros.monto_max}
              </span>
            )}
            {filtros.comprobante && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Comprobante: {filtros.comprobante}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprobante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forma de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ventas.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {v.comprobante_externo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(v.fecha).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    v.forma_pago === 'efectivo' ? 'bg-green-100 text-green-800' :
                    v.forma_pago === 'transferencia' ? 'bg-blue-100 text-blue-800' :
                    v.forma_pago === 'tarjeta_debito' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {v.forma_pago === 'efectivo' ? 'Efectivo' :
                     v.forma_pago === 'transferencia' ? 'Transferencia' :
                     v.forma_pago === 'tarjeta_debito' ? 'T. Débito' :
                     'T. Crédito'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                  ${v.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button
                    onClick={() => window.open(`/ventas/comprobante/${v.id}`, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    title="Imprimir Comprobante"
                  >
                    <i className="fas fa-print mr-1"></i>
                    Imprimir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginator meta={meta} onPageChange={setCurrentPage} />

      <Modal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        title="Registrar Nueva Venta"
      >
        <VentaForm
          onVentaRealizada={handleVentaRealizada}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
}

VentasPage.layout = (page) => <Layout>{page}</Layout>;
export default VentasPage;
