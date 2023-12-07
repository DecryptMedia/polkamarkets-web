import { useCallback, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import cn from 'classnames';
import { pages, community, ui, features } from 'config';
import getPathname from 'helpers/getPathname';
import isEmpty from 'lodash/isEmpty';
import { useTheme } from 'ui';

import * as Logos from 'assets/icons';
import { ReactComponent as V2Badge } from 'assets/icons/svgs/v2-badge.svg';

import { Button } from 'components/Button';
import CreateMarket from 'components/CreateMarket';
import Feature from 'components/Feature';
import HelpButton from 'components/HelpButton';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import NetworkSelector from 'components/NetworkSelector';
import ProfileSignin from 'components/ProfileSignin';
import Text from 'components/Text';

import useAppSelector from 'hooks/useAppSelector';

import headerNavClasses from './HeaderNav.module.scss';

const LogoComponent = ui.logo ? Logos[ui.logo] : null;
const headerNavMenu = Object.values(pages)
  .filter(page => page.enabled && page.navigation)
  .reverse();

function HeaderNavModal({
  children
}: {
  children: (arg: () => void) => React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const handleHide = useCallback(() => setShow(false), []);

  return (
    <>
      <Button
        className={headerNavClasses.menu}
        size="xs"
        variant="ghost"
        onClick={() => setShow(true)}
      >
        <Icon name="Menu" size="lg" title="Open Menu" />
      </Button>
      <Modal
        show={show}
        fullScreen
        fullWidth
        className={{
          dialog: headerNavClasses.dialog
        }}
      >
        <header className={headerNavClasses.header}>
          <Button
            size="xs"
            variant="ghost"
            onClick={handleHide}
            className={headerNavClasses.hide}
          >
            <Icon name="Cross" size="lg" title="Close Menu" />
          </Button>
        </header>
        {children(handleHide)}
        <footer className={headerNavClasses.footer}>
          {ui.layout.header.communityUrls.enabled && !isEmpty(community) ? (
            <div>
              <Text
                color="gray"
                scale="tiny-uppercase"
                fontWeight="bold"
                className={headerNavClasses.title}
              >
                Join our community
              </Text>
              <ul className={headerNavClasses.socials}>
                {community.map(social => (
                  <li key={social.name}>
                    <Text
                      // @ts-ignore
                      as="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={headerNavClasses.social}
                    >
                      <Icon
                        title={social.name}
                        name={social.name}
                        className={headerNavClasses.icon}
                      />
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Feature name="regular">
            <CreateMarket
              fullwidth
              className={headerNavClasses.createMarket}
              onCreateClick={handleHide}
            />
          </Feature>
        </footer>
      </Modal>
    </>
  );
}
function HeaderNavMenu({
  onMenuItemClick,
  children
}: React.PropsWithChildren<{
  onMenuItemClick?(): void;
}>) {
  return (
    <ul className={headerNavClasses.list}>
      {headerNavMenu.map(page => (
        <li key={page.name} className={headerNavClasses.item}>
          <NavLink
            to={page.pathname}
            className={headerNavClasses.link}
            activeClassName={headerNavClasses.active}
            onClick={onMenuItemClick}
            isActive={(_, location) =>
              !!location.pathname.match(getPathname(page.pathname))
            }
          >
            {page.name}
          </NavLink>
        </li>
      ))}
      {children}
    </ul>
  );
}
function HeaderNavMenuModal() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);

  return (
    <HeaderNavModal>
      {handleHide => (
        <HeaderNavMenu onMenuItemClick={handleHide}>
          {features.fantasy.enabled && !isLoggedIn && ui.layout.header.helpUrl && (
            <li className={headerNavClasses.item}>
              <HelpButton
                $outline
                $fullWidth
                onClick={handleHide}
                href={ui.layout.header.helpUrl}
              />
            </li>
          )}
        </HeaderNavMenu>
      )}
    </HeaderNavModal>
  );
}
export default function HeaderNav() {
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const theme = useTheme();
  const showLeftMenu =
    theme.device.isDesktop && !theme.device.isTv && !!headerNavMenu.length;

  return (
    <nav className={headerNavClasses.root}>
      {showLeftMenu && <HeaderNavMenuModal />}
      <Link
        to="/"
        aria-label="Homepage"
        className={cn(headerNavClasses.logos, {
          [headerNavClasses.logosGutter]: showLeftMenu
        })}
      >
        {LogoComponent ? (
          <LogoComponent />
        ) : (
          <>
            <Logos.PolkamarketsLogo />
            <V2Badge className={headerNavClasses.logosBadge} />
          </>
        )}
      </Link>
      {theme.device.isTv && <HeaderNavMenu />}
      {!theme.device.isDesktop && ui.layout.header.networkSelector.enabled && (
        <NetworkSelector
          size="sm"
          responsive
          className={headerNavClasses.network}
        />
      )}
      {!theme.device.isDesktop && features.fantasy.enabled && !isLoggedIn && (
        <ProfileSignin variant="normal" color="primary" size="xs">
          <Icon name="Profile" size="md" />
          <Text as="span" scale="caption">
            Sign in
          </Text>
        </ProfileSignin>
      )}
      {!theme.device.isDesktop &&
        ((features.fantasy.enabled && !!ui.layout.header.helpUrl) ||
          !!headerNavMenu.length) && <HeaderNavMenuModal />}
    </nav>
  );
}
