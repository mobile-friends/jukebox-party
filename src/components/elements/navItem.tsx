import Link from 'next/link';
import React from 'react';

interface NavItemProps {
  text: string;
  icon: any;
  directTo: string;
  isActive: boolean;
}

const NavItem = ({
  text,
  icon,
  directTo,
  isActive,
}: NavItemProps): JSX.Element => {
  return (
    <Link
      href={{ pathname: directTo }}
      className={`navbarItem ${isActive ? 'active' : ''}`}
    >
      <div className='icon-container'>{icon}</div>
      <div className='text-container'>{text}</div>
    </Link>
  );
};

export default NavItem;
