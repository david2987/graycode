export default function Modal({ visible, onClose, children, maxHeight = "max-h-[90vh]", title = "Registrar Nueva Venta" }) {
    if (!visible) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
        <div className={`bg-white rounded-lg shadow-lg w-full max-w-4xl ${maxHeight} flex flex-col`}>
          {/* Header del modal */}
          <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl font-bold p-1"
            >
              &times;
            </button>
          </div>
          
          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }
  