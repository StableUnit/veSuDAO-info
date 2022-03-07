import React from "react";
import cn from "classnames";

import WarningIcon from './assets/warning.png';
import ErrorIcon from './assets/error.png';

import './ErrorText.css';

export type ErrorType = 'warning' | 'error';

interface ErrorTextProps {
  text?: string;
  type?: ErrorType;
}

export const ErrorText = ({ text, type = 'warning' }: ErrorTextProps) => {
  if (!text) {
    return null;
  }

  return (
    <div
      className={cn(
        'ErrorText',
        {
          'ErrorText__warning': type === 'warning',
          'ErrorText__error': type === 'error'
        }
      )}
    >
      <img className='ErrorText__icon' src={type === 'error' ? ErrorIcon : WarningIcon} alt='' />
      <span>{text}</span>
    </div>
  )
};