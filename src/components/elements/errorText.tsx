interface ErrorTextProps {
  errorText: string;
}

export default function ErrorText({ errorText }: ErrorTextProps): JSX.Element {
  return <p className='text-error'>{errorText}</p>;
}
