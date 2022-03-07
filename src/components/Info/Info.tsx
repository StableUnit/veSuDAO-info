import React from "react";
import ReactTooltip from "react-tooltip";
import infoIcon from './assets/info.png';

import './Info.css';

interface InfoProps {
    title: string;
    value?: string;
    tooltip?: string;
    children?: React.ReactNode;
}

export const Info = ({ title, value, tooltip, children }: InfoProps) => {
    return (
        <div className='Info'>
            {tooltip && (
              <>
                <div className='Info__tooltip' data-tip data-for={tooltip}>
                  <img src={infoIcon} width={16} height={16} />
                </div>
                <ReactTooltip id={tooltip} place="top" effect="solid" backgroundColor="rgba(0, 0, 0, 0.6)">{tooltip}</ReactTooltip>
              </>
            )}
            <div className='Info__title'>{title}</div>
            <div className='Info__value'>{value ?? children}</div>
        </div>
    )
};