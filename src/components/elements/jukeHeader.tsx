interface Props {
  first: string;
  second: string;
}

export default function JukeHeader({ first, second }: Props) {
  return (
    <h1 className='text-center'>
      {first}.<span className='text-primary text-italic'>{second}</span>
    </h1>
  );
}
