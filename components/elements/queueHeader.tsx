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
      <div>
        <Button text='go back' type='secondary' onClick={() => router.back()} />
        <h1>{partyName}</h1>
        <h2>Code: {partyCode}</h2>
      </div>
    </div>
  );
}
