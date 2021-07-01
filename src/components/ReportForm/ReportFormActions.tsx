import { useField, useFormikContext } from 'formik';
import { closeReportForm } from 'redux/ducks/ui';

import { useAppDispatch } from 'hooks';

import { Button } from '../Button';

function ReportFormActions() {
  const dispatch = useAppDispatch();

  const [outcome] = useField('outcome');
  const [bond] = useField('bond');
  const { isSubmitting } = useFormikContext();

  function handleCancel() {
    dispatch(closeReportForm());
  }

  return (
    <div className="pm-c-report-form-details__actions">
      <Button variant="subtle" color="default" onClick={handleCancel}>
        Cancel
      </Button>
      <Button
        type="submit"
        color="primary"
        fullwidth
        disabled={!outcome.value || !bond.value || bond.value === 0}
        loading={isSubmitting}
      >
        Bond
      </Button>
    </div>
  );
}

export default ReportFormActions;
