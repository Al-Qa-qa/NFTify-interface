import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

// UI Components
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "@/src/Link";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// Selfmade Components
import ManualTable from "@/src/components/ManualTable";

// images
import placeholderImage from "@/src/assets/images/nfts/placeholder.png";

// Icons
import CloseIcon from "@mui/icons-material/Close";

// Hooks and Functions
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { formatTxErrors, formatWalletAddress } from "@/src/utils/format";

// Data and Types
import { ABIs, contractAddresses } from "@/constants";
import { BuyListingCardType } from "@/src/types/data";
import { SUPPORTED_CHAIN_IDS, SupportedNetworks } from "@/src/types/networks";

// --------------

// We have two dialog boxes. one is for approvability type, and the other is for buying
function BuyListingCard({
  id,
  seller,
  nftAddress,
  collectionName,
  tokenId,
  imageUrl,
  price,
}: BuyListingCardType) {
  ///////////////////////////////
  // State Managment And Hooks //
  ///////////////////////////////

  const [changedItemId, setChangedItemId] = useState<string>("");

  const [openBuyDialog, setOpenBuyDialog] = useState<boolean>(false);

  const { account } = useMoralis();
  const { fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

  ///////////////////////////
  // UI handling Functions //
  ///////////////////////////

  /**
   * Close buy item dialog
   */
  const handleCloseBuyDialog = () => {
    setOpenBuyDialog(false);
  };

  /**
   * Buy new item
   *
   * It will open a dialog to display item information and then buy it
   */
  const handleBuyItem = async () => {
    console.log(">BUY ITEM<");
    setOpenBuyDialog(true);
  };

  ////////////////////////////////
  // Web3 Interacting Functions //
  ////////////////////////////////

  /**
   * buy new item from the marketplace
   */
  const buyItem = async () => {
    console.log("Trigger buyItem function");
    const options = {
      contractAddress: contractAddresses.sepolia.NftMarketplace,
      functionName: "buyItem",
      abi: ABIs.NftMarketplace,
      params: { nftAddress, tokenId },
      msgValue: price,
    };
    await fetch({
      params: options,
      onSuccess: async (tx: any) => {
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
            axios.delete(`/api/listedItems/${id}`, {
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
          console.log("Bought Item Id: " + id);
          setChangedItemId(id);
        } catch (err) {
          console.log(err);
        }
      },
      onError: (err: any) => {
        console.log("Error in buying item");
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
    setOpenBuyDialog(false);
  };

  return (
    <>
      {changedItemId !== id ? (
        <Paper sx={{ p: 2 }} elevation={5}>
          <Typography mb={1}>
            Owner:{" "}
            <Link
              color="primary"
              href={`${
                SUPPORTED_CHAIN_IDS[SupportedNetworks.SEPOLIA].scanner
              }address/${seller}`}
              target="_blank"
              underline="none"
            >
              {account && seller.toLowerCase() === account.toLowerCase()
                ? "you"
                : formatWalletAddress(seller)}
            </Link>
          </Typography>
          <Divider />

          <Box>
            <ButtonBase
              LinkComponent={Link}
              href={`items/${nftAddress}/${tokenId}`}
              sx={{ ":hover": { bgcolor: "#333" } }}
            >
              <Image
                src={imageUrl === "noImageUrl" ? placeholderImage : imageUrl}
                alt={collectionName + "NFT"}
                width={500}
                height={500}
                style={{ width: "100%", height: "fit-content" }}
                priority
              />
            </ButtonBase>
          </Box>

          <Stack direction="row" justifyContent="space-between" my={2}>
            <Stack direction="column">
              <Typography variant="h6" color="text.secondary">
                {collectionName}
              </Typography>
              <Typography variant="subtitle1"># {tokenId}</Typography>
            </Stack>
            <Stack direction="column" justifyContent="flex-end">
              <Typography variant="h6" color="text.secondary" textAlign="end">
                Price
              </Typography>
              <Typography variant="subtitle1" textAlign="end">
                {ethers.utils.formatEther(price!)} ETH
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />
          {/* If the Update Box is activated we will render update item form, otherwise*/}
          <Button
            variant="contained"
            fullWidth
            disabled={isFetching || isLoading}
            onClick={handleBuyItem}
          >
            Buy item
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, height: "100%" }} elevation={5}>
          <Typography>
            This item has been changed, please refresh the page to see changes
          </Typography>
        </Paper>
      )}

      {/* Buy Dialog */}
      <Dialog
        open={openBuyDialog}
        aria-labelledby="alert-buy-dialog-title"
        aria-describedby="alert-buy-dialog-description"
      >
        <Stack
          direction="row"
          sx={{
            py: 1,
            px: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle id="alert-approve-dialog-title" sx={{ p: 0 }}>
            Buy an item
          </DialogTitle>
          <IconButton onClick={handleCloseBuyDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ p: 2 }}>
          <Alert severity="info">
            When buying this item it will be transfered from the seller to you,
            and the price you pay will be in the seller balance.
          </Alert>
          <br />
          <ManualTable
            tableBody={[
              {
                key: "Collection Name",
                value: collectionName,
              },
              {
                key: "Address",
                value: nftAddress,
              },
              {
                key: "Token",
                value: tokenId,
              },
              {
                key: "Price",
                value: `${ethers.utils.formatEther(price || "0")} ETH`,
              },
            ]}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={buyItem}
            autoFocus
            fullWidth
            size="large"
          >
            Buy Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BuyListingCard;
