import React, { useEffect, useState } from 'react';
import NavItem from './navItem';

import { BsSearch } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineQueueMusic } from 'react-icons/md';

import { useRouter } from 'next/router';

const Navbar = (): JSX.Element => {
  const [partyCode, setPartyCode] = useState<string>('');
  const route = useRouter().pathname;

  useEffect(() => {
    let partyCode = sessionStorage.getItem('partyCode');
    if (partyCode === null) partyCode = '404';
    setPartyCode(partyCode);
  });

  return (
    <div className='navbar'>
      <NavItem
        icon={<AiFillHome />}
        text='Home'
        isActive={route === '/party/[code]' ? true : false}
        directTo={`/party/${partyCode}`}
      />
      <NavItem
        icon={<BsSearch />}
        text='Add'
        isActive={route === '/search-track' ? true : false}
        directTo={`/search-track`}
      />
      <NavItem
        icon={<MdOutlineQueueMusic />}
        text='Queue'
        isActive={route === '/party/queue' ? true : false}
        directTo={`/party/queue`}
      />
    </div>
  );
};

export default Navbar;
