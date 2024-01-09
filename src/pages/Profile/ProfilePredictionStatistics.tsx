import { useMemo } from 'react';

import { features } from 'config';
import omit from 'lodash/omit';

import { InfoTooltip } from 'components';

import { preparePredictionStatisticsRow } from './prepare';
import ProfileStats from './ProfileStats';
import { PredictionStatistics, PredictionStatisticsColumn } from './types';

type ProfilePredictionStatisticsProps = {
  statistics: PredictionStatistics;
  ticker: string;
  isLoading: boolean;
};

function ProfilePredictionStatistics({
  statistics,
  ticker,
  isLoading
}: ProfilePredictionStatisticsProps) {
  const columns: PredictionStatisticsColumn[] = [
    {
      key: 'volume',
      title: (
        <>
          Volume
          <InfoTooltip text={`Total ${ticker} place in predictions.`} />
        </>
      )
    },
    {
      key: 'marketsCreated',
      title: 'Markets Created'
    },
    {
      key: 'wonPredictions',
      title: (
        <>
          Won Predictions
          <InfoTooltip
            text={`Total ${ticker} earned in active and finished questions.`}
          />
        </>
      )
    },
    {
      key: 'liquidityAdded',
      title: 'Liquidity Added'
    },
    {
      key: 'earnings',
      title: 'Earnings'
    }
  ];
  const row = useMemo(
    () => preparePredictionStatisticsRow({ statistics, ticker }),
    [statistics, ticker]
  );

  const filteredColumns = useMemo(
    () =>
      features.fantasy.enabled
        ? columns.filter(
            column => !['marketsCreated', 'liquidityAdded'].includes(column.key)
          )
        : columns,
    []
  );

  const filteredRow = useMemo(
    () =>
      features.fantasy.enabled
        ? omit(row, ['marketsCreated', 'liquidityAdded'])
        : row,
    [row]
  );

  return (
    <ProfileStats
      title="Prediction Statistics"
      columns={filteredColumns}
      row={filteredRow}
      isLoading={isLoading}
    />
  );
}

export default ProfilePredictionStatistics;
