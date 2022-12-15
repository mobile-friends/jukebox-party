import { ChangeEvent } from 'react';

interface InputProps {
  type?: string;
  placeholder: string;
  value?: string;
  hasError?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type,
  placeholder,
  value,
  hasError,
  onChange,
}: InputProps): JSX.Element {
  return (
    <div>
      <input
        type={type}
        placeholder={`${placeholder}`}
        className={`input block ${hasError ? 'input-error' : ''}`}
        value={value}
        onChange={(e) => {
          if (onChange !== undefined) onChange(e);
        }}
      ></input>
    </div>
  );
}
