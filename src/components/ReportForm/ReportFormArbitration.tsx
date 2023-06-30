import { useCallback, useMemo, useState } from 'react';

import { roundNumber } from 'helpers/math';
import { PolkamarketsService } from 'services';
import { Avatar } from 'ui';

import { useAppSelector, useNetwork } from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import { AlertMini } from '../Alert';
import { Button, ButtonLoading } from '../Button';
import Icon from '../Icon';
import MiniTable from '../MiniTable';
import Modal from '../Modal';
import ModalContent from '../ModalContent';
import ModalHeader from '../ModalHeader';
import ModalHeaderHide from '../ModalHeaderHide';
import ModalHeaderTitle from '../ModalHeaderTitle';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';
import styles from './ReportFormArbitration.module.scss';
import { formatArbitrationDetails } from './ReportFormArbitration.utils';

function ReportFormArbitration() {
  // Helpers
  const { network, networkConfig } = useNetwork();
  const { show, close } = useToastNotification();

  // Redux selectors
  const { imageUrl, title, outcomes, question } = useAppSelector(
    state => state.market.market
  );

  const { bond, finalizeTs, arbitrator, isPendingArbitration } = question;

  const ethBalance = useAppSelector(state => state.polkamarkets.ethBalance);

  // Local state
  const [modalVisible, setModalVisible] = useState(false);

  // Transaction state
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [transactionSuccessHash, setTransactionSuccessHash] = useState<
    string | undefined
  >(undefined);

  // Handlers
  const handleOpenModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (!isLoading) setModalVisible(false);
  }, [isLoading]);

  const handleApplyToArbitration = useCallback(async () => {
    setIsLoading(true);

    try {
      // Async call
      const response = { status: true, transactionHash: '0x0000000000000' };

      setIsLoading(false);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setTransactionSuccess(status);
        setTransactionSuccessHash(transactionHash);
        show('apply-to-arbitration');
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [show]);

  // Derivated state
  const winningOutcomeId = useMemo(() => {
    return PolkamarketsService.bytes32ToInt(question.bestAnswer);
  }, [question.bestAnswer]);

  const winningOutcome = useMemo(() => {
    return outcomes.find(
      outcome => outcome.id.toString() === winningOutcomeId.toString()
    );
  }, [outcomes, winningOutcomeId]);

  const arbitrationDetails = useMemo(() => {
    return formatArbitrationDetails({
      balance: ethBalance,
      cost: 0.25,
      ticker: 'ETH',
      imageUrl: winningOutcome?.imageUrl,
      title: winningOutcome?.title
    });
  }, [ethBalance, winningOutcome?.imageUrl, winningOutcome?.title]);

  if (isPendingArbitration) {
    return (
      <AlertMini variant="warning" description="Market is under arbitration" />
    );
  }

  const isValidTimestamp = finalizeTs > 0;
  const isOutdated = Date.now() > finalizeTs * 1000;
  const isStarted = bond > 0;

  const visible =
    isStarted &&
    isValidTimestamp &&
    isOutdated &&
    !isPendingArbitration &&
    arbitrator === networkConfig.ARBITRATION_CONTRACT_ADDRESS;

  if (!visible) {
    return (
      <>
        <Button variant="subtle" size="sm" fullwidth onClick={handleOpenModal}>
          <Icon name="Legal" size="lg" />
          Apply for Arbitration
        </Button>
        <Modal
          centered
          className={{ dialog: styles.modalDialog }}
          show={modalVisible}
          onHide={handleCloseModal}
        >
          <ModalContent>
            <ModalHeader>
              <ModalHeaderHide onClick={handleCloseModal} />
              <ModalHeaderTitle className={styles.modalTitle}>
                Request Arbitration
              </ModalHeaderTitle>
            </ModalHeader>
            <div className={styles.modalContent}>
              <div className={styles.modalItem}>
                <p className={styles.modalItemTitleLg}>
                  Your are contesting the following market
                </p>
                <div className={styles.market}>
                  <Avatar $radius="lg" $size="md" alt="Market" src={imageUrl} />
                  <p className={styles.marketTitle}>{title}</p>
                </div>
              </div>
              {winningOutcome ? (
                <div className={styles.modalItem}>
                  <p className={styles.modalItemTitle}>Contested outcome</p>
                  <div className={styles.outcome}>
                    <div className={styles.outcomeDetails}>
                      {winningOutcome.imageUrl ? (
                        <Avatar
                          $radius="lg"
                          $size="x2s"
                          alt="Outcome"
                          src={winningOutcome.imageUrl}
                        />
                      ) : null}
                      <p className={styles.outcomeDetailsTitle}>
                        {winningOutcome.title}
                      </p>
                    </div>
                    <span className={styles.outcomeProbability}>{`${roundNumber(
                      +winningOutcome.price * 100,
                      3
                    )}%`}</span>
                  </div>
                </div>
              ) : null}
              <div role="alert" className={styles.alert}>
                <div className={styles.alertBody}>
                  <div className={styles.alertHeader}>
                    <Icon
                      name="Warning"
                      size="md"
                      className={styles.alertIcon}
                    />
                    <h3 className={styles.alertTitle}>Attention needed</h3>
                  </div>
                  <p className={styles.alertDescription}>
                    {`If you believe the declared outcome of this market is
                      incorrect, you have the option to apply for arbitration. By
                      invoking this process, you're requesting a jury to review
                      the decision. Please note, you must be on the Ethereum
                      network to proceed.`}
                  </p>
                  <a
                    href="//help.polkamarkets.com"
                    aria-label="More Info"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.alertAction}
                  >
                    More info
                    <Icon
                      name="Arrow"
                      dir="right"
                      style={{ marginLeft: 'var(--size-4)' }}
                    />
                  </a>
                </div>
              </div>
              <MiniTable rows={arbitrationDetails} />
              <ButtonLoading
                color="primary"
                loading={isLoading}
                onClick={handleApplyToArbitration}
              >
                Apply for Arbitration
              </ButtonLoading>
              {transactionSuccess && transactionSuccessHash ? (
                <ToastNotification id="apply-to-arbitration" duration={10000}>
                  <Toast
                    variant="success"
                    title="Success"
                    description="Your transaction is completed!"
                  >
                    <Toast.Actions>
                      <a
                        target="_blank"
                        href={`${network.explorerURL}/tx/${transactionSuccessHash}`}
                        rel="noreferrer"
                      >
                        <Button size="sm" color="success">
                          View on Explorer
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => close('apply-to-arbitration')}
                      >
                        Dismiss
                      </Button>
                    </Toast.Actions>
                  </Toast>
                </ToastNotification>
              ) : null}
            </div>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return null;
}

export default ReportFormArbitration;
