import { Fragment, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

// UI Components
import Image from "next/image";
import Link from "@/src/Link";
import { toast } from "react-toastify";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// --> Our Components
import Layout from "@/src/components/Layout";
import ManualTable from "@/src/components/ManualTable";

// Images
import ethereumCoin from "@/src/assets/images/ethereum-coin.svg";
import placeholderImage from "@/src/assets/images/nfts/placeholder.png";

// Icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Hooks and functions
import { useRouter } from "next/router";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTokenMetadata from "../api/hooks/useTokenMetadata";
import {
  convertChainIdToInt,
  formatTxErrors,
  formatWalletAddress,
} from "@/src/utils/format";

// Data and Types
import { ABIs, contractAddresses } from "@/constants";
import { IListedItem } from "@/lib/listedItemsSchema";
import { ErrorRespond } from "@/src/types/server";
import { SUPPORTED_CHAIN_IDS, SupportedNetworks } from "@/src/types/networks";

// ------------

type itemDbType = {
  itemDb: IListedItem | null;
  resError?: ErrorRespond;
};

function NFTPage({ itemDb, resError }: itemDbType) {
  const router = useRouter();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { chainId: chainIdHex, account, isWeb3Enabled } = useMoralis();

  // Get the symbol of this NFT collection address
  const { runContractFunction: fetchSymbol, data: symbol } = useWeb3Contract({
    contractAddress: itemDb?.nftAddress,
    abi: ABIs.IERC721,
    functionName: "symbol",
    params: {},
  });

  // buy new item from our marketplace contract function executer function
  const { runContractFunction: fetchBuyItem } = useWeb3Contract({
    contractAddress: contractAddresses.sepolia.NftMarketplace,
    abi: ABIs.NftMarketplace,
    functionName: "buyItem",
    params: { nftAddress: itemDb?.nftAddress, tokenId: itemDb?.tokenId },
    msgValue: itemDb?.price,
  });

  const { metadata } = useTokenMetadata(itemDb?.tokenURI || "");

  /**
   * Buy new item
   */
  const buyItem = async () => {
    console.log("Buying Item");
    await fetchBuyItem({
      onSuccess: async (tx: any) => {
        // Waiting the tx to be confirmed
        await toast.promise(tx.wait(1), {
          pending: "Waiting Transaction Confirmation",
          success: "Item has been bought successfully",
          error: "Failed to buy the item",
        });
        console.log("The item has been bought successfully");

        // Delete the item from our database as its not listed now
        try {
          console.log("Deleting Item from our Database");
          const { data } = await toast.promise(
            axios.delete(`/api/listedItems/${itemDb?._id}`, {
              headers: {
                "content-type": "application/json",
              },
            }),
            {
              pending: "Deleting item from DB",
              success: "Item deleted successfully",
              error: "Failed to delete from the DB",
            }
          );
          toast.dismiss();
          const redirectTo = setTimeout(() => {
            router.push("/list-item");
            clearTimeout(redirectTo);
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
      onError: (err: any) => {
        console.log(err);
        let errorNotify: [string, string];
        if (err.error) {
          errorNotify = formatTxErrors(err.error.message);
        } else {
          errorNotify = formatTxErrors(err.message);
        }
        toast.error<JSX.Element>(
          <>
            <Typography variant="h6">{errorNotify[0]}</Typography>
            <Typography variant="subtitle2">{errorNotify[1]}</Typography>
          </>
        );
      },
    });
  };

  // Add NFT item informations
  // - We are getting the item information from our DB and pass it as a prop
  // - We extract the information we need and store it in item variable in state managment
  // to use it to show the item information
  useEffect(() => {
    if (itemDb && isWeb3Enabled && account) {
      console.log("Getting symbol...");
      fetchSymbol({
        onSuccess: (result) => {
          console.log(("The symbol is :" + result) as string);
        },
        onError: (err) => {
          console.log("Error in getting symbol");
          console.log(err);
        },
      });
    }
  }, [itemDb, isWeb3Enabled, account]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ pb: 5, mt: "72px" }}>
        {/* Preview Item information if there is an item  */}
        {itemDb ? (
          <Box pt={2}>
            <Grid container spacing={4} wrap="wrap-reverse">
              <Grid item xs={12} md={5}>
                {!smallScreen && (
                  <Paper elevation={3}>
                    <Image
                      // in the src we check if the imageUrl is valid or not to know if we will render
                      // the placeholder image or a vaild imageUrl
                      // NOTE: before saving images in the DB we checked for imageUrl if its not existed
                      // We make it equal noImageUrl
                      src={
                        itemDb.imageUrl === "noImageUrl"
                          ? placeholderImage
                          : itemDb.imageUrl
                      }
                      alt={itemDb.collectionName + "NFT"}
                      width={600}
                      height={600}
                      style={{ width: "100%", height: "fit-content" }}
                      priority
                    />
                  </Paper>
                )}
                <Box mt={{ md: 3 }}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="property-content"
                      id="item-properties"
                    >
                      <Typography>Properties</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ManualTable
                        tableBody={[
                          {
                            key: "Symbol",
                            value: (symbol as any) || "",
                          },
                          {
                            key: "Owner",
                            value:
                              itemDb.seller.toLowerCase() ===
                              account?.toLowerCase()
                                ? "you"
                                : formatWalletAddress(itemDb.seller),
                            to: `${
                              SUPPORTED_CHAIN_IDS[SupportedNetworks.SEPOLIA]
                                .scanner
                            }address/${itemDb.seller}`,
                          },
                          {
                            key: "Collection",
                            value: itemDb.collectionName,
                          },
                          {
                            key: "Address",
                            value: formatWalletAddress(itemDb.nftAddress),
                            to: `${
                              SUPPORTED_CHAIN_IDS[SupportedNetworks.SEPOLIA]
                                .scanner
                            }address/${itemDb.nftAddress}`,
                          },
                        ]}
                      />
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="property-content"
                      id="item-properties"
                    >
                      <Typography>Chain info</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ManualTable
                        tableBody={[
                          {
                            key: "Network Name",
                            value: "Sepolia",
                          },
                          {
                            key: "Chain ID",
                            value: chainIdHex
                              ? convertChainIdToInt(chainIdHex).toString()
                              : "",
                          },
                        ]}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                {smallScreen && (
                  <Paper elevation={3} sx={{ maxWidth: "600px" }}>
                    <Image
                      src={
                        itemDb.imageUrl === "noImageUrl"
                          ? placeholderImage
                          : itemDb.imageUrl
                      }
                      alt={itemDb.collectionName + "NFT"}
                      width={600}
                      height={600}
                      style={{
                        width: "100%",

                        height: "fit-content",
                      }}
                      priority
                    />
                  </Paper>
                )}
                <Box mt={{ xs: 3, md: 0 }}>
                  <Box mb={3}>
                    <Typography variant="h4" color="text.secondary" mb={0.5}>
                      {itemDb.collectionName} Collection
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="h2" mb={1}>
                        {metadata?.name || ""}
                      </Typography>
                      <Typography variant="h2" mb={1} color="text.secondary">
                        # {itemDb.tokenId}
                      </Typography>
                    </Stack>
                    <Typography>
                      Owned by:{" "}
                      <Link
                        href={`${
                          SUPPORTED_CHAIN_IDS[SupportedNetworks.SEPOLIA].scanner
                        }address/${itemDb.seller}`}
                        target="_blank"
                      >
                        {/* {formatWalletAddress(itemDb.seller)} */}
                        {itemDb.seller.toLowerCase() === account?.toLowerCase()
                          ? "you"
                          : formatWalletAddress(itemDb.seller)}
                      </Link>
                    </Typography>
                    <Typography
                      variant="h4"
                      color="text.secondary"
                      mt={4}
                      mb={0.5}
                    >
                      Description
                    </Typography>
                    <Typography variant="subtitle2" mb={3}>
                      {metadata?.description || ""}
                    </Typography>
                    <Box component={Paper} p={2} variant="outlined">
                      <Stack direction="column" spacing={1}>
                        <Typography variant="h4" color="text.secondary">
                          Price
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Image
                            src={ethereumCoin}
                            width={20}
                            alt="ethereum coin"
                          />
                          <Typography variant="h5">
                            {ethers.utils.formatEther(itemDb.price)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          pt={1}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={buyItem}
                          >
                            Buy Item
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={() => {
                              toast.info("This function is not implemented");
                            }}
                          >
                            Make Offer
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Attributes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {Array.isArray(metadata?.attributes) &&
                        metadata?.attributes.map(
                          (attrObject: any, i: number) => (
                            <Fragment key={"attr-frame-" + i}>
                              <ManualTable
                                tableBody={Object.keys(attrObject).map(
                                  (attrKey) => ({
                                    key: attrKey,
                                    value: attrObject[attrKey],
                                  })
                                )}
                              />
                            </Fragment>
                          )
                        )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : resError ? (
          // If there is any error happens while getting the item we will show error page
          <Box pt={5}>
            <Typography variant="h2" color="error">
              Page not Found
            </Typography>
            <Typography>{resError?.message}</Typography>
          </Box>
        ) : (
          // Otherwise we will make a loading screen
          <Box>
            <Typography>LOADING</Typography>
          </Box>
        )}
      </Container>
    </Layout>
  );
}

/**
 * Fetch GET request to get the item in our database that has the nftAddress and tokenId equal
 * to that are written as parameters
 *
 * @param context
 * @returns JSX props (an item object in success or error in failed)
 */
export async function getServerSideProps(context: any) {
  const [nftAddress, tokenId] = context.params.slug;

  try {
    // Fetch the items from the API endpoint
    const { data } = await axios.get(
      `${process.env.API_URL}listedItems/${nftAddress}/${tokenId}`
    );
    const itemDb: IListedItem = data.item;

    // Pass the item as a prop to the component
    return { props: { itemDb } };
  } catch (err: any) {
    console.log("Error in Getting item info");
    // Handle errors if the API call fails
    console.log(err.response.data);
    console.log("detailed error :-");
    console.log(err);
    return {
      props: { itemDb: null, resError: err.response.data },
    };
  }
}

export default NFTPage;
