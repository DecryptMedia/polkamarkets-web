import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import classNames from 'classnames';
import type { UserOperation } from 'types/user';

import { CheckIcon, InfoIcon, RemoveOutlinedIcon } from 'assets/icons';

import Icon from 'components/Icon';

import type { TradeContextState } from 'contexts/trade';

import { useDrawer } from 'hooks';

import { Button } from '../Button';
import styles from './Operation.module.scss';

type OperationProps = Partial<UserOperation> & {
  view?: 'card' | 'toast';
  showViewAll?: boolean;
  dismissable?: boolean;
  onDismiss?: () => void;
  style?: React.CSSProperties;
  trade?: TradeContextState;
};

function Operation({
  status,
  action,
  marketSlug,
  marketTitle,
  marketId,
  outcomeTitle,
  outcomeId,
  networkId,
  value,
  ticker,
  view = 'card',
  showViewAll = false,
  dismissable = false,
  onDismiss,
  style,
  trade
}: OperationProps) {
  const history = useHistory();
  const location = useLocation();

  const { open, close } = useDrawer(state => state);

  const handleRetry = useCallback(() => {
    trade?.set({
      status: 'error',
      trade: {
        ...trade.trade,
        market: `${marketId || 231}`,
        outcome: `${outcomeId || 0}`,
        network: `${networkId || 80001}`
      }
    });

    history.push(`/markets/${marketSlug}`, { from: location.pathname });
    close();
  }, [
    close,
    history,
    location.pathname,
    marketId,
    marketSlug,
    networkId,
    outcomeId,
    trade
  ]);

  return (
    <div
      className={classNames(styles.root, {
        [styles.rootCard]: view === 'card',
        [styles.rootToast]: view === 'toast',
        [styles.pending]: status === 'pending',
        [styles.success]: status === 'success',
        [styles.failed]: status === 'failed'
      })}
      style={style}
    >
      {dismissable && (
        <Button
          variant="ghost"
          className={styles.dismiss}
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <RemoveOutlinedIcon />
        </Button>
      )}
      <span className={styles.status}>
        {status === 'pending' && (
          <>
            <Icon name="Loading" />
            Pending
          </>
        )}
        {status === 'success' && (
          <>
            <CheckIcon />
            Success
          </>
        )}
        {status === 'failed' && (
          <>
            <InfoIcon />
            Failed
          </>
        )}
      </span>
      {action === 'buy' && (
        <p
          className={styles.action}
        >{`Bought ${value} ${ticker} of outcome ${outcomeTitle}`}</p>
      )}
      {action === 'sell' && (
        <p
          className={styles.action}
        >{`Sold ${value} ${ticker} of outcome ${outcomeTitle}`}</p>
      )}
      <p className={styles.market}>{marketTitle}</p>
      <div className={styles.footer}>
        {showViewAll && (
          <button
            type="button"
            className={classNames('pm-c-button--xs', styles.viewTransactions)}
            onClick={open}
          >
            View transactions
          </button>
        )}
        {status === 'failed' && (
          <Button size="xs" color="danger" onClick={handleRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

export default Operation;
