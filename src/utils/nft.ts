import {Contract} from "web3-eth-contract";
import axios from "axios";

const IPFS_PREFIX = 'ipfs://';
const IPFS_SUFFIX = '?id=';

export const getNFTImage = async (tokenId: string, contractNFT: Contract) => {
  const tokenURI = await contractNFT.methods.tokenURI(tokenId).call() as string;
  if (!tokenURI) {
    return;
  }

  const removeIndex = tokenURI.indexOf(IPFS_SUFFIX);
  const url = removeIndex === - 1 ? tokenURI : tokenURI.slice(0, removeIndex);
  const response = await axios.get(url);

  const image = (response.data as Record<string, string>).image;

  if (image?.startsWith(IPFS_PREFIX)) {
    const hash = image.slice(IPFS_PREFIX.length);
    return `https://ipfs.io/ipfs/${hash}`;
  }

  return image;
}