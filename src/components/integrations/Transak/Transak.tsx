import { useReducer, useEffect, useMemo } from 'react';

import TransakSDK from '@transak/transak-sdk';
import { environment } from 'config';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import { TransakConfig } from 'types/integrations/transak';

import { useAppSelector, useNetwork } from 'hooks';

import { Button } from '../../Button';

type TransakInitialState = {
  widgetOpen: boolean;
  loading: boolean;
  error: string | null;
};

type TransakActionState =
  | 'TRANSAK_WIDGET_INITIALISED'
  | 'TRANSAK_WIDGET_OPEN'
  | 'TRANSAK_WIDGET_CLOSE'
  | 'TRANSAK_ORDER_CREATED'
  | 'TRANSAK_ORDER_CANCELLED'
  | 'TRANSAK_ORDER_FAILED'
  | 'TRANSAK_ORDER_SUCCESSFUL';

const initialState: TransakInitialState = {
  widgetOpen: false,
  loading: false,
  error: null
};

type TransakAction = {
  type: TransakActionState;
};

function transakReducer(state: TransakInitialState, action: TransakAction) {
  const { type } = action;

  switch (type) {
    case 'TRANSAK_WIDGET_INITIALISED':
      return {
        ...state,
        widgetOpen: true
      };
    case 'TRANSAK_WIDGET_OPEN':
      return {
        ...state,
        widgetOpen: true
      };
    case 'TRANSAK_WIDGET_CLOSE':
      return {
        ...state,
        widgetOpen: false
      };
    case 'TRANSAK_ORDER_CREATED':
      return {
        ...state,
        loading: true
      };
    case 'TRANSAK_ORDER_CANCELLED':
      return {
        ...state,
        loading: false
      };
    case 'TRANSAK_ORDER_FAILED':
      return {
        ...state,
        loading: false,
        error: 'Order failed'
      };
    case 'TRANSAK_ORDER_SUCCESSFUL':
      return {
        ...state,
        loading: false,
        error: null
      };

    default:
      return {
        ...state
      };
  }
}

const transakEnviroments = ['STAGING', 'PRODUCTION'] as const;

function isValidApiKey(transakApiKey?: string) {
  return !isUndefined(transakApiKey) && !isEmpty(transakApiKey);
}

function isValidEnvironment(
  transakEnvironment?
): transakEnvironment is typeof transakEnviroments[number] {
  return transakEnviroments.includes(transakEnvironment);
}

const baseConfig: TransakConfig = {
  apiKey: environment.TRANSAK_API_KEY,
  environment: environment.TRANSAK_ENVIRONMENT,
  themeColor: '000000',
  hostURL: window.location.origin,
  widgetHeight: '700px',
  widgetWidth: '500px'
};

function buildCustomConfig({
  cryptoCurrencyCode,
  walletAddress
}): TransakConfig {
  return { ...baseConfig, cryptoCurrencyCode, walletAddress };
}

const isValidCustomConfig = (customConfig: TransakConfig) =>
  isValidApiKey(customConfig.apiKey) &&
  isValidEnvironment(customConfig.environment);

function Transak() {
  const { network } = useNetwork();
  const walletAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  const [transakState, transakDispatch] = useReducer(
    transakReducer,
    initialState
  );

  const transak = useMemo(() => {
    const transakConfig = buildCustomConfig({
      cryptoCurrencyCode: network.currency.ticker,
      walletAddress
    });

    const isValidConfig = isValidCustomConfig(transakConfig);

    if (!isValidConfig) return undefined;

    return new TransakSDK(transakConfig);
  }, [network, walletAddress]);

  useEffect(() => {
    if (transak) {
      transak.on(transak.ALL_EVENTS, data => {
        transakDispatch({ type: data.eventName });
      });
    }
  }, [transak]);

  function openWidget() {
    transak.init();
  }

  if (!transak) return null;

  return (
    <Button
      size="sm"
      style={{ padding: '0.5rem 1rem' }}
      color="primary"
      onClick={openWidget}
      loading={transakState.loading}
      disabled={transakState.widgetOpen}
    >
      {`Buy $${network.currency.ticker}`}
    </Button>
  );
}

export default Transak;
