import React, { useEffect, useState, useCallback } from 'react';

import {
  setTradeAmount,
  setMaxAmount,
  setTradeDetails
} from 'redux/ducks/trade';

import { WalletIcon } from 'assets/icons';

import { useAppSelector, useAppDispatch } from 'hooks';
import useCurrency from 'hooks/useCurrency';

import StepSlider from '../StepSlider';
import Text from '../Text';
import { calculateTradeDetails } from './utils';

function TradeFormInput() {
  const { name, ticker, icon } = useCurrency();
  const dispatch = useAppDispatch();
  const type = useAppSelector(state => state.trade.type);
  const label = `${type} shares`;

  const selectedMarketId = useAppSelector(
    state => state.trade.selectedMarketId
  );

  const selectedOutcomeId = useAppSelector(
    state => state.trade.selectedOutcomeId
  );

  // buy and sell have different maxes
  const balance = useAppSelector(state => state.bepro.ethBalance);
  const portfolio = useAppSelector(state => state.bepro.portfolio);
  const market = useAppSelector(state => state.market.market);
  const outcome = market.outcomes[selectedOutcomeId];

  const roundDown = (value: number) => Math.floor(value * 1e5) / 1e5;

  // TODO: improve this
  const max = useCallback(() => {
    let maxAmount = 0;

    // max for buy actions - eth balance
    if (type === 'buy') {
      maxAmount = balance;
    }
    // max for sell actions - number of outcome shares
    else if (type === 'sell') {
      maxAmount =
        portfolio[selectedMarketId]?.outcomes[selectedOutcomeId]?.shares || 0;
    }

    // rounding (down) to 5 decimals
    return roundDown(maxAmount);
  }, [type, balance, portfolio, selectedMarketId, selectedOutcomeId]);

  const [amount, setAmount] = useState<number | undefined>(0);
  const [stepAmount, setStepAmount] = useState<number>(0);

  useEffect(() => {
    dispatch(setMaxAmount(max()));
  }, [dispatch, max, type]);

  useEffect(() => {
    dispatch(setTradeAmount(0));
    setAmount(0);
    setStepAmount(0);
  }, [dispatch, type]);

  useEffect(() => {
    if (![type, market, outcome, amount].includes(undefined)) {
      const tradeDetails = calculateTradeDetails(type, market, outcome, amount);

      dispatch(setTradeDetails(tradeDetails));
    }
  }, [dispatch, type, market, outcome, amount]);

  function handleChangeAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    const newAmount = value ? parseFloat(value) : undefined;

    setAmount(newAmount);
    dispatch(setTradeAmount(newAmount || 0));
    setStepAmount(100 * ((newAmount || 0) / max()));
  }

  function handleSetMaxAmount() {
    const newMax = max();

    setAmount(newMax);
    dispatch(setTradeAmount(newMax));
    setStepAmount(100);
  }

  function handleChangeSlider(value: number) {
    const percentage = value / 100;

    const newAmount = roundDown(max() * percentage);

    setAmount(newAmount);
    dispatch(setTradeAmount(newAmount));
    setStepAmount(value);
  }

  return (
    <form className="pm-c-trade-form-input">
      <div className="pm-c-trade-form-input__header">
        <label className="pm-c-trade-form-input__header-label" htmlFor={label}>
          {label}
        </label>
        <div className="pm-c-trade-form-input__header-wallet">
          <figure aria-label="Wallet icon">
            <WalletIcon />
          </figure>
          <Text as="strong" scale="tiny" fontWeight="semibold">
            {max()}
          </Text>
          <Text as="span" scale="tiny" fontWeight="semibold">
            {type === 'buy' ? ticker : ' Shares'}
          </Text>
        </div>
      </div>
      <div className="pm-c-trade-form-input__group">
        <input
          className="pm-c-trade-form-input__input"
          type="number"
          id={label}
          value={amount}
          lang="en"
          step=".0001"
          min={0}
          max={max()}
          onChange={event => handleChangeAmount(event)}
          onWheel={event => event.currentTarget.blur()}
        />
        <div className="pm-c-trade-form-input__actions">
          <button type="button" onClick={handleSetMaxAmount}>
            <Text as="span" scale="tiny-uppercase" fontWeight="semibold">
              Max
            </Text>
          </button>
          {type === 'buy' ? (
            <div className="pm-c-trade-form-input__logo">
              <figure aria-label={name}>{icon}</figure>
              <Text as="span" scale="caption" fontWeight="bold">
                {ticker}
              </Text>
            </div>
          ) : null}
          {type === 'sell' ? (
            <div className="pm-c-trade-form-input__logo">
              <Text as="span" scale="caption" fontWeight="bold">
                Shares
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <StepSlider
        currentValue={stepAmount}
        onChange={value => handleChangeSlider(value)}
      />
    </form>
  );
}

TradeFormInput.displayName = 'TradeFormInput';

export default TradeFormInput;
