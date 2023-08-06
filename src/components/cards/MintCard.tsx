import React, { useState } from "react";
import { BigNumber } from "ethers";

// UI Components
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "@/src/Link";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// Icons
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Hooks and Functions
import { useWeb3ExecuteFunction } from "react-moralis";
import { formatTxErrors } from "@/src/utils/format";

// Data and Types
import { ABIs } from "@/constants";
import { MintCardType } from "@/src/types/data";

// ---------------------

const MintCard = ({ nftAddress, collectionName, imageUrl }: MintCardType) => {
  ///////////////////////////////
  // State Managment And Hooks //
  ///////////////////////////////

  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const { fetch, isFetching, isLoading } = useWeb3ExecuteFunction();

  ///////////////////////////
  // UI handling Functions //
  ///////////////////////////

  /**
   * Copy wallet address to clipboard
   */
  const handleCopyAddress = () => {
    setCopiedAddress(true);
    navigator.clipboard.writeText(nftAddress!);
    setTimeout(() => {
      setCopiedAddress(false);
    }, 3000);
  };

  ////////////////////////////////
  // Web3 Interacting Functions //
  ////////////////////////////////

  /**
   * Mint new Item
   */
  const handleMintItem = async () => {
    console.log(">MINT NEW ITEM<");
    const options = {
      contractAddress: nftAddress,
      functionName: "mintNft",
      abi: ABIs.BasicNft,
      params: {},
    };

    await fetch({
      params: options,
      onSuccess: async (tx: any) => {
        const txReciept: any = await toast.promise(tx.wait(1), {
          pending: "Waiting Transaction Confirmation",
          success: "NFT minted Successfully",
          error: "Failed to mint NFT",
        });
        console.log("Mint Item reciept");
        console.log(txReciept);
        const tokenId: BigNumber = txReciept.events[1].args[0];

        toast.info(`Token number: ${tokenId.toString()}`);
      },
      onError: (err: Error) => {
        console.log(err);
        let errorNotify: [string, string] = formatTxErrors(err.message);

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
    <Paper sx={{ p: 2 }} elevation={5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h5" mb={0}>
          {collectionName} Collection
        </Typography>
        {!copiedAddress ? (
          <Tooltip title={`Copy Collection Address`} placement="top-end" arrow>
            <IconButton
              aria-label="copy"
              size="small"
              onClick={handleCopyAddress}
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        ) : (
          <CheckCircleIcon fontSize="small" color="inherit" />
        )}
      </Stack>

      <Box>
        <Image
          src={imageUrl}
          alt={collectionName + "NFT"}
          width={500}
          height={500}
          style={{ width: "100%", height: "fit-content" }}
          priority
        />
      </Box>

      <Stack
        direction="row"
        my={1}
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Typography variant="h6" color="text.secondary">
          Address
        </Typography>
        <Typography
          variant="caption"
          component={Link}
          href={`https://sepolia.etherscan.io/address/${nftAddress}`}
          target="_blank"
        >
          View on etherscan
          <OpenInNewIcon sx={{ ml: 0.25, fontSize: "inherit" }} />
        </Typography>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Button
        variant="contained"
        fullWidth
        onClick={handleMintItem}
        disabled={isFetching || isLoading}
      >
        Mint item
      </Button>
    </Paper>
  );
};

export default MintCard;
