import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "primary2" | "secondary" | "outline";
}

const baseClass =
  "px-3 py-2 rounded font-semibold focus:outline-none focus:ring-2 text-xs";
const variants: Record<string, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
  primary2: "bg-blue-300 text-white hover:bg-blue-400 focus:ring-blue-300",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...rest
}) => {
  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
