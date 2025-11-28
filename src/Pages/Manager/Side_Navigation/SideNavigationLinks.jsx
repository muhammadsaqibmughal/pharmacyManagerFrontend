import { Link } from "react-router-dom";

const PosLink = ({ isOpen, name, onClick, children, href, isActive }) => {
  const classes = `
    flex items-center font-semibold text-xs rounded cursor-pointer
    hover:-translate-x-2 transition-transform duration-300 stroke-[0.75] text-sm
    ${isOpen ? "p-2 ml-3" : "p-2 gap-5"}
    ${isActive ? "bg-selected-50" : "bg-bg-50 hover:bg-selected-50"}
  `;

  return (
    <Link to={href || "#"} onClick={onClick} className={classes}>
      {children}
      {isOpen && (
        <p className="ml-5 overflow-clip whitespace-nowrap tracking-wide text-white">
          {name}
        </p>
      )}
    </Link>
  );
};

export default PosLink;
