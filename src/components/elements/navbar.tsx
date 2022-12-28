import React from 'react';
import NavItem from './navItem';

import { BsSearch } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineQueueMusic } from 'react-icons/md';

import { useRouter } from 'next/router';
import { PartyCode } from '@common/types/partyCode';

interface Props {
  partyCode: PartyCode;
}

export default function Navbar({ partyCode }: Props) {
  const route = useRouter().pathname;

  return (
    <div className='navbar'>
      <NavItem
        icon={<AiFillHome />}
        text='Home'
        isActive={route === '/party/[code]'}
        directTo={`/party/${partyCode}`}
      />
      <NavItem
        icon={<BsSearch />}
        text='Add'
        isActive={route === '/party/[code]/add'}
        directTo={`/party/${partyCode}/add`}
      />
      <NavItem
        icon={<MdOutlineQueueMusic />}
        text='Queue'
        isActive={route === '/party/[code]/queue'}
        directTo={`/party/${partyCode}/queue`}
      />
    </div>
  );
}
