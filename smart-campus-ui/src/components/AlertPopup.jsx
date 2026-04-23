function AlertPopup({
  isOpen,
  type = "success",
  title,
  message,
  primaryText = "OK",
  secondaryText,
  onPrimaryClick,
  onSecondaryClick,
  onClose,
}) {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Icon Circle */}
        <div className="flex justify-center mb-6">
          <div
            className={`relative flex items-center justify-center w-28 h-28 rounded-full ${
              isSuccess ? "bg-blue-100" : "bg-red-100"
            }`}
          >
            <div
              className={`absolute w-20 h-20 rounded-full ${
                isSuccess ? "bg-blue-200/60" : "bg-red-200/60"
              }`}
            />
            <div
              className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${
                isSuccess ? "bg-blue-500" : "bg-red-400"
              }`}
            >
              {isSuccess ? (
                <span className="text-white text-3xl font-bold">✓</span>
              ) : (
                <span className="text-white text-3xl font-bold">!</span>
              )}
            </div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-3xl font-extrabold text-[#2B2F55] mb-3">
          {title}
        </h2>
        <p className="text-gray-500 text-base leading-6 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onPrimaryClick}
            className="w-full bg-[#1E90FF] hover:bg-[#187bdb] text-white font-semibold py-3 rounded-lg transition"
          >
            {primaryText}
          </button>

          {secondaryText && (
            <button
              onClick={onSecondaryClick}
              className="w-full bg-gray-100 hover:bg-gray-200 text-[#2B2F55] font-medium py-3 rounded-lg transition"
            >
              {secondaryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;