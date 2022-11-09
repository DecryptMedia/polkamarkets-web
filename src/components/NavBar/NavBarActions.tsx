import { useCallback, useState } from 'react';

import { Adornment, List, ListItem, ListItemText } from 'ui';

import { Button } from 'components/Button';
import ConnectMetamask from 'components/ConnectMetamask';
import Icon from 'components/Icon';
import type { IconProps } from 'components/Icon';
import Modal from 'components/Modal';
import WalletInfo from 'components/WalletInfo';

import { useAppSelector, useTheme } from 'hooks';

import NavbarClasses from './NavBar.module.scss';

const arrChains = ['Ethereum', 'Binance', 'Moonriver'] as Array<
  IconProps['name']
>;

export default function NavBarActions() {
  const theme = useTheme();
  const isLoggedIn = useAppSelector(state => state.polkamarkets.isLoggedIn);
  const [show, setShow] = useState(false);
  const [appChain, setAppChain] = useState<IconProps['name']>('Ethereum');
  const handleHide = useCallback(() => setShow(false), []);
  const handleAppChain = useCallback(
    _chain => () => {
      handleHide();
      setAppChain(_chain);
    },
    [handleHide]
  );
  const isThemeDark = theme.theme === 'dark';
  const themeAnti = isThemeDark ? 'light' : 'dark';

  function handleTheme() {
    theme.setTheme(themeAnti);
  }
  function handleChains() {
    setShow(true);
  }

  return (
    <>
      <div className="pm-l-layout__header__actions">
        {isLoggedIn ? <WalletInfo /> : <ConnectMetamask />}
        <Button
          variant="outline"
          color="default"
          aria-label="Switch theme"
          onClick={handleTheme}
        >
          <Icon name={isThemeDark ? 'Sun' : 'Moon'} />
        </Button>
        <Button
          variant="outline"
          color="default"
          aria-label="Switch chain"
          onClick={handleChains}
        >
          <Icon name={appChain} />
        </Button>
      </div>
      <Modal
        show={show}
        onHide={handleHide}
        className={{
          dialog: NavbarClasses.widget
        }}
      >
        <List $rounded>
          {arrChains.map(chain => (
            <ListItem
              key={chain}
              onClick={handleAppChain(chain)}
              role="button"
              tabIndex={0}
            >
              <Adornment edge="start">
                <Icon name={chain} />
              </Adornment>
              <ListItemText>{chain}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Modal>
    </>
  );
}
