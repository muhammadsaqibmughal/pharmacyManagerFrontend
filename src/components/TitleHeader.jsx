import React from "react";
import { useTheme } from "../theme-support/ThemeContext";

const TitleHeader = ({ title, sub }) => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center  justify-center ">
      <div className="flex flex-col gap-5 mt-10 items-center justify-center">
        <p
          className={`font-semibold text-sm md:text-base text-nowrap bg-bg-50 p-2 px-5 rounded-full ${
            theme === "dark" ? "text-white/90" : " text-white/90"
          } `}
        >
          {title}
        </p>
        <h2
          className={`font-semibold md:text-4xl  text-xl ${
            theme === "dark" ? "text-white/90" : " text-primary-50"
          } `}
        >
          {sub}
        </h2>
      </div>
    </div>
  );
};

export default TitleHeader;
