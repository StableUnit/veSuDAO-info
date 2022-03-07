import {useCallback, useEffect, useMemo, useState} from "react";
import {Contract} from "web3-eth-contract";
import BN from "bn.js";
import Web3 from "web3";

import {Button} from "../Button/Button";
import {addNumberSpace, toHRNumberFloat} from "../../utils/parser";
import {Balance} from "../Balance/Balance";
import {DEFAULT_ERROR_TEXT, getErrorMessage} from "../../utils/error";

import './Claim.css';
import {CONTRACT_ADDRESS_SUDAO, CONTRACT_ADDRESS_VE_SUDAO} from "../../constants/contract";
import {addTokenToWallet} from "../../utils/wallet";
import {ErrorText, ErrorType} from "../ErrorText/ErrorText";

interface ClaimProps {
    contractTimelock: Contract;
    contractSuDAO: Contract;
    currentAccount: any;
    onUpdate: () => void;
    cliffTimestamp: number;
    suDAODecimals: number;
    realTokenClaimed: number;
    realTokenBought: number;
    web3: Web3;
}
const SET_INTERVAL_DELAY = 10000;

export const Claim = ({
    contractTimelock,
    currentAccount,
    suDAODecimals,
    onUpdate,
    web3,
    cliffTimestamp,
    realTokenClaimed,
    realTokenBought,
}: ClaimProps) => {
    const [error, setError] = useState('');
    const [errorType, setErrorType] = useState<ErrorType | undefined>(undefined);
    const [isLoadingClaim, setIsLoadingClaim] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [cliffTimePassed, setCliffTimePassed] = useState(false);
    const [availableToClaim, setAvailableToClaim] = useState(new BN(0));
    const [lockedBalance, setLockedBalance] = useState(new BN(0));

    const getAvailableToClaim = async () => {
        if (contractTimelock && currentAccount) {
            const res = await contractTimelock.methods.availableToClaim(currentAccount).call();
            setAvailableToClaim(new BN(res));
        }
    };

    const updateBalance = async () => {
        if (contractTimelock && currentAccount) {
            const balance = await contractTimelock.methods.balanceOf(currentAccount).call();
            setLockedBalance(new BN(balance));
        }
    }

    useEffect(() => {
        updateBalance();
    }, [contractTimelock, currentAccount, realTokenBought]);

    const handleUpdate = () => {
        onUpdate();
        updateBalance();
    }

    const handleClaim = async () => {
        try {
            setIsClaimed(false);
            setIsLoadingClaim(true);
            await contractTimelock.methods.claim().send({ from: currentAccount });
            await getAvailableToClaim();
            handleUpdate();
            setIsClaimed(true);
            setIsLoadingClaim(false);
        } catch (e) {
            setIsLoadingClaim(false);
            const message = getErrorMessage(e);
            if (message) {
                setError(message);
            } else {
                setError(DEFAULT_ERROR_TEXT);
            }
            setErrorType('error');
        }
    }

    const checkAvailableToCliff = async () => {
        const block = await web3.eth.getBlockNumber();
        const blockInfo = await web3.eth.getBlock(block);
        if (blockInfo.timestamp < cliffTimestamp) {
            setCliffTimePassed(false);
            setError('Сliff time has not come yet');
            setErrorType('warning');
            return;
        } else {
            setError('');
            setCliffTimePassed(true);
        }
    }

    useEffect(() => {
        checkAvailableToCliff();
        const intervalAvailableToCliff = setInterval(() => { checkAvailableToCliff() }, SET_INTERVAL_DELAY);

        getAvailableToClaim();
        const intervalAvailableToClaim = setInterval(() => { getAvailableToClaim() }, SET_INTERVAL_DELAY);

        return () => {
            clearInterval(intervalAvailableToCliff);
            clearInterval(intervalAvailableToClaim);
        }
    }, [contractTimelock, currentAccount, cliffTimestamp]);

    const availableToClaimHR = useMemo(() => toHRNumberFloat(availableToClaim, suDAODecimals), [availableToClaim, suDAODecimals])
    const realLockedBalance = useMemo(() => toHRNumberFloat(lockedBalance, suDAODecimals), [lockedBalance, suDAODecimals])

    const handleAddTokenToWallet = useCallback(() => {
        addTokenToWallet({
            address: CONTRACT_ADDRESS_SUDAO,
            name: 'suDAO',
            decimals: suDAODecimals,
        })
    }, [suDAODecimals]);

    const handleAddVeTokenToWallet = useCallback(() => {
        addTokenToWallet({
            address: CONTRACT_ADDRESS_VE_SUDAO,
            name: 'veSuDAO',
            decimals: suDAODecimals,
        })
    }, [suDAODecimals]);

    return (
        <div className="Claim">
            <Balance title="Vesting balance" value={`${addNumberSpace(realLockedBalance)} suDAO`}>
                <div className="Claim__addToken--inner" onClick={handleAddVeTokenToWallet}>Add veSuDAO to Metamask</div>
            </Balance>
            <div className="Claim__info">
                <div className="Claim__info__container">
                    <div className="Claim__info__title">Available to claim</div>
                    <div className="Claim__info__value">
                        {addNumberSpace(availableToClaimHR)}
                        <span className='Claim__info__currency'>&nbsp;suDAO</span>
                    </div>
                </div>
                <div className="Claim__info__container">
                    <div className="Claim__info__title">Already claimed</div>
                    <div className="Claim__info__value">
                        {addNumberSpace(realTokenClaimed)}
                        <span className='Claim__info__currency'>&nbsp;suDAO</span>
                    </div>
                </div>
            </div>
            <ErrorText text={error} type={errorType} />
            <div className="FormAction__buttons">
                <Button
                  onClick={handleClaim}
                  text={isLoadingClaim ? 'PENDING...' : isClaimed ? 'CLAIMED' : 'CLAIM TOKENS'}
                  disabled={isLoadingClaim || availableToClaimHR <= 0 || !cliffTimePassed}
                />
            </div>
            <div className="Claim__addToken" onClick={handleAddTokenToWallet}>Add suDAO to Metamask</div>
        </div>
    )
}