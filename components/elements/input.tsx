interface InputProps {
  type?: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        className='block'
        onChange={(e) => {
          onChange(e);
        }}
      ></input>
    </div>
  );
}
