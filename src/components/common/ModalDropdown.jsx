import React, { useState } from "react";

const ModalDropdown = ({
  options,
  value,
  placeholder,
  onSelect,
  theme,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`${className}  col-span-1`} >
      <div
          className={`w-full px-4 py-2 rounded-full border-2 transition-all duration-200 outline-none focus:ring-2 ${
            theme === "dark"
              ? "bg-slate-800/50 text-white/90 border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-gray-500"
              : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 placeholder:text-gray-400"
          }`}
        onClick={() => setOpen(!open)}
      >
        {value || placeholder}
      </div>
      {open && (
        <div className={`absolute mt-2  rounded-xl shadow-2xl border overflow-hidden z-50 ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}>
          <div className="p-3 border-b border-slate-700/50">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 outline-none border ${
                theme === "dark"
                  ? "bg-slate-900/50 text-white/90 border-slate-700 focus:border-blue-500 placeholder:text-gray-500"
                  : "bg-gray-50 text-gray-900 border-gray-200 focus:border-blue-500 placeholder:text-gray-400"
              }`}
            />
          </div>
          <ul className="text-sm max-h-60 overflow-y-auto p-2">
            {filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setOpen(!open);
                  setSearch("");
                }}
                className={`px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                  theme === "dark"
                    ? "hover:bg-blue-600/20 text-white/90"
                    : "hover:bg-blue-50 text-gray-900"
                }`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModalDropdown;
