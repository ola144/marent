import React, { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-lg font-medium text-black dark:text-white ">
          {label}
        </label>
      )}
      <select
        className="border-b border-gray-300 text-gray-300 py-2 outline-none w-full dark:bg-gray-500 dark:border-gray-400"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
