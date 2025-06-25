export default function Paginator({ meta, onPageChange, total = 0, perPage = 10, currentPage = 1 }) {
  // Debug: ver qué datos llegan
  console.log('Paginator recibió:', { meta, total, perPage, currentPage });

  // Si no hay meta, usar valores por defecto o props
  const paginationMeta = meta || {
    current_page: currentPage,
    last_page: Math.ceil(total / perPage),
    per_page: perPage,
    total: total
  };

  const current = paginationMeta.current_page || 1;
  const lastPage = paginationMeta.last_page || 1;
  const totalItems = paginationMeta.total || total || 0;
  const perPageItems = paginationMeta.per_page || perPage || 10;

  // Si no hay datos o solo hay una página, mostrar información pero no navegación
  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="text-sm text-gray-500">
          No hay resultados para mostrar
        </div>
      </div>
    );
  }

  if (lastPage <= 1) {
    return (
      <div className="flex items-center justify-center px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{totalItems}</span> resultados
        </div>
      </div>
    );
  }

  // Calcular el rango de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas alrededor de la página actual
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(lastPage, start + maxVisible - 1);

      // Ajustar si estamos cerca del final
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      {/* Información de resultados */}
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Mostrando{' '}
          <span className="font-medium">{((current - 1) * perPageItems) + 1}</span>
          {' '}a{' '}
          <span className="font-medium">
            {Math.min(current * perPageItems, totalItems)}
          </span>
          {' '}de{' '}
          <span className="font-medium">{totalItems}</span>
          {' '}resultados
        </span>
      </div>

      {/* Navegación */}
      <div className="flex items-center space-x-2">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            current === 1
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-chevron-left mr-1"></i>
          Anterior
        </button>

        {/* Números de página */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                page === current
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current === lastPage}
          className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            current === lastPage
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Siguiente
          <i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  );
}
