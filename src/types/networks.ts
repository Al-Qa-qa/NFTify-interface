export enum SupportedNetworks {
  SEPOLIA = 11155111,
}

type ChainInfo = {
  unique_name: string;
  view_name: string;
  chainId: string;
  scanner: string;
  coin: string;
  image: string;
};

type SupportedChainIDS = {
  [chainId in SupportedNetworks]: ChainInfo;
};

export const SUPPORTED_CHAIN_IDS: SupportedChainIDS = {
  [SupportedNetworks.SEPOLIA]: {
    unique_name: "sepolia",
    view_name: "Sepolia Ethereum",
    chainId: "0xaa36a7",
    scanner: "https://sepolia.etherscan.io/",
    coin: "ETH",
    image: "ethereum.svg",
  },
};
