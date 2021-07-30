/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { useField } from 'formik';

import InputErrorMessage from './InputErrorMessage';

type SelectInputOption = {
  name: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  name: string;
  description?: string;
  options: SelectInputOption[];
};

const SelectInput = React.forwardRef<
  HTMLSelectElement,
  SelectInputProps & React.SelectHTMLAttributes<HTMLSelectElement>
>(({ label, name, description, options, placeholder, ...props }, ref) => {
  const [field, meta] = useField(name);

  const hasError = meta.touched && meta.error;

  return (
    <div className="pm-c-select-input__group">
      <label
        htmlFor={name}
        className={`pm-c-select-input__label--${
          hasError ? 'error' : 'default'
        }`}
      >
        {label}
      </label>
      <select
        ref={ref}
        id={name}
        {...field}
        {...props}
        className={`pm-c-input--${hasError ? 'error' : 'default'}`}
      >
        <option
          value=""
          disabled
          selected
          className="pm-c-select-input__option"
        >
          {placeholder}
        </option>
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            className="pm-c-select-input__option"
          >
            {option.name}
          </option>
        ))}
      </select>
      {hasError && meta.error ? (
        <InputErrorMessage message={meta.error} />
      ) : null}
      {description && !hasError ? (
        <span className="pm-c-input__description">{description}</span>
      ) : null}
    </div>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;
