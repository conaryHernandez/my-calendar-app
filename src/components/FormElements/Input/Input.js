import React from 'react';
import { useField } from 'formik';
import { Input } from 'antd';
import PropTypes from 'prop-types';

import classes from '../index.module.scss';

const CustomInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const inputClasses = [meta.error && meta.touched ? classes.Invalid : ''];
  const errorLabelClasses = [
    meta.error && meta.touched ? classes.InvalidText : ''
  ];

  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>

      <Input
        className={inputClasses.join(' ')}
        onChange={props.onChange}
        {...field}
        {...props}
      />

      {meta.touched && meta.error ? (
        <div
          data-testid={`${props.id}Error`}
          className={errorLabelClasses.join(' ')}>
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

CustomInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

CustomInput.defaultProps = {
  id: '',
  name: '',
  label: 'Enter a Value',
  onChange: () => {}
};

export default CustomInput;
