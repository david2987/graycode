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

  const cargarCompras = () => axios.get('/compras/getAll?page=' + currentPage).then(res => {
    console.log(res.data);
    setCompras(res.data.data);
    setMeta(res.data);
  });

  useEffect(() => {
    cargarCompras();
  }, [currentPage]);

  const handleCompraRealizada = () => {
    cargarCompras();
    setToast({
      message: "Compra registrada exitosamente",
      error: false,
      onClose: () => setToast({ message: "", error: false, onClose: () => {} })
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Compras</h1>
        <button
          onClick={() => setModalVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <i className="fas fa-plus mr-2"></i>
          Nueva Compra
        </button>
      </div>

      <Toast {...toast} />

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

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
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