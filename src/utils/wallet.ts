import detectEthereumProvider from "@metamask/detect-provider";

interface AddTokenToWalletArgs {
  address: string;
  name: string;
  decimals: number;
}
export const addTokenToWallet = async ({ address, decimals, name }: AddTokenToWalletArgs) => {
  const provider = await detectEthereumProvider();

  // @ts-ignore
  provider.sendAsync({
    method: 'metamask_watchAsset',
    params: {
      "type": "ERC20",
      "options": {
        "address": address,
        "symbol": name,
        "decimals": decimals
      },
    },
    id: Math.round(Math.random() * 100000),
  });
};