import { Link } from 'react-router-dom';

import cn from 'classnames';
import { features } from 'config';
import isEmpty from 'lodash/isEmpty';
import { useGetTournamentsQuery } from 'services/Polkamarkets';

import { AlertMini } from 'components';

import styles from './TournamentsList.module.scss';

function TournamentsList() {
  const { data: tournaments, isFetching, isLoading } = useGetTournamentsQuery();

  if (isFetching || isLoading)
    return (
      <div className="flex-row justify-center align-center width-full padding-y-5 padding-x-4">
        <span className="spinner--primary" />
      </div>
    );

  if (isEmpty(tournaments))
    return (
      <AlertMini
        style={{ border: 'none' }}
        styles="outline"
        variant="information"
        description="No tournaments available at the moment."
      />
    );

  return (
    <ul className="flex-column">
      {tournaments?.map((tournament, index) => (
        <li key={tournament.slug}>
          <Link
            to={`/tournaments/${tournament.slug}${
              features.fantasy.enabled && '/leaderboard'
            }`}
            className={cn(styles.item, {
              'bg-3': index % 2 === 0
            })}
          >
            <div className={styles.itemAvatar}>
              {tournament.imageUrl ? (
                <img
                  src={tournament.imageUrl}
                  alt="Tournament Avatar"
                  className={styles.itemAmage}
                />
              ) : (
                <p className={cn('body text-3 bold', styles.itemInitials)}>
                  {tournament.title.match(/\w/)}
                </p>
              )}
            </div>
            <div>
              <span className="body semibold text-2 text-1-on-hover">
                {tournament.title}
              </span>
              <p className={cn(styles.itemDescription, 'tiny semibold text-3')}>
                {tournament.description}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default TournamentsList;
