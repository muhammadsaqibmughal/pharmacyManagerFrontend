import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import PosLink from "./PosLink";
import { pos } from "../constants";
import { gsap } from "gsap";
import { Link } from 'react-router-dom';

const Pos = () => {
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
      rotate: isOpen ? 180 : 360,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  const toggleSubMenu = (index) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`flex flex-col z-10 gap-2 h-screen sticky top-0 bg-[#4F7942] overflow-hidden transition-all`}
        style={{ width: "3rem" }} // initial width
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-2">
  {/* Logo / Placeholder Circle */}
  {isOpen && (
    <div className="bg-db-50 w-10 h-10 rounded-full" />
  )}

  <button
    onClick={() => setIsOpen(!isOpen)}
    className="rounded-full h-10 w-10 hover:bg-selected-50 flex items-center justify-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-6 h-6  transition-transform duration-300"
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
          <h1 className="text-xl px-2 text-center font-semibold text-white">PharmaConnect+</h1>
        )}

        {/* Navigation Links */}
        <div className="flex mt-4 flex-col gap-2">
          {pos.map((link, index) => (
            <div key={index} >
              <PosLink
                isOpen={isOpen}
                name={link.name}
                onClick={() => link.subitems ? toggleSubMenu(index) : null}
                href={link.href}
              >
                <link.icon className="min-w-8 w-8 size-5 text-white" />
              </PosLink>

              {/* Submenu */}
              {link.subitems && (
                <ul
                  className={`transition-all  duration-300 ${
                    openSubMenuIndex === index
                      ? "opacity-100 max-h-40"
                      : "opacity-0 max-h-0 overflow-hidden"
                  } ${isOpen ? "w-full  " : "absolute left-[13rem] bg-[#4F7942] rounded-md p-2 z-20"} flex justify-center  items-center  flex-col gap-1`}
                >
                  {link.subitems.map((subItem, subIndex) => (
                    <li key={subIndex} className="w-full px-1 ">
                      <Link
                        to={subItem.href}
                        className="block text-sm hover:bg-[#4CBB17] w-full   rounded-lg p-2 cursor-pointer text-white"
                      >
                        <span className="ml-13 text-xs">{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

            </div>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden min-h-screen">
        {/* <div className="bg-[#4F7942] mx-2 border-l-1 rounded-md mt-1 h-10"></div> */}
        <Outlet />
      </div>
    </div>
  );
};

export default Pos;
