import {onlyUnique} from "./array";
import {Contract} from "web3-eth-contract";

export const getAllTokensOfOwnerByIndex = async (contractNFT: Contract, currentAccount: string) => {
  let tokenIds = [] as string[];
  let i = 0;
  while (i >= 0) {
    try {
      const tokenId = (await contractNFT.methods.tokenOfOwnerByIndex(currentAccount, i).call()) as string;
      tokenIds = [...tokenIds, tokenId].filter(onlyUnique);
      ++i;
    } catch (e) {
      i = -1;
      return tokenIds;
    }
  }

  return tokenIds;
}