// The item that will be listed in the database
export type ListItemType = {
  seller: string;
  nftAddress: string;
  collectionName: string;
  tokenId: string;
  price: string;
  tokenURI: string;
  imageUrl: string;
};

// NFT item page that displays all item information
// We made it as another tyoe than `ListItemType` to be easy for developers
export type SingleItemType = ListItemType & { id: string };

// Mint new items cards
export type MintCardType = {
  nftAddress: string;
  collectionName: string;
  imageUrl: string;
};

// Items that are listed by the user
export type UserListingsCardType = {
  id: string;
  nftAddress: string;
  collectionName: string;
  tokenId: string;
  imageUrl: string;
  price: string;
};

// Listed item to be bought from the market
export type BuyListingCardType = {
  id: string;
  seller: string;
  nftAddress: string;
  collectionName: string;
  tokenId: string;
  price: string;
  imageUrl: string;
};

// User NFTs that he has
export type UserNFTsCardType = {
  nftAddress: string;
  collectionName: string;
  tokenId: string;
  name: string;
  tokenURI: string;
  imageUrl: string;
  isListed: boolean;
};
