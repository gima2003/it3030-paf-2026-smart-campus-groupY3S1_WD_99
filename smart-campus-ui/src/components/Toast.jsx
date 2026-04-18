function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const baseStyle =
    "fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition";

  const typeStyle =
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
      ? "bg-red-500 text-white"
      : "bg-yellow-500 text-black";

  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-lg leading-none">
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;