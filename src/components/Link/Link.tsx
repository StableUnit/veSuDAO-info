import cn from "classnames";

import './Link.css';

interface LinkProps {
    href: string;
    text: string;
    noColor?: boolean;
}

export const Link = ({ href, text, noColor = false }: LinkProps) => (
    <a
      className={cn("Link", {"Link--noColor": noColor})}
      href={href}
      target='_blank'
      rel="noreferrer"
    >
        {text}
    </a>
);