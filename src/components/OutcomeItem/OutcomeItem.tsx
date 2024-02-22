import { useMemo } from 'react';

import cn from 'classnames';
import { features } from 'config';
import { roundNumber } from 'helpers/math';
import { kebabCase, uniqueId } from 'lodash';
import { Market } from 'models/market';
import { Line } from 'rc-progress';
import type { UserOperation } from 'types/user';
import { Avatar, useTheme } from 'ui';

import { CheckIcon, RemoveIcon, RepeatCycleIcon } from 'assets/icons';

import Icon from 'components/Icon';
import MiniTable from 'components/MiniTable';
import { Area } from 'components/plots';
import type { AreaDataPoint } from 'components/plots/Area/Area.type';
import Text from 'components/Text';
import { calculateEthAmountSold } from 'components/TradeForm/utils';

import { useAppSelector } from 'hooks';

import outcomeItemClasses from './OutcomeItem.module.scss';

export type OutcomeProps = Pick<
  React.ComponentPropsWithoutRef<'button'>,
  'onClick' | 'children' | 'value' | 'className'
> &
  Partial<Record<'primary' | 'image' | 'activeColor', string>> &
  Partial<Record<'invested', number>> & {
    market: Market;
    $state?: UserOperation['status'];
    isActive?: boolean;
    data?: AreaDataPoint[];
    $variant?: 'dashed';
    $size?: 'sm' | 'md';
    resolved?: 'won' | 'lost' | 'voided';
    secondary: {
      price: number;
      ticker?: string;
      isPriceUp?: boolean;
      text?: string;
    };
  };

const resolveds = {
  voided: <RepeatCycleIcon />,
  won: <CheckIcon fill="#27ab83" />,
  lost: <RemoveIcon fill="#e12d39" />
};

export default function OutcomeItem({
  primary,
  secondary,
  isActive,
  invested,
  $size,
  data,
  $variant,
  image,
  activeColor,
  resolved,
  className,
  $state,
  market,
  ...props
}: OutcomeProps) {
  const theme = useTheme();
  const isSm = $size === 'sm';
  const isMd = $size === 'md';

  const portfolio = useAppSelector(state => state.polkamarkets.portfolio);
  const { portfolio: isLoadingPortfolio } = useAppSelector(
    state => state.polkamarkets.isLoading
  );

  const outcomesWithShares = useMemo(() => {
    if (isLoadingPortfolio) return [];

    const marketShares = portfolio[market.id];

    if (!marketShares) return [];

    const sharesByOutcome = market.outcomes.map(outcome => {
      const outcomeShares = marketShares.outcomes[outcome.id];

      return {
        id: outcome.id.toString(),
        title: outcome.title,
        imageUrl: outcome.imageUrl,
        shares: outcomeShares ? outcomeShares.shares : 0,
        buyValue: outcomeShares
          ? outcomeShares.shares * outcomeShares.price
          : 0,
        value:
          outcomeShares && outcomeShares.shares > 0
            ? calculateEthAmountSold(market, outcome, outcomeShares.shares)
                .totalStake
            : 0
      };
    });

    return sharesByOutcome.filter(outcome => outcome.shares > 1e-5);
  }, [isLoadingPortfolio, portfolio, market]);

  const outcomeWithShares = outcomesWithShares.find(
    outcome => outcome.id.toString() === props.value?.toString()
  );

  return (
    <button
      type="button"
      disabled={!!resolved}
      className={cn(
        outcomeItemClasses.root,
        {
          'pm-c-market-outcomes__item--default': !image && !resolved,
          'pm-c-market-outcomes__item--success': !image && resolved === 'won',
          'pm-c-market-outcomes__item--danger': !image && resolved !== 'won',
          [outcomeItemClasses.backdrop]: image,
          [outcomeItemClasses.backdropDefault]: image && resolved !== 'won',
          [outcomeItemClasses.backdropSuccess]: image && resolved === 'won',
          [outcomeItemClasses.backdropActive]: image && !resolved && isActive,
          [outcomeItemClasses.variantDashed]: $variant === 'dashed',
          [outcomeItemClasses.sizeSm]: isSm,
          [outcomeItemClasses.sizeMd]: isMd,
          [outcomeItemClasses.state]: $state,
          [outcomeItemClasses.stateSuccess]: $state === 'success',
          [outcomeItemClasses.statePending]: $state === 'pending',
          [outcomeItemClasses.stateFailed]: $state === 'failed',
          active: isActive
        },
        className
      )}
      style={{
        // @ts-expect-error No need to assert React.CSSProperties here
        '--outcome-image': image && `url('${image}')`,
        '--outcome-color': activeColor
      }}
      {...props}
    >
      {$state === 'success' && (
        <div className={outcomeItemClasses.rootStatus}>
          <CheckIcon className={outcomeItemClasses.rootStatusIcon} />
          <span className={outcomeItemClasses.rootStatusTitle}>Predicted</span>
          {outcomeWithShares ? (
            <span className={outcomeItemClasses.rootStatusPerformance}>
              (
              {`${
                outcomeWithShares.value > outcomeWithShares.buyValue ? '+' : ''
              }
              ${(outcomeWithShares.value - outcomeWithShares.buyValue).toFixed(
                1
              )} ${market.token.symbol}`.trimStart()}
              )
            </span>
          ) : null}
        </div>
      )}
      <div className={outcomeItemClasses.content}>
        {image && isMd && (
          <div className={outcomeItemClasses.itemStart}>
            <Avatar $size="xs" $radius="xs" src={image} />
          </div>
        )}
        <div className={outcomeItemClasses.contentContainer}>
          <Text
            as="p"
            scale="caption"
            fontWeight="semibold"
            className={`pm-c-market-outcomes__item-title ${outcomeItemClasses.primary}`}
          >
            {primary}
          </Text>
          <Text
            as="p"
            scale="tiny"
            fontWeight="semibold"
            className={`pm-c-market-outcomes__item-odd ${outcomeItemClasses.secondary} notranslate`}
          >
            {secondary.text || (
              <>
                {features.fantasy.enabled ? (
                  `${roundNumber(+secondary.price * 100, 3)}%`
                ) : (
                  <>
                    <strong className={outcomeItemClasses.primary}>
                      {secondary.price}
                    </strong>{' '}
                    {secondary.ticker}
                  </>
                )}
                <Text
                  as="span"
                  scale="tiny"
                  color={secondary.isPriceUp ? 'success' : 'danger'}
                >
                  <Icon
                    name="Arrow"
                    size="sm"
                    dir={secondary.isPriceUp ? 'up' : 'down'}
                  />
                </Text>
              </>
            )}
          </Text>
        </div>
        <div className={outcomeItemClasses.itemEnd}>
          {(() => {
            if (resolved)
              return (
                <Text color={resolved === 'won' ? 'success' : 'dark'}>
                  {resolveds[resolved]}
                </Text>
              );
            if (image && $size === 'sm')
              return <Avatar $size="xs" $radius="xs" src={image} />;
            if (data && theme.device.isTablet)
              return (
                <Area
                  id={`${kebabCase(primary)}-${uniqueId('outcome-item')}`}
                  data={data}
                  color={secondary.isPriceUp ? 'green' : 'red'}
                  width={48}
                  height={32}
                />
              );
            if ($variant === 'dashed')
              return (
                <span className={outcomeItemClasses.secondary}>
                  <Icon size="lg" name="Plus" />
                </span>
              );
            return null;
          })()}
        </div>
      </div>
      {data && theme.device.isTablet && isMd && (
        <MiniTable
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 8
          }}
          rows={[
            {
              key: 'invested',
              title: 'Your Shares',
              value: invested || 0
            }
          ]}
        />
      )}
      {!resolved && (
        <Line
          percent={+secondary.price * 100}
          strokeWidth={1}
          strokeColor={(() => {
            if (secondary.isPriceUp) return '#65D6AD';
            if (!data) return 'var(--color-text-secondary)';
            return '#F86A6A';
          })()}
          trailWidth={1}
          trailColor="var(--color-vote-arrows-background--neutral)"
          strokeLinecap="butt"
          className={outcomeItemClasses.line}
        />
      )}
    </button>
  );
}
