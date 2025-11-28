import { FaSpinner } from "react-icons/fa";

const Loader = ({ size = "7xl" }) => (
  <div className="flex justify-center py-10">
    <FaSpinner className={`animate-spin text-blue-500 text-${size}`} />
  </div>
);

export default Loader;
