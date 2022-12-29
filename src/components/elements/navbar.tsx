import React from 'react';
import NavItem from './navItem';
import { BsSearch } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineQueueMusic } from 'react-icons/md';
import { useSession } from 'next-auth/react';

interface Props {}

/**
 * A party-intern navigation bar
 * @constructor
 */
export default function Navbar({}: Props) {
  /*
   Since this component is used on a protected page we can assume,
   that the user is logged in, and we have a session
  */
  const { data, status } = useSession();
  const partyCode = data!.user.partyCode;

  // Points to the home-page of the current party
  const partyUrl = `/party/${partyCode}`;

  return (
    <div className='navbar'>
      <NavItem icon={<AiFillHome />} text='Home' linkTarget={partyUrl} />
      <NavItem icon={<BsSearch />} text='Add' linkTarget={`${partyUrl}/add`} />
      <NavItem
        icon={<MdOutlineQueueMusic />}
        text='Queue'
        linkTarget={`${partyUrl}/queue`}
      />
    </div>
  );
}
