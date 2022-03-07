import React, {useEffect, useState} from "react";
import {Contract} from "web3-eth-contract";

import './NFTImages.css';
import {getNFTImage} from "../../utils/nft";
import {onlyUnique} from "../../utils/array";
import {getAllTokensOfOwnerByIndex} from "../../utils/getAllTokensOfOwnerByIndex";

interface NFTImageProps {
    currentAccount?: string;
    contractNFT?: Contract;
    contractANFT?: Contract;
}

export const NFTImages = ({ contractANFT, currentAccount, contractNFT }: NFTImageProps) => {
    const [images, setImages] = useState<string[]>([]);

    const handleOnMount = async () => {
        if (!currentAccount || !contractNFT || !contractANFT) {
            return;
        }
        try {
            const tokenIds = await getAllTokensOfOwnerByIndex(contractNFT, currentAccount);
            const tokenIdsANFT = await getAllTokensOfOwnerByIndex(contractANFT, currentAccount);
            tokenIds.forEach(async (tokenId) => {
                const image = await getNFTImage(tokenId, contractNFT);
                if (image) {
                    setImages((images) => [...images, image].filter(onlyUnique));
                }
            })
            tokenIdsANFT.forEach(async (tokenId) => {
                const image = await getNFTImage(tokenId, contractANFT);
                if (image) {
                    setImages((images) => [...images, image].filter(onlyUnique));
                }
            })
        } catch (e) {
            return;
        }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        handleOnMount();
    }, [currentAccount, contractNFT, contractANFT]);

    if (!currentAccount || !images.length) {
        return null;
    }

    return (
      <div className='NFTImages'>
          {images.filter((v) => v.length).map((image, i) => (
            <a href='https://opensea.io/account' key={image} target='_blank' rel='noreferrer'>
                <img className='NFTImage' src={image} alt='' style={{ zIndex: i + 1}} />
            </a>
          ))}
      </div>
    );
}