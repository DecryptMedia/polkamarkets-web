import { useEffect } from 'react';

import { getMarkets } from 'redux/ducks/markets';
import { getPortfolio } from 'redux/ducks/portfolio';
import { closeRightSidebar } from 'redux/ducks/ui';

import { useAppDispatch, useAppSelector } from 'hooks';

import PortfolioAnalytics from './PortfolioAnalytics';
import PortfolioChart from './PortfolioChart';
import PortfolioTabs from './PortfolioTabs';

const PortfolioPage = () => {
  const dispatch = useAppDispatch();

  const rightSidebarIsVisible = useAppSelector(
    state => state.ui.rightSidebar.visible
  );

  const ethAddress = useAppSelector(state => state.bepro.ethAddress);

  useEffect(() => {
    if (rightSidebarIsVisible) {
      dispatch(closeRightSidebar());
    }
    dispatch(getMarkets('open'));
    dispatch(getMarkets('closed'));
    dispatch(getMarkets('resolved'));
  }, [rightSidebarIsVisible, dispatch]);

  useEffect(() => {
    if (ethAddress) {
      dispatch(getPortfolio(ethAddress));
    }
  }, [ethAddress, dispatch]);

  return (
    <div className="portfolio-page">
      <PortfolioAnalytics />
      <PortfolioChart />
      <PortfolioTabs />
    </div>
  );
};

export default PortfolioPage;
