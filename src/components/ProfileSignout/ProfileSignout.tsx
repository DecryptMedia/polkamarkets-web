import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { features } from 'config';
import { formatNumberToString } from 'helpers/math';
import shortenAddress from 'helpers/shortenAddress';
import { changeSocialLoginInfo } from 'redux/ducks/polkamarkets';
import { useGetLeaderboardByAddressQuery } from 'services/Polkamarkets';
import { Avatar, Skeleton } from 'ui';

import { Button } from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';

import {
  useAppDispatch,
  useAppSelector,
  useFantasyTokenTicker,
  useNetwork,
  usePolkamarketsService
} from 'hooks';

import profileSignoutClasses from './ProfileSignout.module.scss';

export default function ProfileSignout() {
  const dispatch = useAppDispatch();
  const fantasyTokenTicker = useFantasyTokenTicker();
  const polkamarketsService = usePolkamarketsService();
  const polkBalance = useAppSelector(state => state.polkamarkets.polkBalance);
  const address = useAppSelector(state => state.polkamarkets.ethAddress);
  const isPolkLoading = useAppSelector(
    state => state.polkamarkets.isLoading.polk
  );
  const network = useNetwork();
  const leaderboard = useGetLeaderboardByAddressQuery({
    address,
    networkId: network.network.id,
    timeframe: 'at'
  });
  const socialLoginInfo = useAppSelector(
    state => state.polkamarkets.socialLoginInfo
  );
  const handleSocialLogout = useCallback(async () => {
    const { logout } = await import('redux/ducks/polkamarkets');

    polkamarketsService.logoutSocialLogin();
    dispatch(logout());
  }, [dispatch, polkamarketsService]);

  const [username, setUserName] = useState(
    socialLoginInfo?.name?.includes('#')
      ? socialLoginInfo?.name?.split('#')[0]
      : socialLoginInfo?.name?.split('@')[0]
  );
  const [hasUpdatedSocialLoginInfo, setHasUpdatedSocialLoginInfo] =
    useState(false);

  useEffect(() => {
    async function handleSocialLogin() {
      const { updateSocialLoginInfo } = await import(
        'services/Polkamarkets/user'
      );

      if (hasUpdatedSocialLoginInfo) return;

      // send data to backend
      const res = await updateSocialLoginInfo(
        socialLoginInfo.idToken,
        socialLoginInfo.typeOfLogin,
        address,
        socialLoginInfo.profileImage,
        socialLoginInfo.oAuthAccessToken
      );

      if (res.data?.user?.username) {
        setUserName(res.data?.user?.username);
      }

      if (res.data?.user?.avatar) {
        dispatch(
          changeSocialLoginInfo({
            ...socialLoginInfo,
            profileImage: res.data?.user?.avatar
          })
        );
      }

      setHasUpdatedSocialLoginInfo(true);
    }

    handleSocialLogin();
  }, [socialLoginInfo, address, dispatch, hasUpdatedSocialLoginInfo]);

  return (
    <div className={profileSignoutClasses.root}>
      <Button
        variant="ghost"
        color="default"
        size="sm"
        onClick={handleSocialLogout}
        className={profileSignoutClasses.signout}
      >
        <Icon
          name="LogOut"
          size="lg"
          className={profileSignoutClasses.signoutIcon}
        />
        Sign Out
      </Button>
      <div className="pm-c-wallet-info__profile notranslate">
        <Link
          to={`/user/${
            (features.fantasy.enabled &&
              (leaderboard.data?.username || username)) ||
            address
          }`}
        >
          <Avatar
            $size="sm"
            $radius="lg"
            src={socialLoginInfo?.profileImage}
            alt={username || 'avatar'}
          />
        </Link>
        <div>
          <Text
            scale="caption"
            fontWeight="semibold"
            className={profileSignoutClasses.username}
          >
            {username || shortenAddress(address)}
          </Text>
          {isPolkLoading ? (
            <Skeleton style={{ height: 16, width: 52 }} />
          ) : (
            <Text
              scale="tiny-uppercase"
              fontWeight="semibold"
              className="pm-c-wallet-info__profile__ticker"
            >
              {formatNumberToString(polkBalance)} {fantasyTokenTicker || 'POLK'}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
