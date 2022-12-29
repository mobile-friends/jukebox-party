import React from 'react';

interface Props {
  text?: string;
  type: string;
  icon?: any;
  onClick: (e: any) => void;
}

export default function Button({ text, type, icon, onClick }: Props) {
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
}
