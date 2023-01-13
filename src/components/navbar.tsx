import React from 'react';
import NavItem from './elements/navItem';
import { BsSearch } from 'react-icons/bs';
import { TbMicrophone2 } from 'react-icons/tb';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineHistory, MdOutlineQueueMusic } from 'react-icons/md';
import styles from '@style/components/navbar.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { HiOutlineQueueList } from 'react-icons/hi2';
import { useWindowSize } from '@hook/useWindowSize';

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
  const windowSize = useWindowSize();

  return (
    <div className={styles.navbar}>
      <NavItem icon={<AiFillHome />} text='Home' linkTarget={partyUrl} />
      <NavItem
        icon={<TbMicrophone2 />}
        text='Lyrics'
        linkTarget={`${partyUrl}/lyrics`}
      />
      <NavItem icon={<BsSearch />} text='Add' linkTarget={`${partyUrl}/add`} />
      <NavItem
        icon={<HiOutlineQueueList />}
        text='Queue'
        linkTarget={`${partyUrl}/queue`}
      />
      <NavItem
        icon={<MdOutlineHistory />}
        text='History'
        linkTarget={`${partyUrl}/history`}
      />
    </div>
  );
}
