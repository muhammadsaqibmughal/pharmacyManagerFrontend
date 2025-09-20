import { Link } from "react-router-dom";

const PosLink = ({ isOpen, name, onClick, children, href }) => {
  const classes = `flex items-center font-semibold text-xs rounded cursor-pointer hover:-translate-x-2 transition-transform duration-300 stroke-[0.75] hover:bg-[#4CBB17] text-sm ${
    isOpen ? "bg-[#4F7942] p-2 ml-3" : "p-2 gap-5"
  }`;

  return (
    <Link to={href || "#"} onClick={onClick}>
      <div className={classes}>
        {children}
        {isOpen && <p className="ml-5 overflow-clip whitespace-nowrap tracking-wide text-white">{name}</p>}
      </div>
    </Link>
  );
};

export default PosLink;
