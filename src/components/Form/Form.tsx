import React from 'react';
import cn from 'classnames';

import './Form.css';

interface FormProps {
    children: React.ReactNode;
    isAlignCenter?: boolean;
    classname?: string;
}
export const Form = ({ children, isAlignCenter, classname }: FormProps) => (
    <form className={cn('Form', classname,  { 'Form--center': isAlignCenter })}>
        {children}
    </form>
)
