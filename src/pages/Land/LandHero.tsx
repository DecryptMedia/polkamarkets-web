import classNames from 'classnames';
import { ui } from 'config';
import { Land } from 'types/land';
import { Avatar, Container, Hero } from 'ui';

import { Text } from 'components';

import styles from './LandHero.module.scss';

type LandHeroProps = Pick<
  Land,
  'title' | 'description' | 'imageUrl' | 'bannerUrl'
>;

export default function LandHero({
  title,
  description,
  imageUrl,
  bannerUrl
}: LandHeroProps) {
  return (
    <Container>
      <Hero
        $backdrop="main"
        $rounded
        $image={bannerUrl || ui.hero.image}
        className={classNames('pm-p-home__hero', styles.root)}
      >
        <div className="pm-p-home__hero__content">
          <div className={styles.meta}>
            {imageUrl ? (
              <Avatar
                src={imageUrl}
                alt={title}
                $size="lg"
                $radius="md"
                className={styles.metaAvatar}
              />
            ) : null}
            <div className={styles.metaDetails}>
              <Text
                as="h2"
                fontWeight="bold"
                scale="heading-large"
                color="light"
                className="pm-p-home__hero__heading"
              >
                {title}
              </Text>
              <Text as="span" fontWeight="medium" color="light">
                {description}
              </Text>
            </div>
          </div>
        </div>
      </Hero>
    </Container>
  );
}
