import { Market } from 'models/market';

import VoteArrows from 'components/VoteArrows';

import marketClasses from './Market.module.scss';
import MarketFooterActions from './MarketFooterActions';
import MarketFooterStats from './MarketFooterStats';
import MarketFooterTags from './MarketFooterTags';

type MarketFooterProps = {
  market: Market;
};

export default function MarketFooter({ market }: MarketFooterProps) {
  const { id, slug, network, votes } = market;

  return (
    <div className={`pm-c-market-footer ${marketClasses.footer}`}>
      <MarketFooterStats market={market} />
      <div className="pm-c-market-footer__group--row">
        <MarketFooterActions market={market} />
        <MarketFooterTags market={market} />
        <div className="pm-c-market-footer__divider--circle" />
        <VoteArrows
          key={slug}
          size="sm"
          marketId={id}
          marketSlug={slug}
          marketNetworkId={network.id}
          votes={votes}
        />
      </div>
    </div>
  );
}
