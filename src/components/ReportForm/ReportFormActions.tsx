import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useField, useFormikContext } from 'formik';
import { fetchAditionalData, login } from 'redux/ducks/bepro';
import { changeQuestion } from 'redux/ducks/market';
import { selectOutcome } from 'redux/ducks/trade';
import { closeReportForm } from 'redux/ducks/ui';
import { BeproService, PolkamarketsApiService } from 'services';

import { QuestionIcon } from 'assets/icons';

import { useAppDispatch, useAppSelector } from 'hooks';
import useToastNotification from 'hooks/useToastNotification';

import { Alert } from '../Alert';
import { Button } from '../Button';
import Link from '../Link';
import Toast from '../Toast';
import ToastNotification from '../ToastNotification';
import Tooltip from '../Tooltip';

type ReportFormActionsProps = {
  marketQuestionFinalized: boolean;
};

function ReportFormActions({
  marketQuestionFinalized
}: ReportFormActionsProps) {
  // Helpers
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { show, close } = useToastNotification();

  // Form state
  const [outcome] = useField('outcome');
  const [bond] = useField('bond');
  const { isSubmitting } = useFormikContext();

  // Loading state
  const [isApprovingPolk, setIsApprovingPolk] = useState(false);
  const [approvePolkTransactionSuccess, setApprovePolkTransactionSuccess] =
    useState(false);
  const [
    approvePolkTransactionSuccessHash,
    setApprovePolkTransactionSuccessHash
  ] = useState(undefined);

  const [bondTransactionSuccess, setBondTransactionSuccess] = useState(false);
  const [bondTransactionSuccessHash, setBondTransactionSuccessHash] =
    useState(undefined);

  const [isResolvingMarket, setIsResolvingMarket] = useState(false);
  const [marketResolveTransactionSuccess, setMarketResolveTransactionSuccess] =
    useState(false);
  const [
    marketResolveTransactionSuccessHash,
    setMarketResolveTransactionSuccessHash
  ] = useState(undefined);

  // Selectors
  const marketSlug = useAppSelector(state => state.market.market.slug);
  const isPolkApproved = useAppSelector(state => state.bepro.polkApproved);
  const { id, questionId } = useAppSelector(state => state.market.market);

  // Derivated state
  const isMarketPage = location.pathname === `/markets/${marketSlug}`;

  async function handleApprovePolk() {
    const beproService = new BeproService();

    setIsApprovingPolk(true);

    try {
      const response = await beproService.approveRealitioERC20();
      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setApprovePolkTransactionSuccess(status);
        setApprovePolkTransactionSuccessHash(transactionHash);
        show('approvePolk');
      }

      await login(dispatch);
      setIsApprovingPolk(false);
    } catch (error) {
      setIsApprovingPolk(false);
      console.error(error);
    }
  }

  function handleCancel() {
    dispatch(selectOutcome('', ''));
    dispatch(closeReportForm());
  }

  async function handleBond() {
    const beproService = new BeproService();

    try {
      // performing buy action on smart contract
      const response = await beproService.placeBond(
        questionId,
        outcome.value,
        bond.value
      );

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setBondTransactionSuccess(status);
        setBondTransactionSuccessHash(transactionHash);
        show('bond');
      }

      // triggering cache reload action on api
      new PolkamarketsApiService().reloadMarket(marketSlug);

      // updating wallet
      login(dispatch);
      fetchAditionalData(dispatch);

      // updating question
      const question = await beproService.getQuestion(questionId);
      dispatch(changeQuestion(question));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleResolve() {
    const beproService = new BeproService();

    setIsResolvingMarket(true);
    try {
      const response = await beproService.resolveMarket(id);

      const { status, transactionHash } = response;

      if (status && transactionHash) {
        setMarketResolveTransactionSuccess(status);
        setMarketResolveTransactionSuccessHash(transactionHash);
        show('marketResolve');

        // triggering cache reload action on api
        new PolkamarketsApiService().reloadMarket(marketSlug);
      }

      setIsResolvingMarket(false);
    } catch (error) {
      setIsResolvingMarket(false);
      console.error(error);
    }
  }

  return (
    <div className="pm-c-report-form-details__actions">
      <div className="pm-c-report-form-details__actions-group--column">
        {!isPolkApproved && !marketQuestionFinalized ? (
          <Button
            color="primary"
            size="sm"
            fullwidth
            style={{
              justifyContent: isApprovingPolk ? 'center' : 'space-between'
            }}
            onClick={handleApprovePolk}
            loading={isApprovingPolk}
            disabled={isApprovingPolk}
          >
            Allow Polkamarkets to use your POLK
            <Tooltip text="Example">
              <QuestionIcon
                style={{ width: '1.4rem', height: '1.4rem', opacity: 0.35 }}
              />
            </Tooltip>
          </Button>
        ) : null}
        {approvePolkTransactionSuccess && approvePolkTransactionSuccessHash ? (
          <ToastNotification id="approvePolk" duration={10000}>
            <Toast
              variant="success"
              title="Success"
              description="Your transaction is completed!"
            >
              <Toast.Actions>
                <a
                  target="_blank"
                  href={`https://kovan.etherscan.io/tx/${approvePolkTransactionSuccessHash}`}
                  rel="noreferrer"
                >
                  <Button size="sm" color="success">
                    View on Explorer
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => close('approvePolk')}
                >
                  Dismiss
                </Button>
              </Toast.Actions>
            </Toast>
          </ToastNotification>
        ) : null}
        {marketQuestionFinalized ? (
          <Alert
            variant="success"
            title="Resolve market"
            description={
              <>
                {`You're one step away from claiming your winnings! Our smart contract needs to fetch the
                 outcome reported by the community and calculate the market payouts. `}
              </>
            }
          />
        ) : null}
        {marketResolveTransactionSuccess &&
        marketResolveTransactionSuccessHash ? (
          <ToastNotification id="marketResolve" duration={10000}>
            <Toast
              variant="success"
              title="Success"
              description="Your transaction is completed!"
            >
              <Toast.Actions>
                <a
                  target="_blank"
                  href={`https://kovan.etherscan.io/tx/${marketResolveTransactionSuccessHash}`}
                  rel="noreferrer"
                >
                  <Button size="sm" color="success">
                    View on Explorer
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => close('marketResolve')}
                >
                  Dismiss
                </Button>
              </Toast.Actions>
            </Toast>
          </ToastNotification>
        ) : null}
        <div className="pm-c-report-form-details__actions-group--row">
          {!isMarketPage ? (
            <Button variant="subtle" color="default" onClick={handleCancel}>
              Cancel
            </Button>
          ) : null}
          {marketQuestionFinalized ? (
            <Button
              type="button"
              color="success"
              fullwidth
              onClick={handleResolve}
              disabled={isResolvingMarket}
              loading={isResolvingMarket}
            >
              Resolve
            </Button>
          ) : (
            <Button
              type="submit"
              color="primary"
              fullwidth
              onClick={handleBond}
              disabled={!isPolkApproved || bond.value === 0}
              loading={isSubmitting}
            >
              Bond
            </Button>
          )}

          {/* TODO: Create notifications by type (ex: Transaction completed) */}
          {bondTransactionSuccess && bondTransactionSuccessHash ? (
            <ToastNotification id="bond" duration={10000}>
              <Toast
                variant="success"
                title="Success"
                description="Your transaction is completed!"
              >
                <Toast.Actions>
                  <a
                    target="_blank"
                    href={`https://kovan.etherscan.io/tx/${bondTransactionSuccessHash}`}
                    rel="noreferrer"
                  >
                    <Button size="sm" color="success">
                      View on Explorer
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => close('bond')}
                  >
                    Dismiss
                  </Button>
                </Toast.Actions>
              </Toast>
            </ToastNotification>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ReportFormActions;
