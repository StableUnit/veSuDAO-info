import React from 'react';
import cn from "classnames";

import './Balance.css';

interface BalanceProps {
  title: string;
  value: string;
  subValue?: string;
  children?: React.ReactNode;
}

export const Balance = ({ title, value, subValue, children = null }: BalanceProps) => (
  <div className={cn('Balance', {'Balance--withSubValue': subValue})}>
    <div className="Balance__title">{title}</div>
    <div className="Balance__value">{value}</div>
    {subValue && <div className="Balance__subValue">{subValue}</div>}
    {children}
  </div>
)