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

  const cargarVentas = () => axios.get('/ventas/getAll?page=' + currentPage).then(res => {
    console.log(res.data);
    setVentas(res.data.data);
    setMeta(res.data);
  });

  useEffect(() => {
    cargarVentas();
  }, [currentPage]);

  const handleVentaRealizada = () => {
    cargarVentas();
    setToast({
      message: "Venta registrada exitosamente",
      error: false,
      onClose: () => setToast({ message: "", error: false, onClose: () => {} })
    });
  };

  return (
    <div>
      <Toast message={toast.message} error={toast.error} onClose={toast.onClose} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ventas</h2>
        <button
          onClick={() => setModalVisible(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>
          Registrar Venta
        </button>
      </div>

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

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
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
