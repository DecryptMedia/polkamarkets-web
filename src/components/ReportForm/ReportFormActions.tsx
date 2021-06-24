import { useField, useFormikContext } from 'formik';

import { Button } from '../Button';

function ReportFormActions() {
  const [outcome] = useField('outcome');
  const [bond] = useField('bond');
  const { isSubmitting } = useFormikContext();

  function handleCancel() {}

  return (
    <div className="pm-c-report-form-details__actions">
      <Button variant="dark" color="default" size="lg" onClick={handleCancel}>
        Cancel
      </Button>
      <Button
        type="submit"
        size="lg"
        color="primary"
        fullWidth
        disabled={!outcome.value || !bond.value || bond.value === 0}
        loading={isSubmitting}
      >
        Bond
      </Button>
    </div>
  );
}

export default ReportFormActions;
