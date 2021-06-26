import React, { useEffect } from 'react';

import { useField, useFormikContext } from 'formik';

import Text from '../Text';
import InputErrorMessage from './InputErrorMessage';

type Outcome = {
  name: string;
  probability: number;
};

type OutcomeContext = {
  firstOutcome: Outcome;
  secondOutcome: Outcome;
};

type ProbabilityInputProps = {
  name: string;
};

const ProbabilityInput = React.forwardRef<
  HTMLInputElement,
  ProbabilityInputProps & React.InputHTMLAttributes<HTMLInputElement>
>(({ name, ...props }, ref) => {
  const {
    values: { firstOutcome, secondOutcome },
    setFieldValue
  } = useFormikContext<OutcomeContext>();
  const [field, meta] = useField(name);

  useEffect(() => {
    if (firstOutcome.probability !== 100 - secondOutcome.probability) {
      setFieldValue('firstOutcome', {
        name: firstOutcome.name,
        probability: 100 - secondOutcome.probability
      });
    }
  }, [name, secondOutcome, setFieldValue]);

  useEffect(() => {
    if (secondOutcome.probability !== 100 - firstOutcome.probability) {
      setFieldValue('secondOutcome', {
        name: secondOutcome.name,
        probability: 100 - firstOutcome.probability
      });
    }
  }, [name, firstOutcome, setFieldValue]);

  return (
    <div className="pm-c-probability-input--default__group">
      <div
        className={`pm-c-probability-input--${
          meta.error ? 'error' : 'default'
        }__wrapper`}
      >
        <input
          ref={ref}
          className="pm-c-probability-input--default"
          id={name}
          type="number"
          {...field}
          {...props}
        />
        <Text as="span" scale="caption" fontWeight="medium" color="primary">
          %
        </Text>
      </div>
      {meta.error ? <InputErrorMessage message={meta.error} /> : null}
    </div>
  );
});

ProbabilityInput.displayName = 'ProbabilityInput';

export default ProbabilityInput;
