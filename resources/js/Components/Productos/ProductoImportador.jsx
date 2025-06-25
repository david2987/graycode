import { useState } from "react";
import axios from "axios";

export default function ProductoImportador({ onImport }) {
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" }); // tipo: "success" o "error"

  const subirArchivo = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setMensaje({ texto: "Selecciona un archivo", tipo: "error" });
      return;
    }

    setLoading(true);
    setMensaje({ texto: "", tipo: "" });

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      await axios.post("/productos/importar", formData);
      setMensaje({ texto: "Productos importados correctamente", tipo: "success" });
      setArchivo(null);
      // Limpiar el input de archivo
      e.target.reset();
      onImport(); // refresca la lista
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error desconocido al importar";
      setMensaje({ texto: errorMsg, tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  const descargarPlantilla = () => {
    window.open('/productos/plantilla', '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={descargarPlantilla}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          <i className="fas fa-download mr-2"></i>
          Descargar Plantilla
        </button>
      </div>

      <form onSubmit={subirArchivo} className="flex items-center gap-4">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="border p-2 rounded flex-1"
          disabled={loading}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Importando...
            </>
          ) : (
            <>
              <i className="fas fa-upload mr-2"></i>
              Importar Productos
            </>
          )}
        </button>
      </form>

      {mensaje.texto && (
        <div className={`p-3 rounded ${
          mensaje.tipo === "success"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          <i className={`fas ${mensaje.tipo === "success" ? "fa-check-circle" : "fa-exclamation-circle"} mr-2`}></i>
          {mensaje.texto}
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">
          <i className="fas fa-info-circle mr-2"></i>
          Formato requerido:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>nombre:</strong> Nombre del producto</li>
          <li>• <strong>precio_venta:</strong> Precio de venta (número)</li>
          <li>• <strong>stock:</strong> Cantidad en stock (número entero)</li>
          <li>• <strong>talle:</strong> Talle del producto (texto)</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          <i className="fas fa-download mr-1"></i>
          Formatos soportados: Excel (.xlsx, .xls) y CSV
        </p>
      </div>
    </div>
  );
}
