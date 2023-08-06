import React, { ChangeEvent, useState } from "react";
import { ethers, BigNumber, ContractReceipt } from "ethers";
import axios from "axios";

// MUI Components
import { toast } from "react-toastify";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@/src/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

// Images
import placeholderImage from "@/src/assets/images/nfts/placeholder.png";

// Icons
import CloseIcon from "@mui/icons-material/Close";

// Hooks and Functions
import { useRouter } from "next/router";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

// Data and Types
import { ListItemType, UserNFTsCardType } from "@/src/types/data";
import { ABIs, contractAddresses } from "@/constants";
import { formatTxErrors } from "@/src/utils/format";

// ---------------------

// Approvability type of the marketplace (full access, access to this token only)
type RadioApproveType = "all" | "onlyThis";

// We have two dialog boxes. one is for approvability type, and the other is for buying
type OpenedDialog = "details" | "approve" | "list";

// The new item that will be listed in the DB
// We declared it here to be seen to all functions
const newListItem: ListItemType = {
  seller: "",
  nftAddress: "",
  collectionName: "",
  tokenId: "",
  price: "0",
  tokenURI: "",
  imageUrl: "",
};

// -----------------

const UserNFTsCard = ({
  nftAddress,
  collectionName,
  tokenId,
  name,
  imageUrl,
  tokenURI,
  isListed,
}: UserNFTsCardType) => {
  ///////////////////////////////
  // State Managment And Hooks //
  ///////////////////////////////

  const [imageError, setImageError] = useState<boolean>(false);

  const [inputPrice, setInputPrice] = useState<string>("");
  const [inputPriceError, setInputPriceError] = useState<boolean>(false);

  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [openListDialog, setOpenListDialog] = useState<boolean>(false);
  const [openApproveDialog, setOpenApproveDialog] = useState<boolean>(false);
  const [marketRadioApprove, setMarketRadioApprove] =
    useState<RadioApproveType>("all");

  const router = useRouter();

  const { account } = useMoralis();
  const { fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

  ///////////////////////////
  // UI handling Functions //
  ///////////////////////////

  /**
   * Render the image and if the image link is invalid then we will set an imageError to true.
   *
   * By setting image error to true the rendered image will be the placeholder image we are using and not the
   * image in the src
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * Handle changing the price of the item to be listed in the marketplace
   *
   * @param e changing input price for the new item to be listed
   */
  const handleChangeInputPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setInputPriceError(false);
    if (isNaN(+e.target.value)) {
      setInputPriceError(true);
    }
    setInputPrice(e.target.value);
  };

  /**
   * Opens the dialog box that you want to open (sellected as a parameter)
   *
   * @param dialogToOpen the dialog you want to open
   */
  const handleOpenDialog = (dialogToOpen: OpenedDialog) => {
    if (dialogToOpen === "approve") {
      setOpenApproveDialog(true);
    }
    if (dialogToOpen === "list") {
      setOpenListDialog(true);
    }
    if (dialogToOpen === "details") {
      setOpenDetailsDialog(true);
    }
  };

  /**
   * Closes the dialog box that you want to close (sellected as a parameter)
   *
   * @param dialogToClose the dialog you want to close
   */
  const handleCloseDialog = (dialogToClose: OpenedDialog) => {
    if (dialogToClose === "approve") {
      setOpenApproveDialog(false);
    }
    if (dialogToClose === "list") {
      setOpenListDialog(false);
    }
    if (dialogToClose === "details") {
      setOpenDetailsDialog(false);
    }
  };

  /**
   * changes the type of the approvability of the marketplace
   *
   * @param event changing radio buttons value event
   */
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMarketRadioApprove(
      (event.target as HTMLInputElement).value as RadioApproveType
    );
  };

  /**
   * Submiting new item into the marketplace
   *
   * - Checking for marketplace accessibilty to the item, and if the marketplace
   * has an access to the item it will trigger listItem contract function.
   *
   * But if the marketplace don't have access to the item it will show access dialog, and
   * after approving accissibility of the marketplace to the item it will show the dialog to list
   * the item into the marketplace, and by clicking on `list Item` button it trigger listItem contract function.
   *
   */
  const handleSubmitListItem = async (): Promise<void> => {
    console.log("--< ADDING NEW ITEM >--");

    const addValuesError: boolean = addNewItemValues();
    if (addValuesError) return;

    // List the new item into our NFT marketplace
    console.log("- Check market approvability");

    const checkApprovabilityError: boolean = await checkApprovability();
    if (checkApprovabilityError) return;

    // We will only reach this part if the item was approved from the beginning

    console.log("- List the item into the marketplace");
    await listNftIntoMarket();
    handleCloseDialog("details");
    /**------------------------ */
  };

  ////////////////////////////////
  // Web3 Interacting Functions //
  ////////////////////////////////

  /**
   * Give NFTify the access to the NFT the user wants to list
   */
  const givingAccess = async (): Promise<void> => {
    if (marketRadioApprove === "all") {
      console.log("Getting access to all items");
      await fetch({
        params: {
          contractAddress: newListItem.nftAddress,
          functionName: "setApprovalForAll",
          abi: ABIs.IERC721,
          params: {
            operator: contractAddresses.sepolia.NftMarketplace,
            approved: true,
          },
        },
        onSuccess: async (tx: any) => {
          await toast.promise(tx.wait(1), {
            pending: "Waiting Transaction Confirmation",
            success: "NFTify has the access now",
            error: "Transaction failed",
          });

          console.log("Its Approved Now");

          handleOpenDialog("list");
          handleCloseDialog("approve");
        },
        onError: (err: any) => {
          // This error may reverts if the caller of the function is the operator.
          // We didint took this error in considations, as the operator is always NFTify contract address

          // err keys: [code, message, stack]
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
    }
    if (marketRadioApprove === "onlyThis") {
      console.log("Getting access to only this item ");
      await fetch({
        params: {
          contractAddress: newListItem.nftAddress,
          functionName: "approve",
          abi: ABIs.IERC721,
          params: {
            to: contractAddresses.sepolia.NftMarketplace,
            tokenId: newListItem.tokenId,
          },
        },
        onSuccess: async (tx: any) => {
          await toast.promise(tx.wait(1), {
            pending: "Waiting Transaction Confirmation",
            success: "NFTify has the access now",
            error: "Transaction failed",
          });

          console.log("Its Approved Now");

          handleOpenDialog("list");
          handleCloseDialog("approve");
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
    handleCloseDialog("approve");

    // One of this two if conditions should occuars

    // Showing the Dialog to
  };

  /**
   * Listing new item into the marketplace after giving the marketplace the access to this NFT
   * NOTE: this function is only triggered by the list item button that is on list Dialog,
   * this Dialog will appear after approving marketplace and giving it the access, so if the marketplace
   * already have the access it will not show access dialog and listing item contract triggger function will be
   * fired immediatly
   *
   */
  const listItemBtnAction = async () => {
    await listNftIntoMarket();
    handleCloseDialog("list");
  };

  /**
   * Adding the values to the item to be added
   * - All values of the item to be added is already knowen as its passed as props to the card.
   * - the only value is the price as the user will set the price of the item to be listed
   *
   * NOTE: This way of adding the info is rediculs and there are better ways to do this, but its ok.
   *
   * @returns false if there is no errors otherwise true
   */
  const addNewItemValues = (): boolean => {
    // Clearing old values
    newListItem.seller = "";
    newListItem.nftAddress = nftAddress;
    newListItem.collectionName = collectionName;
    newListItem.tokenId = tokenId;
    newListItem.price = inputPrice;
    newListItem.tokenURI = tokenURI;
    newListItem.imageUrl = imageUrl;

    if (!account) {
      alert("No connected account, please connect your wallet");
      return true;
    }

    newListItem.seller = account;

    console.log("newListItem");
    console.log(newListItem);

    return false;
  };

  /**
   * Check if the NFTify has access to this NFT.
   * If it doesn't have an access, it will open approve dialog box
   *
   * @returns false if there is no errors otherwise true
   */
  const checkApprovability = async (): Promise<boolean> => {
    let approvedMyMarket = false;

    // Check if the marketplace is allowed to sell the item or not
    console.log("Check approve for all");
    await fetch({
      params: {
        contractAddress: newListItem.nftAddress,
        functionName: "isApprovedForAll",
        abi: ABIs.IERC721,
        params: {
          owner: account, // owner should equal the connector to the contrace (signer)
          operator: contractAddresses.sepolia.NftMarketplace,
        },
      },
      onSuccess: (returnedValue: any) => {
        const isApprovedForAll: boolean = returnedValue as boolean;
        if (isApprovedForAll) {
          approvedMyMarket = true;
          console.log("The marketplace have the access to all NFTs");
        }
      },
      onError: (err: Error) => {
        console.log(err);
        toast.error(err.message);
      },
    });
    if (approvedMyMarket) return false;

    console.log("Check approve to this item only");
    await fetch({
      params: {
        contractAddress: newListItem.nftAddress,
        functionName: "getApproved",
        abi: ABIs.IERC721,
        params: {
          tokenId: newListItem.tokenId,
        },
      },
      onSuccess: (returnedValue: any) => {
        const approvedAddress: string = returnedValue as string;
        console.log("Approved address: " + approvedAddress);
        if (approvedAddress === contractAddresses.sepolia.NftMarketplace) {
          approvedMyMarket = true;
          console.log("Its Approved By Market");
        }
      },
      onError: (err: Error) => {
        // You need to check that the tokenId is valid, but we did it before firing this function

        console.log(err);
        toast.error(err.message);
      },
    });

    if (!approvedMyMarket) {
      handleOpenDialog("approve");
      handleCloseDialog("details");
      return true;
    }

    return false; // No Errors
  };

  /**
   * List the item into our NFT marketplace.
   * Add new item into our database
   *
   * @returns false if there is no errors otherwise true
   */
  const listNftIntoMarket = async (): Promise<void> => {
    const options = {
      contractAddress: contractAddresses.sepolia.NftMarketplace,
      functionName: "listItem",
      abi: ABIs.NftMarketplace,
      params: {
        nftAddress,
        tokenId,
        price: ethers.utils.parseEther(newListItem.price),
      },
    };

    await fetch({
      params: options,
      onSuccess: async (tx: any) => {
        const txReceipt: ContractReceipt = await toast.promise(tx.wait(1), {
          pending: "Waiting Transaction Confirmation",
          success: "Transaction Confirmed",
          error: "Transaction failed",
        });

        // This values should be the same values we have before.
        // We get them from our lister and
        if (!txReceipt.events) return;
        const [_seller, _nftAddress, _tokenId, _price]: [
          string,
          string,
          BigNumber,
          BigNumber
        ] = txReceipt.events[0].args as [string, string, BigNumber, BigNumber];

        console.log("tx receipt");
        console.log(txReceipt);

        // This is the item that will go to the Database
        const _newListItem: ListItemType = {
          seller: _seller,
          nftAddress: _nftAddress,
          collectionName: newListItem.collectionName || "unNamed",
          tokenId: _tokenId.toString(),
          price: _price.toString(),
          tokenURI: newListItem.tokenURI || "noTokenURI",
          imageUrl: newListItem.imageUrl || "noImageUrl",
        };

        try {
          console.log("Adding Item to our Database");
          const { data } = await toast.promise(
            axios.post("/api/listedItems", _newListItem, {
              headers: {
                "content-type": "application/json",
              },
            }),
            {
              pending: "Add the NFT into the marketplace",
              success: "Item added successfully",
              error: "Failed to add the Item",
            }
          );

          const redirected = setTimeout(() => {
            toast.dismiss(); // we clear all notifications as reouting between pages will may cause error in toastify
            router.push(
              `/items/${data.newItem.nftAddress}/${data.newItem.tokenId}`
            );
            clearTimeout(redirected);
          }, 500);
        } catch (error: any) {
          console.log(error);
        }
      },
      onError: (e: any) => {
        // e keys: [reason, code, error, method, transaction]

        let errorNotify: [string, string];

        if (e.error) {
          errorNotify = formatTxErrors(e.error.message);
        } else {
          errorNotify = formatTxErrors(e.message);
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

  /////////////////////////////////////
  // useEffect and fetching requests //
  /////////////////////////////////////

  return (
    <>
      <Paper sx={{ p: 2 }} elevation={5}>
        <Box>
          <Image
            src={imageError ? placeholderImage : imageUrl}
            alt={collectionName + "NFT"}
            width={500}
            height={500}
            style={{ width: "100%", height: "fit-content" }}
            priority
            onError={handleImageError}
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
              Name
            </Typography>
            <Typography variant="subtitle1" textAlign="end">
              {name}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack direction="row" spacing={1}>
          {isListed ? (
            <Button
              LinkComponent={Link}
              href={`/items/${nftAddress}/${tokenId}`}
              variant="contained"
              color="secondary"
              fullWidth
              disabled={isFetching || isLoading}
            >
              View Listing
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={isFetching || isLoading}
              onClick={() => handleOpenDialog("details")}
            >
              List Item
            </Button>
          )}
        </Stack>
      </Paper>
      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        aria-labelledby="alert-approve-dialog-title"
        aria-describedby="alert-approve-dialog-description"
        fullWidth
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
            Adding new item into the marketplace
          </DialogTitle>
          <IconButton onClick={() => handleCloseDialog("details")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ p: 2 }}>
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1}>
                <Image
                  src={imageError ? placeholderImage : imageUrl}
                  alt={collectionName + "NFT"}
                  width={75}
                  height={75}
                  priority
                  onError={handleImageError}
                />
                <Stack direction="column" justifyContent="center">
                  <Typography variant="h5">{name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {collectionName}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="column" alignItems="flex-end">
                <Typography variant="subtitle2" color="text.secondary">
                  Listing price
                </Typography>
                <Typography variant="h6">
                  {inputPriceError ? "--" : inputPrice} ETH
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <TextField
              variant="outlined"
              label="Price"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ETH</InputAdornment>
                ),
              }}
              value={inputPrice}
              onChange={handleChangeInputPrice}
              error={inputPriceError}
            />
            {inputPriceError && (
              <Typography variant="caption" color="error">
                Please enter a valid amount
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack direction="column" spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Listing Price</Typography>
              <Typography>{inputPriceError ? "--" : inputPrice} ETH</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>NFTify feees</Typography>
              <Typography>0%</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight="bold">
                Total potential earnings
              </Typography>
              <Typography fontWeight="bold">
                {inputPriceError ? "--" : inputPrice} ETH
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            size="large"
            autoFocus
            fullWidth
            disabled={
              inputPriceError || inputPrice === "" || isFetching || isLoading
            }
            onClick={handleSubmitListItem}
          >
            List Item
          </Button>
        </DialogActions>
      </Dialog>
      {/* Approvability Dialog */}
      <Dialog
        open={openApproveDialog}
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
            {"NFTity Accessibility to the NFT"}
          </DialogTitle>
          <IconButton onClick={() => handleCloseDialog("approve")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />
        <DialogContent sx={{ p: 2 }}>
          <Alert severity="info">
            You need to give the marketplace the access to this NFT in order to
            list it in the marketplace
          </Alert>
          <FormControl sx={{ mt: 2 }}>
            <Typography variant="h6" color="text.secondary" mb={1}>
              Marketplace Accessibility
            </Typography>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={marketRadioApprove}
              onChange={handleRadioChange}
              sx={{ pl: 2 }}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All items from this address"
              />
              <FormControlLabel
                value="onlyThis"
                control={<Radio />}
                label="Only this item"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={givingAccess}
            autoFocus
            fullWidth
            size="large"
          >
            Give access
          </Button>
        </DialogActions>
      </Dialog>
      {/* List item Dialog */}
      <Dialog
        open={openListDialog}
        aria-labelledby="alert-list-dialog-title"
        aria-describedby="alert-list-dialog-description"
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
            {"List new item into the marketplace"}
          </DialogTitle>
          <IconButton onClick={() => handleCloseDialog("list")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />

        <DialogContent sx={{ p: 2 }}>
          <DialogContentText id="alert-dialog-description">
            You can list the item into the marketplace now <br />
            Click on list now button to list the item
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={listItemBtnAction}
            autoFocus
            fullWidth
            size="small"
          >
            List item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserNFTsCard;
