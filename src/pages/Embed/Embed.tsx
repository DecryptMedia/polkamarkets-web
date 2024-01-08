import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import sortOutcomes from 'helpers/sortOutcomes';
import { isNull } from 'lodash';
import { Avatar, Spinner } from 'ui';

import { OutcomeItem, Text } from 'components';

import useAppDispatch from 'hooks/useAppDispatch';
import useAppSelector from 'hooks/useAppSelector';
import useExpandableOutcomes from 'hooks/useExpandableOutcomes';
import useMarketLand from 'hooks/useMarketLand';

import embedClasses from './Embed.module.scss';

/**
 * Example
 * 
  <a
    href="http://localhost:3000/markets/pe-leve-vs-aqa-quem-vai-ganhar-este-jogo"
    target="_blank"
    style="display: inline-block;"
  >
    <iframe
      src="http://localhost:3000/embed/pe-leve-vs-aqa-quem-vai-ganhar-este-jogo"
      width="336"
      height="200"
      style="border-radius: 8px; border: 1px solid #252C3B; pointer-events: none;"
    >
    </iframe>
  </a>
 */

export default function Embed() {
  const params = useParams<Record<'marketSlug', string>>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.market.isLoading);
  const market = useAppSelector(state => state.market.market);
  const land = useMarketLand(market.id);
  const sortedOutcomes = sortOutcomes({
    outcomes: market.outcomes,
    timeframe: '7d'
  });
  const expandableOutcomes = useExpandableOutcomes({
    outcomes: sortedOutcomes,
    max: 1
  });

  useEffect(() => {
    (async function handleMarket() {
      const { getMarket } = await import('redux/ducks/market');

      dispatch(getMarket(params.marketSlug));
    })();
  }, [dispatch, params.marketSlug]);

  if (isLoading) return <Spinner />;

  return (
    // TODO: root padding bottom is broken layout
    <div className={embedClasses.root}>
      {!isNull(land) && (
        <div className={embedClasses.category}>
          {!isNull(land.imageUrl) && (
            <Avatar
              $radius="lg"
              $size="x2s"
              src={land.imageUrl}
              alt={land.title}
            />
          )}
          <p className={embedClasses.categoryTitle}>{land.title}</p>
        </div>
      )}
      <Text
        as="h1"
        scale="body"
        fontWeight="medium"
        className={embedClasses.title}
      >
        {market.title}
      </Text>
      <ul className="pm-c-market-outcomes">
        {expandableOutcomes.onseted.map(outcome => (
          <li key={outcome.id}>
            <OutcomeItem
              $size="sm"
              image={outcome.imageUrl}
              value={outcome.id}
              data={outcome.data}
              primary={outcome.title}
              secondary={{
                price: outcome.price,
                ticker: market.token.ticker,
                isPriceUp: outcome.isPriceUp
              }}
              resolved={(() => {
                if (market.voided) return 'voided';
                if (market.resolvedOutcomeId === outcome.id) return 'won';
                if (market.state === 'resolved') return 'lost';
                return undefined;
              })()}
            />
          </li>
        ))}
        {!expandableOutcomes.isExpanded && (
          <li>
            <OutcomeItem
              $size="sm"
              $variant="dashed"
              value={expandableOutcomes.onseted[0].id}
              {...expandableOutcomes.offseted}
            />
          </li>
        )}
      </ul>
    </div>
  );
}
