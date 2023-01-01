import React from 'react';
import NavItem from './elements/navItem';
import { BsSearch } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineQueueMusic } from 'react-icons/md';
import styles from '@style/components/navbar.module.scss';
import { PartyCode } from '@common/types/partyCode';

interface Props {
  partyCode: PartyCode;
}

/**
 * A party-intern navigation bar
 * @constructor
 */
export default function Navbar({ partyCode }: Props) {
  // Points to the home-page of the current party
  const partyUrl = `/party/${partyCode}`;

  return (
    <div className={styles.navbar}>
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
