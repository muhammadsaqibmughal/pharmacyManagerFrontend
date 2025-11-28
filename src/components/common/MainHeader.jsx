import { useNavigate } from "react-router-dom";

const MainHeader = ({
  backButton,
  title,
  buttonText,
  buttons,
  onButtonClick,
  theme,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
      {backButton && (
        <div className="flex justify-start mb-4">
          <button
            onClick={onButtonClick}
            className="px-4 py-2 bg-bg-50 hover:bg-selected-50 text-white rounded-full"
          >
            {backButton}
          </button>
        </div>
      )}

      <h2
        className={`text-2xl font-bold ${
          theme === "dark" ? "text-white/90" : "text-primary-50"
        }`}
      >
        {title}
      </h2>

      <div className="flex gap-3 items-center w-full md:w-auto">
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full"
          >
            {buttonText}
          </button>
        )}
        {buttons?.map((button, id) => (
          <button
            key={id}
            onClick={button.onClick}
            className="bg-bg-50 hover:bg-selected-50 cursor-pointer text-white px-4 py-1 h-10 rounded-full"
          >
            {button.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainHeader;
