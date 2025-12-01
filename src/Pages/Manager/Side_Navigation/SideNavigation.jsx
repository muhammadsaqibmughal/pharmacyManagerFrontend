import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import PosLink from "./SideNavigationLinks";
import { pos } from "../../../constants";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { useTheme } from "../../../theme-support/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Pos = () => {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const sidebarRef = useRef();
  const rotateRef = useRef();

  useEffect(() => {
    // Animate sidebar width
    gsap.to(sidebarRef.current, {
      width: isOpen ? "14rem" : "3rem",
      duration: 0.5,
      ease: "power2.inOut",
    });

    // Animate toggle icon rotation
    gsap.to(rotateRef.current, {
      rotate: isOpen ? 360 : 360,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  const toggleSubMenu = (index) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };

  const handleLogout = () => {
    console.log("Logging out...");

    localStorage.clear();
    sessionStorage.clear();

    navigate("/signup"); // Change this route if needed
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`flex flex-col z-10 gap-2 h-screen sticky top-0 bg-bg-50 overflow-hidden transition-all`}
        style={{ width: "3rem" }} // initial width
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-2">
          {/* Logo / Placeholder Circle */}
          {isOpen && <div className="bg-db-50 w-10 h-10 rounded-full" />}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full h-10 w-10 p-1 hover:bg-selected-50 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6  transition-transform duration-300 animate"
            >
              <path
                ref={rotateRef}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                className="stroke-white"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="px-2 mb-2 flex justify-center ">
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
        )}

        {isOpen && (
          <h1 className="text-lg px-2 text-center tracking-widest font-bold text-white">
            PharmaConnect+
          </h1>
        )}

        {/* Navigation Links */}
        <div className="flex mt-4 flex-col gap-2">
          {pos.map((link, index) => (
            <div key={index}>
              <PosLink
                isOpen={isOpen}
                name={link.name}
                href={link.href}
                isActive={activeIndex === index}
                onClick={() => {
                  setActiveIndex(index);
                  if (link.subitems) toggleSubMenu(index);
                }}
              >
                <link.icon className="min-w-8 w-8 size-5 text-white" />
              </PosLink>

              {/* Submenu */}
              {link.subitems && (
                <ul
                  className={`transition-all duration-300 ${
                    openSubMenuIndex === index
                      ? "opacity-100 max-h-40"
                      : "opacity-0 max-h-0 overflow-hidden"
                  } ${
                    isOpen
                      ? "w-full"
                      : "absolute left-[13rem] bg-bg-50 rounded-md p-2 z-20"
                  } flex justify-center items-center flex-col gap-1`}
                >
                  {link.subitems.map((subItem, subIndex) => (
                    <li key={subIndex} className="w-full px-1">
                      <Link
                        to={subItem.href}
                        className="block text-sm hover:bg-selected-50 w-full rounded-lg p-2 cursor-pointer text-white"
                      >
                        <span className="ml-15 text-[11px]">
                          {subItem.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div
            onClick={handleLogout}
            className="cursor-pointer text-xs font-semibold tracking-wide w-full text-white flex justify-start items-center gap-8 p-2 rounded-md hover:bg-selected-50 transition-all"
          >
            <div className={`${isOpen ? "ml-5" : "ml-[7px]"} gap-6 flex`}>
              <FiLogOut className="text-white w-5 h-5" />

              {isOpen && <button className="text-white">Logout</button>}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div
        className={`flex-1 overflow-hidden min-h-screen ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-black/50 border border-slate-700/30"
            : "bg-gradient-to-br from-gray-50 via-white to-blue-50/30 shadow-2xl shadow-gray-300/40 border border-gray-200/50"
        }`}
      >
        {/* <div className="bg-[#4F7942] mx-2 border-l-1 rounded-md mt-1 h-10"></div> */}
        <Outlet />
      </div>
    </div>
  );
};

export default Pos;
