import React from 'react';

interface ButtonProps {
  text?: string;
  type: string;
  icon?: any;
  onClick: (e: any) => void;
}

const Button = ({ text, type, icon, onClick }: ButtonProps): JSX.Element => {
  return (
    <div>
      <button
        className={`btn ${type}`}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {icon ? <div>{icon}</div> : ''}
        {text ? <div>{text}</div> : ''}
      </button>
    </div>
  );
};

export default Button;
