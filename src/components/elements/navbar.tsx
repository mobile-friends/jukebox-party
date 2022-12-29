import React from 'react';
import NavItem from './navItem';
import { BsSearch } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineQueueMusic } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface Props {}

/**
 * A party-intern navigation bar
 * @constructor
 */
export default function Navbar({}: Props) {
  const route = useRouter().pathname;
  /*
   Since this component is used on a protected page we can assume,
   that the user is logged in, and we have a session
  */
  const { data } = useSession();
  const partyCode = data!.user.partyCode;

  // Points to the home-page of the current party
  const partyUrl = `/party/${partyCode}`;

  return (
    <div className='navbar'>
      <NavItem
        icon={<AiFillHome />}
        text='Home'
        isActive={route === '/party/[code]'}
        directTo={partyUrl}
      />
      <NavItem
        icon={<BsSearch />}
        text='Add'
        isActive={route === '/party/[code]/add'}
        directTo={`${partyUrl}/add`}
      />
      <NavItem
        icon={<MdOutlineQueueMusic />}
        text='Queue'
        isActive={route === '/party/[code]/queue'}
        directTo={`${partyUrl}/queue`}
      />
    </div>
  );
}
