import React from "react";
import { useNavigate } from "react-router-dom";
import { navLinks } from "../../constants";
import { useTheme } from "../../theme-support/ThemeContext"; // 👈 import

//  const navLinks = [
//   { name: 'Home', link: '/' },
//   { name: 'About', link: '/about' },
//   { name: 'Services', link: '/services' },
//   { name: 'Contact', link: '/contact' },
// ];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // 👈 use hook

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/signup"); // Navigate to sign up page
  };

  const handleNavClick = (link) => {
    navigate(link); // Navigate to selected nav link
  };

  return (
    <div className="flex   bg-primary-50 w-full h-12 left-0">
      <div className="flex w-200 justify-between items-center md:mx-10 mx-5">
        <h2
          className="text-lg font-semibold text-white cursor-pointer transform transition duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          PharmaConnect +
        </h2>
        <ul className="hidden relative md:flex gap-5">
          {navLinks.map((item) => (
            <li
              key={item.name}
              className="relative group cursor-pointer transform transition duration-300 hover:scale-110 hover:font-semibold ease-in"
              onClick={() => {
                const section = document.getElementById(item.id);
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-white text-sm">{item.name}</span>
              <span className="absolute bottom-0 bg-white left-0 w-0 h-0.5 transform transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end  items-center w-90 space-x-2">
        <div className="px-2 mb-2 flex items-center mt-2 justify-center ">
          <label className="inline-flex items-center cursor-pointer">
            {/* Hidden Checkbox */}
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />

            {/* Label Text */}
            <span className="ml-3 text-sm font-medium text-white">
              {theme === "dark" ? "Dark" : "Light"} Mode
            </span>

            {/* Toggle Background */}
            <div className="w-11 ml-3 h-6 bg-gray-900 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-white/60 rounded-full peer dark:bg-gray-600 peer-checked:bg-green-400 relative transition-colors duration-300">
              {/* Toggle Circle */}
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
        <button
          onClick={handleRegisterClick}
          className="border-2 border-selected-50 hover:bg-selected-50 text-white rounded-xl p-1.5 transition duration-300"
        >
          <span className="">Register</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
