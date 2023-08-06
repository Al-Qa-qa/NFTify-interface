import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";

// MUI Components
import Image from "next/image";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// --> Selfmade Components
import Layout from "@/src/components/Layout";
import UserListingsCard from "@/src/components/cards/UserListingsCard";
import NoAccount from "@/src/components/caseComponents/NoAccount";
import Loader from "@/src/components/caseComponents/Loader";
import NoListings from "@/src/components/caseComponents/NoListings";

// images
import wallet from "@/src/assets/images/wallet-profile-picture.png";
import ethCoin from "@/src/assets/images/ethereum-coin.svg";

// Hooks and functions
import { useMoralis, useWeb3Contract } from "react-moralis";
import useUserListings from "./api/hooks/useUserListings";

import { formatBalance, formatTxErrors } from "@/src/utils/format";

// Data and Types
import { ABIs, contractAddresses } from "@/constants";
import { IListedItem } from "@/lib/listedItemsSchema";

// -----------------

const Account = () => {
  const [userBalance, setUserBalance] = useState<number>(0);

  const { account, isWeb3Enabled } = useMoralis();

  // get user balance from our marketplace contract executer function
  const { runContractFunction: getProceeds } = useWeb3Contract({
    contractAddress: contractAddresses.sepolia.NftMarketplace,
    abi: ABIs.NftMarketplace,
    functionName: "getProceeds",
    params: { seller: account! },
  });

  const { userListings, errorUserListings, isLoading, mutate } =
    useUserListings(account);

  // Withdraw balance from our marketplace contract executer function
  const {
    runContractFunction: withdrawProceeds,
    isFetching: withdrawProceedsFetching,
    isLoading: withdrawProceedsloading,
  } = useWeb3Contract({
    contractAddress: contractAddresses.sepolia.NftMarketplace,
    abi: ABIs.NftMarketplace,
    functionName: "withdrawProceeds",
    params: { seller: account! },
  });

  /**
   * withdraw user balance from our marketplace
   */
  const handleWithdraw = async () => {
    await withdrawProceeds({
      onSuccess: (tx: any) => {
        toast.promise(tx.wait(1), {
          pending: "Waiting Transaction Confirmation",
          success: "Withdrawed Successfully",
          error: "Failed to withdraw",
        });
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

  // Get the items that are listed by this user
  useEffect(() => {
    if (!isWeb3Enabled) {
      setUserBalance(0);
    }

    if (account && isWeb3Enabled) {
      mutate();
      // get user balance from our marketplace contract
      getProceeds({
        onSuccess: (balance: any) => {
          const _balance: number = +ethers.utils.formatEther(
            balance as BigNumber
          );
          setUserBalance(_balance);
        },
        onError: (err) => {
          console.log(err);
        },
      });
    }
  }, [account]);

  return (
    <Layout>
      <Box sx={{ mt: "72px", pt: 2, pb: 6 }}>
        <Container maxWidth="lg">
          <>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Image
                  src={wallet}
                  alt="wallet"
                  width={75}
                  style={{ borderRadius: "50%" }}
                />
              </Stack>
              <Typography variant="h2" color="text.secondary">
                Your Listed NFTs
              </Typography>
              <Stack
                direction={{ xs: "row", sm: "column" }}
                alignItems="flex-end"
                spacing={2}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h4">
                    {!account ? "--" : formatBalance(userBalance.toString())}
                  </Typography>
                  <Image src={ethCoin} alt="eth" width={20} />
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleWithdraw}
                  disabled={
                    withdrawProceedsFetching ||
                    withdrawProceedsloading ||
                    !account
                  }
                >
                  Withdraw
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
            {!account ? (
              <NoAccount />
            ) : isLoading || (!userListings && !errorUserListings) ? (
              <Loader />
            ) : errorUserListings ? (
              <Box>
                <Typography variant="h2" color="error">
                  ERROR
                </Typography>
                <Typography>{errorUserListings.toString()}</Typography>
              </Box>
            ) : userListings && userListings?.items?.length === 0 ? (
              <Box>
                <NoListings />
              </Box>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  {userListings.items.map((list: IListedItem, i: number) => (
                    <Grid item key={"list-" + i} xs={12} sm={6} md={4} lg={3}>
                      <UserListingsCard
                        id={list._id}
                        nftAddress={list.nftAddress!}
                        tokenId={list.tokenId!}
                        collectionName={list.collectionName}
                        price={list.price!}
                        imageUrl={list.imageUrl}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        </Container>
      </Box>
    </Layout>
  );
};

export default Account;
