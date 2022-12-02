import React from 'react';

interface ButtonProps {
  text: string;
  type: string;
  onClick?: (e) => void;
}

const Button = ({ text, type, onClick }: ButtonProps): JSX.Element => {
  return (
    <div>
      <button
        className={`btn ${type} block`}
        onClick={(e) => {
          e.preventDefault();
          if (onClick !== undefined) onClick(e);
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
