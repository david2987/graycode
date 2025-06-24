import Layout from '../Components/Layout';
import Modal from '../Components/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CajaPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [balance, setBalance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ tipo: "ingreso", monto: "", descripcion: "" });

  const cargar = async () => {
    const [movRes, balRes] = await Promise.all([
      axios.get("/caja/getAll"),
      axios.get("/caja/balance"),
    ]);
    setMovimientos(movRes.data);
    setBalance(balRes.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    await axios.post("/api/caja", form);
    setForm({ tipo: "ingreso", monto: "", descripcion: "" });
    setModalVisible(false);
    cargar();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Caja</h2>
        <button onClick={() => setModalVisible(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Registrar Movimiento
        </button>
      </div>

      {balance && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p><strong>Ingresos:</strong> ${balance.ingresos.toFixed(2)}</p>
          <p><strong>Egresos:</strong> ${balance.egresos.toFixed(2)}</p>
          <p><strong>Saldo:</strong> ${balance.saldo.toFixed(2)}</p>
        </div>
      )}

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id} className="border-t">
              <td>{new Date(m.fecha).toLocaleString()}</td>
              <td className={m.tipo === "ingreso" ? "text-green-600" : "text-red-600"}>
                {m.tipo}
              </td>
              <td>${parseFloat(m.monto).toFixed(2)}</td>
              <td>{m.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <h3 className="text-xl font-semibold mb-4">Registrar Movimiento</h3>
        <form onSubmit={guardar} className="space-y-4">
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
          <input
            type="number"
            placeholder="Monto"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
}

CajaPage.layout = (page) => <Layout>{page}</Layout>;
export default CajaPage;
