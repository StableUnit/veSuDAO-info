import React from "react";
import Web3 from "web3";
import {Contract} from "web3-eth-contract";

import {addNumberSpace, getShortAddress} from "../../utils/parser";
import {NFTImages} from "../NFTImages/NFTImages";
import CONTRACT_NFT from '../../constants/NFT.json';

import suUSDIcon from './assets/suUSD.png';
import logoutIcon from './assets/logout.png';

import './Header.css';

interface HeaderProps {
  discount?: number;
  currentAccount?: string;
  onDisconnect: () => void;
  nftRequirement: string;
  web3: Web3;
  contractANFT?: Contract;
}
export const Header = ({ contractANFT, discount, currentAccount, onDisconnect, nftRequirement, web3 }: HeaderProps) => {
  const contractNFT = React.useMemo(
    () => (nftRequirement && nftRequirement !== '0x0000000000000000000000000000000000000000') ? new web3.eth.Contract(CONTRACT_NFT as any, nftRequirement) : undefined,
    [web3, nftRequirement]
  );

  return (
    <div className='header'>
      <img src={suUSDIcon} width={40} height={40} />
      {currentAccount && (
        <div className='header__content'>
          {discount !== undefined && <div className='header__content__discount'> aNFT +{addNumberSpace((discount - 1) * 100)}% Rewards</div>}
          <NFTImages currentAccount={currentAccount} contractNFT={contractNFT} contractANFT={contractANFT} />
          <div className='header__content__address'>{getShortAddress(currentAccount)}</div>
          <div className='header__content__disconnect' onClick={onDisconnect}>
            <img src={logoutIcon} width={16} height={16} />
          </div>
        </div>
      )}
    </div>
  );
}