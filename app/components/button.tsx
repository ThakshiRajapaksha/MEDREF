import React, { MouseEventHandler } from 'react';

// Define the props for the Button component
interface ButtonProps {
  label: string;
  color?: 'blue' | 'red' | 'green' | 'gray'; // Define color prop as specific colors
  onClick?: MouseEventHandler<HTMLButtonElement>; // Make onClick optional
  type?: 'button' | 'submit' | 'reset'; // Allow type prop with HTML button types
}

const Button: React.FC<ButtonProps> = ({
  label,
  color = 'blue',
  onClick,
  type = 'button',
}) => {
  // Use Tailwind CSS utility classes for the button styles
  const baseClasses = 'text-white px-4 py-2 rounded';

  // Map the color prop to Tailwind classes
  // eslint-disable-next-line no-unused-vars
  const colorClasses: { [_ in 'blue' | 'red' | 'green' | 'gray']: string } = {
    blue: 'bg-blue-500 hover:bg-blue-700',
    red: 'bg-red-500 hover:bg-red-700',
    green: 'bg-green-500 hover:bg-green-700',
    gray: 'bg-gray-500 hover:bg-gray-700',
  };

  return (
    <button
      type={type} // Pass the type prop here
      className={`${baseClasses} ${colorClasses[color]} mr-4`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
