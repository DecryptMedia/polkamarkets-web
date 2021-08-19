import { useLocation } from 'react-router-dom';

import classNames from 'classnames';
import { roundNumber } from 'helpers/math';
import { selectOutcome } from 'redux/ducks/trade';

import { useAppDispatch, useAppSelector } from 'hooks';
import useCurrency from 'hooks/useCurrency';

import MiniTable from '../MiniTable';
import Text from '../Text';

function TradeFormPredictions() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { symbol } = useCurrency();

  const selectedMarketId = useAppSelector(
    state => state.trade.selectedMarketId
  );
  const selectedOutcomeId = useAppSelector(
    state => state.trade.selectedOutcomeId
  );
  const outcomes = useAppSelector(state => state.market.market.outcomes);
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const portfolio = useAppSelector(state => state.bepro.portfolio);

  const isMarketPage = location.pathname === `/markets/${marketSlug}`;

  if (!isMarketPage) return null;

  function handleChangeSelectedPrediction(id: string | number) {
    dispatch(selectOutcome(selectedMarketId, id));
  }

  return (
    <div className="pm-c-trade-form-predictions">
      {outcomes.map((prediction, index) => (
        <div
          key={prediction.id}
          className={classNames({
            'pm-c-trade-form-predictions__item': true,
            active:
              prediction.id === selectedOutcomeId &&
              prediction.marketId === selectedMarketId
          })}
          role="button"
          tabIndex={index}
          onClick={() => handleChangeSelectedPrediction(prediction.id)}
          onKeyPress={() => handleChangeSelectedPrediction(prediction.id)}
        >
          <div className="pm-c-trade-form-predictions__item-prediction">
            <Text as="p" fontWeight="bold">
              {prediction.title}
            </Text>
            <Text as="span" fontWeight="semibold">
              {`PRICE `}
              <Text as="strong" fontWeight="bold">
                {prediction.price.toFixed(3)}
              </Text>
              <Text as="strong" fontWeight="medium">
                {` ${symbol}`}
              </Text>
            </Text>
          </div>
          <MiniTable
            rows={[
              {
                key: 'yourShares',
                title: 'Your Shares',
                // eslint-disable-next-line prettier/prettier
                value:
                  roundNumber(
                    portfolio[selectedMarketId]?.outcomes[prediction.id]
                      ?.shares,
                    3
                  ) || 0
              }
            ]}
          />
        </div>
      ))}
    </div>
  );
}

TradeFormPredictions.displayName = 'TradeFormPredictions';

export default TradeFormPredictions;
