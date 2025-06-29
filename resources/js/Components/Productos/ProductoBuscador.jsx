import { useState, useEffect } from 'react';

export default function ProductoBuscador({ onSearch, onClear }) {
  const [filtros, setFiltros] = useState({
    search: '',
    nombre: '',
    talle: '',
    precio_min: '',
    precio_max: '',
    stock_min: '',
    stock_max: '',
    stock_bajo: false,
    stock_agotado: false,
    sort_by: 'id',
    sort_order: 'desc',
    per_page: 10
  });

  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState(0);

  // Contar filtros activos
  useEffect(() => {
    let count = 0;
    if (filtros.search) count++;
    if (filtros.nombre) count++;
    if (filtros.talle) count++;
    if (filtros.precio_min) count++;
    if (filtros.precio_max) count++;
    if (filtros.stock_min) count++;
    if (filtros.stock_max) count++;
    if (filtros.stock_bajo) count++;
    if (filtros.stock_agotado) count++;
    if (filtros.sort_by !== 'id' || filtros.sort_order !== 'desc') count++;
    if (filtros.per_page !== 10) count++;
    
    setFiltrosActivos(count);
  }, [filtros]);

  const handleInputChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Crear objeto de filtros sin valores vacíos
    const filtrosLimpios = {};
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== '' && filtros[key] !== false) {
        filtrosLimpios[key] = filtros[key];
      }
    });
    
    onSearch(filtrosLimpios);
  };

  const handleClear = () => {
    setFiltros({
      search: '',
      nombre: '',
      talle: '',
      precio_min: '',
      precio_max: '',
      stock_min: '',
      stock_max: '',
      stock_bajo: false,
      stock_agotado: false,
      sort_by: 'id',
      sort_order: 'desc',
      per_page: 10
    });
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      {/* Header del buscador */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-search text-gray-500"></i>
          <h3 className="text-lg font-semibold text-gray-800">Buscador de Productos</h3>
          {filtrosActivos > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {filtrosActivos} filtro{filtrosActivos > 1 ? 's' : ''} activo{filtrosActivos > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <i className={`fas fa-filter ${mostrarFiltrosAvanzados ? 'text-blue-600' : ''}`}></i>
            Filtros Avanzados
            <i className={`fas fa-chevron-${mostrarFiltrosAvanzados ? 'up' : 'down'} text-xs`}></i>
          </button>
        </div>
      </div>

      {/* Búsqueda rápida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Búsqueda General
          </label>
          <input
            type="text"
            placeholder="Buscar por nombre o talle..."
            value={filtros.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            value={filtros.sort_by}
            onChange={(e) => handleInputChange('sort_by', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="id">ID</option>
            <option value="nombre">Nombre</option>
            <option value="precio_venta">Precio</option>
            <option value="stock">Stock</option>
            <option value="talle">Talle</option>
            <option value="created_at">Fecha de Creación</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orden
          </label>
          <select
            value={filtros.sort_order}
            onChange={(e) => handleInputChange('sort_order', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre específico
              </label>
              <input
                type="text"
                placeholder="Nombre del producto..."
                value={filtros.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por talle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Talle específico
              </label>
              <input
                type="text"
                placeholder="Talle..."
                value={filtros.talle}
                onChange={(e) => handleInputChange('talle', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por precio mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio mínimo
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={filtros.precio_min}
                onChange={(e) => handleInputChange('precio_min', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por precio máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="999.99"
                value={filtros.precio_max}
                onChange={(e) => handleInputChange('precio_max', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por stock mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock mínimo
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filtros.stock_min}
                onChange={(e) => handleInputChange('stock_min', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por stock máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock máximo
              </label>
              <input
                type="number"
                min="0"
                placeholder="999"
                value={filtros.stock_max}
                onChange={(e) => handleInputChange('stock_max', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por stock bajo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Productos por página
              </label>
              <select
                value={filtros.per_page}
                onChange={(e) => handleInputChange('per_page', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 productos</option>
                <option value={10}>10 productos</option>
                <option value={20}>20 productos</option>
                <option value={50}>50 productos</option>
                <option value={100}>100 productos</option>
              </select>
            </div>

            {/* Checkboxes para filtros especiales */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtros especiales
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtros.stock_bajo}
                    onChange={(e) => handleInputChange('stock_bajo', e.target.checked)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Stock bajo (≤10)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtros.stock_agotado}
                    onChange={(e) => handleInputChange('stock_agotado', e.target.checked)}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Stock agotado</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-600">
          {filtrosActivos > 0 && (
            <span>
              {filtrosActivos} filtro{filtrosActivos > 1 ? 's' : ''} aplicado{filtrosActivos > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <i className="fas fa-times mr-2"></i>
            Limpiar
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <i className="fas fa-search mr-2"></i>
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
} 