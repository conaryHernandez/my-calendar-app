import React from 'react';
import { useField } from 'formik';
import { DatePicker, Input } from 'antd';
import moment from 'moment';

import classes from '../index.module.scss';

const CustomDatePicker = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const dateFormat = 'MM/DD/YYYY';

  const inputClasses = [meta.error && meta.touched ? classes.Invalid : ''];

  const errorLabelClasses = [
    meta.error && meta.touched ? classes.InvalidText : ''
  ];

  const onChange = (date, dateString) => {
    const fakeEvent = {
      currentTarget: {
        value: date ? date.format() : '',
        type: 'text',
        name: props.name
      }
    };

    props.onChange(fakeEvent);
  };

  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className={classes['control-label']}
      >
        {label}
      </label>

      <DatePicker
        defaultValue={moment('2015/01/01', dateFormat)}
        format={dateFormat}
        className={inputClasses.join(' ')}
        {...field}
        {...props}
        onChange={onChange}
        value={moment(props.value)}
      />

      <Input id={props.id} type="hidden" value={props.value} />

      {meta.touched && meta.error ? (
        <div className={errorLabelClasses.join(' ')}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default CustomDatePicker;
