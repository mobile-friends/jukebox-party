import router from 'next/router';
import React from 'react';
import Button from './button';

type Props = {
  partyName: string | null;
  partyCode: string | null;
};

export default function QueueHeader({ partyName, partyCode }: Props) {
  return (
    <div>
      <div className='container'>
        {/* <Button text='go back' type='secondary' onClick={() => router.back()} /> */}
        <p>Code: {partyCode}</p>
        <h1>{partyName}</h1>
      </div>
    </div>
  );
}
