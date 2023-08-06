import React, { ChangeEvent, FormEvent, useState } from "react";
import { ethers, BigNumber } from "ethers";
import axios from "axios";

// UI Components
import { toast } from "react-toastify";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// Selfmade Components
import ManualTable from "../ManualTable";

// Images
import placeholderImage from "@/src/assets/images/nfts/placeholder.png";

// Icons
import CloseIcon from "@mui/icons-material/Close";

// Hooks and Functions
import { useWeb3ExecuteFunction } from "react-moralis";
import { formatTxErrors } from "@/src/utils/format";

// Data and Types
import { ABIs, contractAddresses } from "@/constants";
import { UserListingsCardType } from "@/src/types/data";

// --------------

// We have two dialog boxes. one is for approvability type, and the other is for buying
type OpenedDialog = "delete" | "removeAccess";

type AccessType = "onlyThis" | "all";

function UserListingsCard({
  id,
  nftAddress,
  collectionName,
  tokenId,
  imageUrl,
  price,
}: UserListingsCardType) {
  ///////////////////////////////
  // State Managment And Hooks //
  ///////////////////////////////

  const [changedItemId, setChangedItemId] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openAccessDialog, setOpenAccessDialog] = useState<boolean>(false);
  const [accessType, setAccessType] = useState<AccessType>("onlyThis");
  const [updateBox, setUpdateBox] = useState<boolean>(false);

  const [newPrice, setNewPrice] = useState<string>(
    ethers.utils.formatEther(price || "0")
  );
  const [newPriceError, setNewPriceError] = useState<boolean>(false);

  const { fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

  ///////////////////////////
  // UI handling Functions //
  ///////////////////////////

  /**
   * Opens the dialog box that you want to open (sellected as a parameter)
   *
   * @param dialogToOpen the dialog you want to open
   */
  const handleOpenDialog = (dialogToOpen: OpenedDialog) => {
    if (dialogToOpen === "delete") {
      setOpenDeleteDialog(true);
    }
    if (dialogToOpen === "removeAccess") {
      setOpenAccessDialog(true);
    }
  };

  /**
   * Closes the dialog box that you want to close (sellected as a parameter)
   *
   * @param dialogToClose the dialog you want to close
   */
  const handleCloseDialog = (dialogToClose: OpenedDialog) => {
    if (dialogToClose === "delete") {
      setOpenDeleteDialog(false);
    }
    if (dialogToClose === "removeAccess") {
      setOpenAccessDialog(false);
    }
  };

  /**
   * Change the price of the item (this happenes in editing mode only)
   *
   * @param e change event of input element
   */
  const handleChangeNewPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPriceError(false);
    if (isNaN(+e.target.value)) {
      setNewPriceError(true);
    }
    // setInputPrice(e.target.value);
    setNewPrice(e.target.value);
  };

  /**
   * Close edititing item mode
   */
  const handleCloseEditBox = () => {
    setUpdateBox(false);
  };

  /**
   * Delete listed items
   */
  const handleDeleteItem = async () => {
    console.log(">DELTE ITEM<");
    handleOpenDialog("delete");
  };

  const handleEditItem = async () => {
    console.log(">EDITING ITEM<");
    setUpdateBox(true);
  };

  ////////////////////////////////
  // Web3 Interacting Functions //
  ////////////////////////////////

  /**
   * Remove the marketplace from the access of this NFT
   */
  const removeAccess = async () => {
    if (accessType === "onlyThis") {
      await fetch({
        params: {
          contractAddress: nftAddress,
          functionName: "approve",
          abi: ABIs.IERC721,
          params: {
            to: ethers.constants.AddressZero,
            tokenId: tokenId,
          },
        },
        onSuccess: async (tx: any) => {
          await toast.promise(tx.wait(1), {
            pending: "Waiting Transaction Confirmation",
            success: "NFTify does't has access now",
            error: "Failed to remove the access",
          });

          console.log("Its NOT Approved Now by the market");

          handleCloseDialog("removeAccess");
        },
        onError: (err: any) => {
          // This error may reverts if you want to approve yourself, or the address to be approved has full access
          // We didint took this error in consideration, as we are implemented the logic correctly :)

          // err keys: [code, message, stack]
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
    }
    handleCloseDialog("removeAccess");
  };

  /**
   * Delete an item from the marketplace
   * - Ask for removing the market accessipility to this item after deleting
   */
  const deleteItem = async () => {
    console.log("Deleting item from the marketplace");
    const options = {
      contractAddress: contractAddresses.sepolia.NftMarketplace,
      functionName: "cancelListing",
      abi: ABIs.NftMarketplace,
      params: { nftAddress, tokenId },
    };
    await fetch({
      params: options,
      onSuccess: async (tx: any) => {
        await toast.promise(tx.wait(1), {
          pending: "Waiting Transaction Confirmation",
          success: "Transaction Confirmed",
          error: "Failed to remove item",
        });

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
          console.log("Deleted item Id: " + id);
          setChangedItemId(id);
        } catch (err) {
          console.log(err);
        }
        // Open removing access dialog if
        console.log("Accesstype: " + accessType);
        if (accessType === "onlyThis") handleOpenDialog("removeAccess");
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

    handleCloseDialog("delete");

    // We checks if the marketplace has an access to this token (only this token)
    // if he has an access then we will go normal (previewing access dialog after deleting the item)
    // in case it has a full access then we will not show the dialog
    // NOTE: We made it possible to allow full access but not removing it
    console.log("Check approve to this item only");
    await fetch({
      params: {
        contractAddress: nftAddress,
        functionName: "getApproved",
        abi: ABIs.IERC721,
        params: {
          tokenId: tokenId,
        },
      },
      onSuccess: (returnedValue: any) => {
        const approvedAddress: string = returnedValue as string;
        console.log("Approved address: " + approvedAddress);
        if (approvedAddress !== contractAddresses.sepolia.NftMarketplace) {
          console.log("Its NOT Approved By Market, it has full access");
          setAccessType("all");
          console.log("after changing:" + accessType);
        }
      },
      onError: (err: Error) => {
        // You need to check that the tokenId is valid, but we did it before firing this function

        console.log(err);
        toast.error(err.message);
      },
    });
  };

  /**
   * Submit the change of the item into the marketplace
   * - It will pass the new price and will change it
   * - it will not allow the change if the oldPrice is the same as the newPrice
   * - fetches updateItem function of our marketplace
   *
   * @param e form submit event
   */
  const submitEditItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPriceError || newPrice === "") return;
    console.log("Update an item ");
    const _price: BigNumber = ethers.utils.parseEther(newPrice.toString());
    if (price === _price.toString()) {
      toast.warn("New price is equal to the old price");
      return;
    }
    const options = {
      contractAddress: contractAddresses.sepolia.NftMarketplace,
      functionName: "updateListing",
      abi: ABIs.NftMarketplace,
      params: { nftAddress, tokenId, newPrice: _price },
    };
    await fetch({
      params: options,
      onSuccess: async (tx: any) => {
        await toast.promise(tx.wait(1), {
          pending: "Waiting Transaction Confirmation",
          success: "Item has been updated successfully",
          error: "Failed to update the item",
        });
        console.log("The item has been bought successfully");

        // Delete the item from our database as its not listed now
        try {
          console.log("Deleting Item from our Database");
          const { data } = await toast.promise(
            axios.patch(
              `/api/listedItems/${id}`,
              { price: _price.toString() },
              {
                headers: {
                  "content-type": "application/json",
                },
              }
            ),
            {
              pending: "updating item from DB",
              success: "DB updated successfully",
              error: "Failed to update DB",
            }
          );
          console.log("Deleted item Id: " + id);
          setChangedItemId(id);
        } catch (err) {
          console.log(err);
        }
      },
      onError: (err: any) => {
        console.log(err);
        let errorNotify: [string, string];
        if (!err) errorNotify = ["", ""];
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

  return (
    <>
      {changedItemId !== id ? (
        <Paper sx={{ p: 2 }} elevation={5}>
          <Box>
            <Image
              src={imageUrl === "noImageUrl" ? placeholderImage : imageUrl}
              alt={collectionName + "NFT"}
              width={500}
              height={500}
              style={{ width: "100%", height: "fit-content" }}
              priority
            />
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
          {updateBox ? (
            <Box component={"form"} onSubmit={submitEditItem}>
              <Typography variant="h5" mb={0.5} color="text.secondary">
                Change price
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={newPrice}
                onChange={handleChangeNewPrice}
                error={newPriceError}
              />
              {newPriceError && (
                <Typography variant="caption" color="error">
                  Please enter a valid amount
                </Typography>
              )}
              <Stack direction="row" spacing={1} mt={1.5}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={
                    isFetching || isLoading || newPriceError || newPrice === ""
                  }
                >
                  Update Price
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleCloseEditBox}
                  disabled={isFetching || isLoading}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleEditItem}
                disabled={isFetching || isLoading}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleDeleteItem}
                disabled={isFetching || isLoading}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Paper>
      ) : (
        <Paper sx={{ p: 2, height: "100%" }} elevation={5}>
          <Typography>
            This item has been changed, please refresh the page to see changes
          </Typography>
        </Paper>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        aria-labelledby="alert-approve-dialog-title"
        aria-describedby="alert-approve-dialog-description"
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
            Remove an item from the marketplace
          </DialogTitle>
          <IconButton onClick={() => handleCloseDialog("delete")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ p: 2 }}>
          <Alert severity="warning">
            By removing the item from the marketplace, peaple will not be able
            to buy it.
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
            onClick={deleteItem}
            autoFocus
            fullWidth
            size="large"
          >
            Remove item from the market
          </Button>
        </DialogActions>
      </Dialog>

      {/* Access Dialog */}
      <Dialog
        open={openAccessDialog}
        aria-labelledby="alert-access-dialog-title"
        aria-describedby="alert-access-dialog-description"
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
            Remove marketplace Access to the NFT
          </DialogTitle>
          <IconButton onClick={() => handleCloseDialog("removeAccess")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />

        <DialogContent sx={{ p: 2 }}>
          <DialogContentText id="alert-dialog-description">
            If you want to remove the marketplace access to this NFT, you can
            click on remove access button
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ pr: 2 }}>
          <Button
            variant="contained"
            onClick={removeAccess}
            autoFocus
            size="small"
          >
            Remove Access
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserListingsCard;
