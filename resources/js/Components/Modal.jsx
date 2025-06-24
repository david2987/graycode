export default function Modal({ visible, onClose, children }) {
    if (!visible) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
  