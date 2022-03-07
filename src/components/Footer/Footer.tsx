import React from "react";
import telegramIcon from './assets/telegram.png';
import discordIcon from './assets/discord.png';
import {DISCORD_LINK, TG_LINK} from "../../constants/links";

import './Footer.css';

export const Footer = () => (
  <div className='Footer'>
    <a href={TG_LINK}>
      <img src={telegramIcon} width={22} />
    </a>
    <a href={DISCORD_LINK}>
      <img src={discordIcon} width={22} />
    </a>
  </div>
)