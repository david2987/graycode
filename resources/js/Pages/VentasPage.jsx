import Layout from '../Components/Layout';
import Modal from '../Components/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';

function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ comprobante_externo: "", productos: [] });
  const [productos, setProductos] = useState([]);
  const [detalleTemp, setDetalleTemp] = useState({ producto_id: "", cantidad: 1 });

  const cargarVentas = () => axios.get('/ventas/getAll').then(res => setVentas(res.data));
  const cargarProductos = () => axios.get('/productos/getAll').then(res => setProductos(res.data));

  useEffect(() => {
    cargarVentas();
    cargarProductos();
  }, []);

  const agregarProductoADetalle = () => {
    const prod = productos.find(p => p.id == detalleTemp.producto_id);
    if (prod) {
      setForm({
        ...form,
        productos: [
          ...form.productos,
          {
            producto_id: prod.id,
            cantidad: detalleTemp.cantidad,
            nombre: prod.nombre,
          },
        ],
      });
      setDetalleTemp({ producto_id: "", cantidad: 1 });
    }
  };

  const guardarVenta = async (e) => {
    e.preventDefault();
    await axios.post('/api/ventas', form);
    setModalVisible(false);
    cargarVentas();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ventas</h2>
        <button onClick={() => setModalVisible(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Registrar Venta
        </button>
      </div>

      <table className="w-full border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th>Comprobante</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id} className="border-t">
              <td>{v.comprobante_externo}</td>
              <td>{new Date(v.fecha).toLocaleString()}</td>
              <td>${v.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <h3 className="text-xl font-semibold mb-4">Registrar Venta</h3>
        <form onSubmit={guardarVenta} className="space-y-4">
          <input
            type="text"
            placeholder="Comprobante externo"
            value={form.comprobante_externo}
            onChange={(e) => setForm({ ...form, comprobante_externo: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <div className="flex gap-2">
            <select
              value={detalleTemp.producto_id}
              onChange={(e) => setDetalleTemp({ ...detalleTemp, producto_id: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione producto</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={detalleTemp.cantidad}
              onChange={(e) => setDetalleTemp({ ...detalleTemp, cantidad: e.target.value })}
              className="border p-2 rounded w-24"
            />
            <button type="button" onClick={agregarProductoADetalle} className="bg-green-600 text-white px-4 rounded">
              +
            </button>
          </div>
          <ul className="list-disc ml-6">
            {form.productos.map((d, i) => (
              <li key={i}>{d.nombre} x {d.cantidad}</li>
            ))}
          </ul>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
}

VentasPage.layout = (page) => <Layout>{page}</Layout>;
export default VentasPage;
