import React, {useState, useMemo, useEffect, useCallback} from "react";
import Web3 from 'web3';
import Web3Modal, { IProviderOptions } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import {
    CONTRACT_ADDRESS_TIMELOCK,
    CONTRACT_ADDRESS_DISTRIBUTOR,
    CONTRACT_ADDRESS_SUDAO, NETWORK_TYPE, CONTRACT_ADDRESS_A_NFT, NETWORK_ID,
} from '../../constants/contract';
import CONTRACT_SUDAO from '../../constants/suDAO.json';
import CONTRACT_DISTRIBUTOR from '../../constants/distributor.json';
import CONTRACT_TIMELOCK from '../../constants/timelock.json';
import CONTRACT_A_NFT from '../../constants/aNFT.json';

import './App.css';
import { Button } from "../Button/Button";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import {Form} from "../Form/Form";
import {Header} from "../Header/Header";
import {Footer} from "../Footer/Footer";
import {mul1eN} from "../../utils/parser";
import {DataType} from "../../utils/types";
import {hasKeys} from "../../utils/object";

const providerOptions: IProviderOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "7b02ac15229546749b13227c7a2e79e7",
            rpc: { [NETWORK_ID]: "https://polygon-rpc.com/" }
        },
    },
};
const web3Modal = new Web3Modal({ network: NETWORK_TYPE, cacheProvider: true, providerOptions });

export const App = () => {
    const [web3, setWeb3] = useState(new Web3(Web3.givenProvider));
    const [currentAccount, setCurrentAccount] = useState(undefined as string | undefined);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
    const [data, setData] = useState({} as DataType);
    const contractSuDAO = useMemo(() => new web3.eth.Contract(CONTRACT_SUDAO as any, CONTRACT_ADDRESS_SUDAO), [web3]);
    const contractTimelock = useMemo(() => new web3.eth.Contract(CONTRACT_TIMELOCK as any, CONTRACT_ADDRESS_TIMELOCK), [web3]);
    const contractDistributor = useMemo(() => new web3.eth.Contract(CONTRACT_DISTRIBUTOR as any, CONTRACT_ADDRESS_DISTRIBUTOR), [web3]);
    const contractANFT = useMemo(() => new web3.eth.Contract(CONTRACT_A_NFT as any, CONTRACT_ADDRESS_A_NFT), [web3]);
    const distributionId = useMemo(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return +(urlParams.get('distributionId') ?? 0);
    }, []);

    const [discount, setDiscount] = useState<number | undefined>(undefined);
    useEffect(() => {
        if (contractANFT && currentAccount) {
            try {
                contractANFT.methods.getLevel(currentAccount).call()
                  .then((v: string) => setDiscount(+v / 1000))
                  .catch(() => setDiscount(undefined));
            } catch (e) {
                setDiscount(undefined);
                return;
            }
        }
    }, [contractANFT, currentAccount]);

    // @ts-ignore
    const getCurrentAccount = () => setCurrentAccount(web3.eth.accounts.currentProvider?.selectedAddress);
    const getCurrentNetwork = async (newWeb3?: Web3) => {
        const currentWeb3 = newWeb3 ?? web3;
        if (currentWeb3.currentProvider) {
            const networkId = await currentWeb3.eth.net.getId();
            setIsCorrectNetwork(networkId === NETWORK_ID);
        }
    };

    const subscribeProvider = (provider: any) => {
        if (provider) {
            provider.on("accountsChanged", async () => {
                window.location.reload();
            });
            provider.on("chainChanged", async () => {
                window.location.reload();
            });
        }
    }

    const connectWallet = async () => {
        const provider = await web3Modal.connect();
        const web3: Web3 = new Web3(provider);
        subscribeProvider(provider);
        const accounts = await web3.eth.getAccounts();
        getCurrentNetwork(web3);
        const address = accounts[0];
        setWeb3(web3);
        setCurrentAccount(address);
    };

    const disconnectWallet = useCallback(async () => {
        // @ts-ignore
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            // @ts-ignore
            await web3.currentProvider.close();
        }
        await web3Modal.clearCachedProvider();
        setCurrentAccount(undefined);
        setIsCorrectNetwork(false);
    }, [web3, setCurrentAccount]);

    useEffect(() => {
        if (web3.currentProvider) {
            getCurrentNetwork();
            getCurrentAccount();
            subscribeProvider(web3.eth.accounts.currentProvider);
        }
    }, []);

    // PRESALE - GET INFO
    const getData = async () => {
        const distributorData: Record<string, any> = await contractDistributor.methods.distributions(distributionId).call();
        const timelockData: Record<string, any> = await contractTimelock.methods.accounts(currentAccount).call();
        if (hasKeys(timelockData)) {
            const data = {
                tokensClaimed: mul1eN(web3.utils.toBN(+timelockData.amount_already_withdrawn_div1e12 ?? 0), 12),
                tokensBought: mul1eN(web3.utils.toBN(+timelockData.amount_under_vesting_div1e12 ?? 0), 12),
                nftRequirement: distributorData?.nftRequirement,
                fullVestingTimestamp: +timelockData?.vesting_ends_timestamp,
                cliffTimestamp: +timelockData?.cliff_timestamp,
            };
            setData(data);
        }
    };
    useEffect(() => {
        if (currentAccount && contractDistributor && contractTimelock) {
            getData();
        }
    }, [currentAccount, distributionId, contractDistributor, contractTimelock]);

    const handleUpdate = useCallback(() => {
        getData();
    }, [currentAccount, distributionId, contractDistributor, contractTimelock]);

    return (
        <div className="App">
            <Header
              contractANFT={contractANFT}
              discount={discount}
              currentAccount={currentAccount}
              onDisconnect={disconnectWallet}
              nftRequirement={data.nftRequirement}
              web3={web3}
            />
            {!currentAccount && (
              <div className="App__login">
                  <Form isAlignCenter>
                      <div className='App__login-text'>{`Please ${window.ethereum ? 'connect' : 'install'} wallet`}</div>
                      <Button onClick={connectWallet} text='Connect' />
                  </Form>
              </div>
            )}
            {currentAccount && !isCorrectNetwork && (
              <div className='App__error-text'>
                  Please, switch the network to Polygon.
              </div>
            )}
            {currentAccount && isCorrectNetwork && (
                <ContentContainer
                  data={data}
                  onUpdate={handleUpdate}
                  contractTimelock={contractTimelock}
                  contractSuDAO={contractSuDAO}
                  currentAccount={currentAccount}
                  web3={web3}
                />
            )}
            <Footer />
        </div>
    );
}
