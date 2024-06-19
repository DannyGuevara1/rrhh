import React from "react";

const StepIndicator = ({ stepNumber, title, isActive }) => {
  return (
    <div
      className={`flex mt-5 mb-5 mx-0 items-center ${isActive ? "text-white bg-gray-700 rounded-lg" : "text-gray-500"}`}
    >
      <div className="rounded-full w-8 h-8 flex justify-center items-center mr-5">{stepNumber}</div>
      <div className="font-bold">{title}</div>
    </div>
  );
};

export default StepIndicator;
