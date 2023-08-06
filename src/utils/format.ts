import { SupportedNetworks } from "../types/networks";

/**
 * Format wallet address to be sutable to be written in the UI components
 *
 * @param address User Wallet Address
 * @returns the wallet address after formating
 */
export const formatWalletAddress = (address: string): string => {
  if (!address) return "";
  return address.slice(0, 6).concat(" . . . ").concat(address.slice(-4));
};

/**
 * Formating the balance of the wallet to be suitable in viewing in our UI
 *
 * @param balance wallet (coin | token) balance with no limit (20 char)
 * @returns the balance formated to be at most 7 length
 */
export const formatBalance = (balance: string = ""): string => {
  if (balance.length > 7 && balance.indexOf(".") < 7) {
    return balance.slice(0, 7);
  }
  return balance;
};

/**
 * Returns the hexa form of chainId given as an intergar value
 * EX: 1 => '0x1'
 *
 * @param chainId integar form of the chain ID
 * @returns the chain Id in hexa form
 */
export const convertChainIdToHex = (chainId: number): string =>
  "0x".concat(chainId.toString(16));

/**
 * Change the network (chain) id from hexa form into intergar form
 * EX: '0x1' => 1
 *
 * NOTE: the return value returns chainId of `SupportedNetworks` type.
 * You should provide a supported chainId in hexa format otherwise it will give error
 *
 * @param chainId hexa form of the chain Id
 * @returns the chainId in integar format
 */
export const convertChainIdToInt = (chainId: string): SupportedNetworks =>
  parseInt(chainId.slice(2), 16);

/**
 * Convert ipfs protocol url to http to fetch it
 *
 * @param url the url with ipfs protocol (ipfs://........)
 * @returns http protocol of this url (https://ipfs.io/ipfs/.......)
 */
export const convertIpfsToHttp = (url: string): string => {
  return "https://ipfs.io/ipfs/" + url.slice(7);
};

/**
 * This function will make the url (if its an ipfs url) directs to the public
 * Gate way of the ipfs.
 *
 * We make this as some collections may have a url for pinata or something and it may be invalid
 *
 * @param url the url of the image
 */
export const convertHttpToIpfs = (url: string): string => {
  const index = url.indexOf("ipfs/");
  if (index !== -1) {
    return "https://ipfs.io/".concat(url.slice(index));
  }
  return url;
};

/**
 * Takes the error message as string and convert it into an array of two string items.
 * 1st -> is for error title
 * 2nd -> is for error message (short message)
 *
 * @param errorMessage error message
 * @returns formated error message
 */
export const formatTxErrors = (errorMessage: string): [string, string] => {
  if (!errorMessage.includes(":")) return [errorMessage, ""];
  const symbol = ":";
  const sentences = errorMessage.split(symbol);

  return [
    sentences[sentences.length - 2].trim(),
    sentences[sentences.length - 1].trim(),
  ];
};
