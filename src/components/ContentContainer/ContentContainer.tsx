import React, {useEffect, useState} from "react";
import { Contract } from 'web3-eth-contract';
import Web3 from "web3";

import {addNumberSpace, getTokenUrl, toHRNumberFloat} from "../../utils/parser";
import {Claim} from "../Claim/Claim";
import {DataType} from "../../utils/types";

import './ContentContainer.css';
import BN from "bn.js";
import {Info} from "../Info/Info";
import {getDateLeft} from "../../utils/date";

interface InfoContainerProps {
    data: DataType;
    contractTimelock: Contract;
    contractSuDAO: Contract;
    currentAccount: any;
    onUpdate: () => void;
    web3: Web3;
}

const TIMESTAMP_INTERVAL_DELAY = 10000;

export const ContentContainer = ({ data, contractTimelock, contractSuDAO, currentAccount, web3, onUpdate }: InfoContainerProps) => {
    const [suDAODecimals, setSuDAODecimals] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTimestamp, setCurrentTimestamp] = useState(0);

    const { tokensBought = new BN(0), tokensClaimed = new BN(0), cliffTimestamp, fullVestingTimestamp } = data;

    // GET TIMESTAMP
    const getTimestamp = async () => {
        const block = await web3.eth.getBlockNumber();
        const blockInfo = await web3.eth.getBlock(block);
        setCurrentTimestamp(+blockInfo.timestamp);
    }

    useEffect(() => {
        getTimestamp();
        const intervalTimestamp = setInterval(getTimestamp, TIMESTAMP_INTERVAL_DELAY);

        return () => {
            clearInterval(intervalTimestamp);
        }
    }, [web3]);

    // TOKEN CONTRACT INFO
    const getInfo = async () => {
        setSuDAODecimals(+await contractSuDAO.methods.decimals().call());
        setIsLoading(false);
    }
    useEffect(() => {
        try {
            setIsLoading(true);
            getInfo().then(() => setIsLoading(false));
        } catch (e) {
            setIsLoading(false);
        }
    }, [web3]);

    const handleUpdate = async () => {
        onUpdate();
        await getInfo();
    }

    if (isLoading) {
        return <div className='ContentContainer__no-data'>Loading ...</div>;
    }

    const realTokenBought = toHRNumberFloat(tokensBought, suDAODecimals);
    const realTokenClaimed = toHRNumberFloat(tokensClaimed, suDAODecimals);

    return (
        <div className='ContentContainer'>
            <div className='ContentContainer__timestamps'>
                <Info title='Cliff date' value={getDateLeft(currentTimestamp, cliffTimestamp)} tooltip='cliff: rewards tokens are locked until this date. vesting: tokens are unlock gradually from cliff date until fully vested.' />
                <Info title='Full vesting date' value={getDateLeft(currentTimestamp, fullVestingTimestamp)} />
            </div>
            <Claim
              realTokenBought={realTokenBought}
              contractTimelock={contractTimelock}
              contractSuDAO={contractSuDAO}
              currentAccount={currentAccount}
              onUpdate={handleUpdate}
              cliffTimestamp={cliffTimestamp}
              suDAODecimals={suDAODecimals}
              realTokenClaimed={realTokenClaimed}
              web3={web3}
            />
        </div>
    );
};
