import { useEffect } from "react";

// MUI Components
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
// --> Selfmade Components
import Layout from "@/src/components/Layout";
import UserNFTsCard from "@/src/components/cards/UserNFTsCard";
import NoAccount from "@/src/components/caseComponents/NoAccount";
import Loader from "@/src/components/caseComponents/Loader";
import NoNFTs from "@/src/components/caseComponents/NoNFTs";

// Hooks and Functions
import { useMoralis, useChain } from "react-moralis";
import { useEvmWalletNFTs } from "@moralisweb3/next";
import useUserListings from "./api/hooks/useUserListings";
import { convertHttpToIpfs } from "@/src/utils/format";

// Data and Types
import type { EvmNft } from "@moralisweb3/common-evm-utils";
import { IListedItem } from "@/lib/listedItemsSchema";

// -------------

const ListItem = () => {
  ///////////////////////////////
  // State Managment And Hooks //
  ///////////////////////////////

  const { account } = useMoralis();
  const { chainId } = useChain();

  const { data: walletNFTs, isFetching: isFetchingWalletNFTs } =
    useEvmWalletNFTs({
      address: account!,
      format: "decimal",
      mediaItems: false,
      chain: chainId!,
    });

  const { userListings, errorUserListings, isLoading, mutate } =
    useUserListings(account);

  // - Getting user NFTs using moralis API
  // - Get user listings from our database
  useEffect(() => {
    if (account) {
      mutate();
      console.log("User NFTs");
      console.log(walletNFTs);
    }
  }, [account, walletNFTs]);

  return (
    <Layout>
      <Box sx={{ mt: "72px", py: 2, pb: 5 }}>
        <Container maxWidth="lg">
          {/* NFTs Cards */}
          <Box>
            <Typography variant="h2" pt={3} pb={2} color="text.secondary">
              List new NFT (Your NFTs)
            </Typography>
            {/* 1- We check that moralis API gets the NFTs of the user 
                2- userListings fetched succssfully
                3- there is items array in userListings. not empty array is considered true  */}
            {!account ? (
              <NoAccount />
            ) : isFetchingWalletNFTs || isLoading ? (
              <Loader />
            ) : errorUserListings ? (
              <Box>Error in user listings</Box>
            ) : walletNFTs && walletNFTs.length === 0 ? (
              <NoNFTs />
            ) : userListings && walletNFTs && walletNFTs.length !== 0 ? (
              <Box>
                <Grid container spacing={2}>
                  {walletNFTs.map((nft: EvmNft, i) => (
                    <Grid
                      item
                      key={"user-nft-card-" + i}
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <UserNFTsCard
                        nftAddress={nft.tokenAddress.lowercase}
                        collectionName={nft.name || ""}
                        tokenId={nft.tokenId.toString() || ""}
                        name={((nft.metadata as any)?.name as string) || ""}
                        imageUrl={convertHttpToIpfs(
                          ((nft.metadata as any)?.image as string) || ""
                        )}
                        tokenURI={convertHttpToIpfs(nft.tokenUri! || "")}
                        // In this step we are checking if this NFT is listed in our marketplace or not
                        isListed={userListings.items.some(
                          (userItem: IListedItem) =>
                            userItem.nftAddress.toLowerCase() ===
                              nft.tokenAddress.lowercase &&
                            userItem.tokenId === nft.tokenId.toString()
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box>There is something goes wrong, please refresh the page</Box>
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default ListItem;
