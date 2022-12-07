import { ChangeEvent } from 'react';

interface InputProps {
  type?: string;
  placeholder: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type,
  placeholder,
  onChange,
}: InputProps): JSX.Element {
  return (
    <div>
      <input
        type={type}
        placeholder={`${placeholder}`}
        className='input block'
        onChange={(e) => {
          if (onChange !== undefined) onChange(e);
        }}
      ></input>
    </div>
  );
}
