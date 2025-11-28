const Modal = ({ show, onClose, children, title, theme }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg  flex justify-center items-center z-10 ">
      <div
        className={`${
          theme === "dark"
            ? "bg-dark-50 text-white/90"
            : "bg-light-50 text-primary-50"
        } rounded-xl p-5 text-white shadow-xl min-w-[500px]`}
      >
        <h2 className={`text-xl font-bold mb-4 ${
          theme === "dark"
            ? " text-white/90"
            : " text-primary-50"
        }`}>{title}</h2>

        {children}
      </div>
    </div>
  );
};

export default Modal;
