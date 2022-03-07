import BN from "bn.js";

export type DataType = {
  tokensClaimed: BN,
  tokensBought: BN,
  nftRequirement: string,
  fullVestingTimestamp: number,
  cliffTimestamp: number,
};