import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import dayjs from 'dayjs';
import { getMarket, setChartViewType } from 'redux/ducks/market';
import { reset } from 'redux/ducks/trade';
import { openTradeForm } from 'redux/ducks/ui';

import { ArrowLeftIcon } from 'assets/icons';

import { Tabs, Table, Text, Button, SEO } from 'components';

import { useAppDispatch, useAppSelector, useNetwork } from 'hooks';

import MarketAnalytics from './MarketAnalytics';
import MarketChart from './MarketChart';
import MarketChartViewSelector from './MarketChartViewSelector';
import MarketHead from './MarketHead';
import MarketStats from './MarketStats';
import { formatMarketPositions, formatSEODescription } from './utils';

type Params = {
  marketId: string;
};

const Market = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { currency } = useNetwork();
  const { symbol, ticker } = currency;
  const network = useNetwork();
  const { marketId } = useParams<Params>();
  const { market, isLoading } = useAppSelector(state => state.market);
  const { actions, bondActions } = useAppSelector(state => state.bepro);

  useEffect(() => {
    async function fetchMarket() {
      dispatch(reset());
      await dispatch(getMarket(marketId));
      dispatch(setChartViewType('marketOverview'));
      dispatch(openTradeForm());
    }

    fetchMarket();
  }, [dispatch, marketId]);

  if (!market || market.id === '' || isLoading)
    return (
      <div className="pm-market__loading">
        <span className="spinner--primary" />
      </div>
    );

  const tableItems = formatMarketPositions(
    (actions as any).filter(action => action.marketId === market?.id),
    (bondActions as any).filter(
      action => action.questionId === market?.questionId
    ),
    market,
    symbol || ticker,
    network
  );

  return (
    <div className="pm-p-market">
      <SEO
        title={market.title}
        description={formatSEODescription(
          market.category,
          market.subcategory,
          market.expiresAt
        )}
        imageUrl={market.bannerUrl}
      />
      <div className="pm-p-market__analytics">
        <MarketAnalytics
          liquidity={market.liquidity}
          volume={market.volume}
          expiration={dayjs(market.expiresAt).utc().format('YYYY-MM-DD HH:mm UTC')}
        />
      </div>
      <div className="pm-p-market__market">
        <MarketHead
          section={market.category}
          subsection={market.subcategory}
          imageUrl={market.imageUrl}
          description={market.title}
        />
      </div>
      <div className="pm-p-market__actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => history.push('/')}
          aria-label="Back to Markets"
        >
          <ArrowLeftIcon />
          Back to Markets
        </Button>
      </div>
      <div className="pm-p-market__charts">
        {market.tradingViewSymbol ? <MarketChartViewSelector /> : null}
        <MarketChart />
      </div>
      <div className="pm-p-market__stats">
        <MarketStats market={market} />
      </div>
      <div className="pm-p-market__tabs">
        <Tabs defaultActiveId="positions">
          <Tabs.TabPane tab="Positions" id="positions">
            <Table
              columns={tableItems.columns}
              rows={tableItems.rows}
              isLoadingData={isLoading}
              emptyDataDescription="You have no positions."
            />
          </Tabs.TabPane>
          {/* market.description ? (
          <Tabs.TabPane tab="About market" id="about">
            <Text as="p" scale="body" fontWeight="medium" color="light">
              Coming Soon 🔥
            </Text>
          </Tabs.TabPane>
        ) : null */}
          <Tabs.TabPane tab="News" id="news">
            <Text
              as="p"
              scale="body"
              fontWeight="medium"
              className="pm-p-market__news"
            >
              Coming Soon 🔥
            </Text>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

Market.displayName = 'Market';

export default Market;
