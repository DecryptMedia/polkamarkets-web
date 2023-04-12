import { fromTimestampToCustomFormatDate } from 'helpers/date';
import type { GetPortfolioByAddressData } from 'services/Polkamarkets/types';
import type { Network } from 'types/network';
import { Skeleton } from 'ui';

import { ShareIcon } from 'assets/icons';

import { Alert, Tooltip } from 'components';
import { Text } from 'components/new';

type ProfileSummaryProps = {
  address: string;
  isLoading: boolean;
  data?: GetPortfolioByAddressData;
  network: Network;
};

export default function ProfileSummary({
  address,
  isLoading,
  data,
  network
}: ProfileSummaryProps) {
  return (
    <div className="pm-p-profile-summary__details">
      {(() => {
        if (isLoading)
          return (
            <>
              <div className="pm-p-profile-summary__address-group">
                <Skeleton style={{ height: 32 }} />
              </div>
              <div className="pm-p-profile-summary__history">
                <Skeleton style={{ width: 400, height: 16 }} />
              </div>
            </>
          );
        if (!data)
          return (
            <Alert variant="warning" description="No summary data available" />
          );
        return (
          <>
            <Text
              className="pm-p-profile-summary__address"
              as="h2"
              fontSize="heading-2"
              fontWeight="bold"
              color="1"
            >
              {address}
              <Tooltip position="bottom-start" text="View on Explorer">
                <a
                  target="_blank"
                  href={`${network.explorerURL}/address/${address}`}
                  rel="noreferrer"
                >
                  <ShareIcon className="pm-p-profile-summary__explorer-icon" />
                </a>
              </Tooltip>
            </Text>
            <Text
              fontSize="body-4"
              fontWeight="semibold"
              color="3"
              transform="uppercase"
              className="pm-p-profile-summary__history"
            >
              {!!data?.firstPositionAt && (
                <>
                  First prediction:{' '}
                  <span className="pm-p-profile-summary__history-accent">
                    {fromTimestampToCustomFormatDate(
                      data.firstPositionAt * 1000,
                      'MMMM DD, YYYY'
                    )}
                  </span>
                  <span className="pm-c-divider--circle" />
                </>
              )}
              Total predictions:{' '}
              <span className="pm-p-profile-summary__history-accent">
                {data.totalPositions}
              </span>
            </Text>
          </>
        );
      })()}
    </div>
  );
}
