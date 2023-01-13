import React from 'react';
import NavItem from './elements/navItem';
import { BsSearch } from 'react-icons/bs';
import { TbMicrophone2 } from 'react-icons/tb';
import { AiFillHome } from 'react-icons/ai';
import { MdOutlineHistory } from 'react-icons/md';
import styles from '@style/components/navbar.module.scss';
import { PartyCode } from '@common/types/partyCode';
import { HiOutlineQueueList } from 'react-icons/hi2';
import { useWindowSize } from '@hook/useWindowSize';
import { PagePath } from '@common/pagePath';

interface Props {
  partyCode: PartyCode;
}

/**
 * A party-intern navigation bar
 * @constructor
 */
export default function Navbar({ partyCode }: Props) {
  const windowSize = useWindowSize();

  return (
    <div className={styles.navbar}>
      <NavItem
        icon={<AiFillHome />}
        text='Home'
        linkTarget={PagePath.partyHome(partyCode)}
      />
      <NavItem
        icon={<TbMicrophone2 />}
        text='Lyrics'
        linkTarget={PagePath.partyLyrics(partyCode)}
      />
      <NavItem
        icon={<BsSearch />}
        text='Add'
        linkTarget={PagePath.partyAdd(partyCode)}
      />
      <NavItem
        icon={<HiOutlineQueueList />}
        text='Queue'
        linkTarget={PagePath.partyQueue(partyCode)}
      />
      <NavItem
        icon={<MdOutlineHistory />}
        text='History'
        linkTarget={PagePath.partyHistory(partyCode)}
      />
    </div>
  );
}
