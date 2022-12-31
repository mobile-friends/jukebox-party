import React from 'react';

type Props = {
  partyName: string;
  partyCode: string;
};

export default function QueueHeader({ partyName, partyCode }: Props) {
  return (
    <div className='container'>
      <p>Code: {partyCode}</p>
      <h1>{partyName}</h1>
    </div>
  );
}
