import { useState } from "react";
import axios from "axios";

export default function ProductoImportador({ onImport }) {
  const [archivo, setArchivo] = useState(null);

  const subirArchivo = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("Selecciona un archivo");

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      await axios.post("/productos/importar", formData);
      alert("Productos importados correctamente");
      onImport(); // refresca la lista
    } catch (err) {
      alert("Error al importar: " + (err.response?.data?.message || "desconocido"));
    }
  };

  return (
    <form onSubmit={subirArchivo} className="flex items-center gap-4 mt-4">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => setArchivo(e.target.files[0])}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Importar Productos
      </button>
    </form>
  );
}
