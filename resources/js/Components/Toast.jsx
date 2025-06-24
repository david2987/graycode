export default function Toast({ message,error, onClose }) {
    if (!message) return null;
  
    return (
      <div className={`fixed bottom-4 right-4 ${error ? "bg-red-600" : "bg-green-600"} text-white px-4 py-2 rounded shadow-lg z-50`}>
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button onClick={onClose} className="ml-4 font-bold">✕</button>
        </div>
      </div>
    );
  }
  