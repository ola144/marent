import React, { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-lg font-medium text-black dark:text-white ">
          {label}
        </label>
      )}
      <input
        className="border-b border-gray-300 text-gray-300 py-2 outline-none w-full dark:bg-gray-500 dark:border-gray-400"
        {...props}
      />
    </div>
  );
};
