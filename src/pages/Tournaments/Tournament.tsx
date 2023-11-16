import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import isNull from 'lodash/isNull';
import type { Tournament as TournamentType } from 'types/tournament';
import { Avatar } from 'ui';

import { Pill, Share } from 'components';

import styles from './Tournament.module.scss';

type TournamentProps = {
  tournament: Omit<TournamentType, 'land'>;
};

function Tournament({ tournament }: TournamentProps) {
  const altFormatter = useCallback((alt?: string): string | null => {
    if (!alt) return null;

    const altWithoutSpecialChars = alt.replace(/[^\w\s]/g, ' ');

    const words = altWithoutSpecialChars
      .trim()
      .split(' ')
      .filter(word => word !== '');

    const numberMatch = altWithoutSpecialChars.match(/\d+/);

    if (numberMatch) {
      const firstLetter = altWithoutSpecialChars[0];
      const number = numberMatch[0];
      return (firstLetter + number).toUpperCase();
    }

    if (words.length >= 2) {
      const firstLetters = words[0][0] + words[1][0];
      return firstLetters.toUpperCase();
    }

    return altWithoutSpecialChars.substring(0, 2).toUpperCase();
  }, []);

  const isTournamentEnded = dayjs()
    .utc()
    .isAfter(dayjs(tournament.expiresAt).utc());

  const { origin } = window.location;

  return (
    <div className={styles.root}>
      <Link to={`/tournaments/${tournament.slug}`} className={styles.content}>
        <Avatar
          $size="md"
          $radius="sm"
          src={!isNull(tournament.imageUrl) ? tournament.imageUrl : undefined}
          alt={tournament.title}
          altFormatter={altFormatter}
          className={styles.contentAvatar}
          fallbackClassName={styles.contentAvatarFallback}
        />
        <div>
          <h4 className={styles.contentTitle}>{tournament.title}</h4>
          <div className={styles.stats}>
            <span className={styles.statsTitle}>
              Ends At:
              <strong className={`${styles.statsValue} notranslate`}>
                {dayjs(tournament.expiresAt).utc(true).format('MMMM D, YYYY')}
              </strong>
            </span>
          </div>
        </div>
      </Link>
      <div className={styles.footer}>
        <div className={styles.stats}>
          <span className={styles.statsTitle}>
            Users:
            <strong className={`${styles.statsValue} notranslate`}>
              {tournament.users}
            </strong>
          </span>
          {tournament.markets ? (
            <>
              <span className="pm-c-divider--circle" />
              <span className={styles.statsTitle}>
                Markets:
                <strong className={`${styles.statsValue} notranslate`}>
                  {tournament.markets.length}
                </strong>
              </span>
            </>
          ) : null}
        </div>
        <div className={styles.footerActions}>
          <Share
            id={tournament.slug}
            link={{
              title: tournament.title,
              url: `${origin}/tournaments/${tournament.slug}`
            }}
            className="pm-c-market-footer__actions-button"
          />
          {!isTournamentEnded ? (
            <>
              <span className="pm-c-divider--circle" />
              <Pill badge>Ended</Pill>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Tournament;
