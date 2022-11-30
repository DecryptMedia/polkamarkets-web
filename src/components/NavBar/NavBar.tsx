import { Link } from 'react-router-dom';

import cn from 'classnames';
import { Container, useMedia } from 'ui';

import { IlluminateFantasyLeagueLogo } from 'assets/icons';

import NavBarClasses from './NavBar.module.scss';
import NavBarActionsInfo from './NavBarActionsInfo';
import NavBarActionsNetwork from './NavBarActionsNetwork';
import NavBarActionsTheme from './NavBarActionsTheme';
import NavBarLinks from './NavBarLinks';

export default function NavBar() {
  const isDesktop = useMedia('(min-width: 1024px)');

  return (
    <Container as="header" className="pm-l-layout__header">
      <Link to="/" aria-label="Homepage" className="pm-l-layout__header__logos">
        <IlluminateFantasyLeagueLogo />
      </Link>
      {isDesktop && <NavBarLinks />}
      <div
        className={cn('pm-l-layout__header__actions', NavBarClasses.actions)}
      >
        {isDesktop && (
          <>
            <NavBarActionsInfo />
            <NavBarActionsNetwork />
          </>
        )}
        <NavBarActionsTheme />
      </div>
    </Container>
  );
}

NavBar.displayName = 'NavBar';
