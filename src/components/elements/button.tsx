import React from 'react';

type ClickListener = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void | Promise<void>;

interface Props {
  text?: string;
  type: string;
  icon?: any;
  onClick: ClickListener;
}

export default function Button({ text, type, icon, onClick }: Props) {
  async function onClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    await onClick(e);
  }

  return (
    <div>
      <button className={`btn ${type}`} onClick={onClicked}>
        {icon ? <div>{icon}</div> : ''}
        {text ? <div>{text}</div> : ''}
      </button>
    </div>
  );
}
