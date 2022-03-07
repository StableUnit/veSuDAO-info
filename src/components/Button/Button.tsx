import React from 'react';
import cn from 'classnames';

import './Button.css';

interface ButtonProps {
    onClick: () => void;
    disabled?: boolean;
    text: string;
    className?: string;
}
export const Button = ({ onClick, disabled, text, className }: ButtonProps) => (
    <div
        className={cn('Button', {
            'Button--disabled': disabled,
            [className ?? '']: className,
        })}
        onClick={disabled ? () => null : onClick}
    >
      <div className='Button__text'>{text}</div>
    </div>
)