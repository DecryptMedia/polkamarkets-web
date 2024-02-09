import { useState } from 'react';

import Divider from 'ui/Divider';

import {
  ModalHeader,
  ModalHeaderHide,
  ModalHeaderTitle,
  ModalSection
} from 'components';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';

import tournamentTopUsersClasses from './TournamentTopUsers.module.scss';
import tournamentTopUsersRewardsClasses from './TournamentTopUsersRewards.module.scss';

export default function TournamentTopUsersRewards({
  children
}: React.PropsWithChildren<{}>) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        type="button"
        className={tournamentTopUsersClasses.action}
        onClick={() => {
          setShow(true);
        }}
      >
        View Ranking
        <Icon
          name="Arrow"
          size="md"
          dir="right"
          className={tournamentTopUsersClasses.actionIcon}
        />
      </button>
      <Modal size="sm" centered show={show} onHide={() => setShow(false)}>
        <ModalContent className={tournamentTopUsersRewardsClasses.content}>
          <ModalHeader className={tournamentTopUsersRewardsClasses.header}>
            <ModalHeaderTitle>Rewards</ModalHeaderTitle>
            <ModalHeaderHide $disableInset />
          </ModalHeader>
          <Divider />
          <ModalSection className={tournamentTopUsersRewardsClasses.section}>
            {children}
          </ModalSection>
        </ModalContent>
      </Modal>
    </>
  );
}
