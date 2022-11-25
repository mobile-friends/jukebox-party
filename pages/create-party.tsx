import React, { useState } from 'react';
import Input from '../components/elements/input';
import Button from '../components/elements/button';
import { createParty } from '../httpClient/jukebox/parties';
import { Party } from '../lib/party';
import { useRouter } from 'next/router';

type Props = {};

function CreateParty({}: Props) {
  const router = useRouter();
  const [partyName, setPartyName] = useState<string>('');
  const [partyHostName, setPartyHostName] = useState<string>('');
  return (
    <div>
      <h1>Create Party</h1>
      <form>
        <Input
          placeholder='Party Name'
          onChange={(e) => {
            setPartyName(e.target.value);
          }}
        />
        <Input
          placeholder='Host Name'
          onChange={(e) => {
            setPartyHostName(e.target.value);
          }}
        />
        <Button
          text='Create session'
          type='primary'
          onClick={async () => {
            const party: Party = await createParty(partyName, partyHostName);
            router.push(`/party/${encodeURIComponent(party.code)}`);
          }}
        />
      </form>
    </div>
  );
}

export default CreateParty;
