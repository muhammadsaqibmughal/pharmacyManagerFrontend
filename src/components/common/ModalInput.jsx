// /components/common/ModalInput.jsx

const ModalInput = ({ fields, values, onChange, theme }) => {
  return (
    <div className="grid grid-cols-1 gap-3 mt-3 ">
      {fields.map((field) => (
        <input
        type={field.type}
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          className={`w-full  px-4 py-2 rounded-full border-2  transition-all duration-200 outline-none focus:ring-2 ${
            theme === "dark"
              ? "bg-slate-800/50 text-white/90 border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-gray-500"
              : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-gray-400"
          }`}
          value={values[field.name]}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default ModalInput;
