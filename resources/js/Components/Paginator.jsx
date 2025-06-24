export default function Paginator({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;
  
    const pages = [];
    for (let i = 1; i <= meta.last_page; i++) {
      pages.push(i);
    }
  
    return (
      <div className="flex justify-center space-x-2 mt-4">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded border ${meta.current_page === page ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  }
  