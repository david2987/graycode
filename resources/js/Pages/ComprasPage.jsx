import Layout from '../Components/Layout';
import Modal from '../Components/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from '../Components/Toast';
import CompraForm from '../Components/compras/CompraForm';
import Paginator from '../Components/Paginator';

function ComprasPage() {
  const [compras, setCompras] = useState([]);
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

  const cargarCompras = () => {
    const params = new URLSearchParams({
      page: currentPage,
      ...filtros
    });
    
    return axios.get(`/compras/getAll?${params}`).then(res => {
      console.log(res.data);
      setCompras(res.data.data);
      setMeta(res.data);
    });
  };

  useEffect(() => {
    cargarCompras();
  }, [currentPage, filtros]);

  const handleCompraRealizada = () => {
    cargarCompras();
    setToast({
      message: "Compra registrada exitosamente",
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Compras</h1>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <i className="fas fa-plus mr-2"></i>
            Nueva Compra
          </button>
        </div>
      </div>

      <Toast {...toast} />

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white p-4 rounded-lg shadow">
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {compras.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {c.comprobante_externo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(c.fecha).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    c.forma_pago === 'efectivo' ? 'bg-green-100 text-green-800' :
                    c.forma_pago === 'transferencia' ? 'bg-blue-100 text-blue-800' :
                    c.forma_pago === 'tarjeta_debito' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {c.forma_pago === 'efectivo' ? 'Efectivo' :
                     c.forma_pago === 'transferencia' ? 'Transferencia' :
                     c.forma_pago === 'tarjeta_debito' ? 'T. Débito' :
                     'T. Crédito'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                  ${c.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <button
                    onClick={() => window.open(`/compras/comprobante/${c.id}`, '_blank')}
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
        title="Registrar Nueva Compra"
      >
        <CompraForm
          onCompraRealizada={handleCompraRealizada}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
}

ComprasPage.layout = (page) => <Layout>{page}</Layout>;
export default ComprasPage; 