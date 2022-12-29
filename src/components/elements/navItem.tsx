import Link from 'next/link';
import React from 'react';
import { useRouterPath } from '@hook/useRouterPath';

interface Props {
  /**
   * The text to display below the icon
   */
  text: string;
  /**
   * The icon to display on the item
   */
  icon: JSX.Element;
  /**
   * A path to redirect to on click
   */
  linkTarget: string;
}

/**
 * A link inside the nav-bar
 * @constructor
 */
export default function NavItem({ text, icon, linkTarget }: Props) {
  /*
   Get the current url-path eg. /parties/123456/
   If we are currently on the page that the item redirects to,
   then we should highlight it
  */
  const path = useRouterPath();
  const isCurrentlyOnTarget = path === linkTarget;
  const activeStyle = isCurrentlyOnTarget ? ' active' : '';

  return (
    <Link
      href={{ pathname: linkTarget }}
      className={`navbarItem${activeStyle}`}
    >
      <div className='icon-container'>{icon}</div>
      <div className='text-container'>{text}</div>
    </Link>
  );
}
