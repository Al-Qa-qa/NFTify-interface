import React, { useEffect, useState } from "react";

// UI Components
import Image from "next/image";
import MuiLink from "@/src/Link";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import CircularProgress from "@mui/material/CircularProgress";

// Icons
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Images
import walletProfile from "@/src/assets/images/wallet-profile-picture.png";
import metamaskImg from "@/src/assets/images/connectors/metamask.svg";
import ethereumImg from "@/src/assets/images/networks/ethereum.svg";

// Hooks and Functions
import { useTheme, useMediaQuery } from "@mui/material";
import { useChain, useMoralis } from "react-moralis";
import { useEvmNativeBalance } from "@moralisweb3/next";
import {
  convertChainIdToHex,
  convertChainIdToInt,
  formatBalance,
  formatWalletAddress,
} from "@/src/utils/format";

// Data and Types
import { SUPPORTED_CHAIN_IDS, SupportedNetworks } from "@/src/types/networks";

// --------------

function ConnectButton() {
  // Networks Native Coin Image
  const coinImages = {
    [SUPPORTED_CHAIN_IDS[SupportedNetworks.SEPOLIA].image]: ethereumImg,
  };

  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
  } = useMoralis();
  const { switchNetwork, chainId } = useChain();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [showAccountInfo, setShowAccountInfo] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [coinBalance, setCoinBalance] = useState<string>("0.0");

  // Get the native balance of the network that the user has
  const { data: nativeBalance } = useEvmNativeBalance({
    address: account!,
    chain: chainId!,
  });

  /**
   * Connect wallet to our application
   */
  const handleConnect = async () => {
    try {
      const ret = await enableWeb3();
      if (typeof ret !== "undefined") {
        // depends on what button they picked
        if (typeof window !== "undefined") {
          window.localStorage.setItem("connected", "injected");
          toast.success("Connected successfully");
        }
      } else {
        toast.error("Failed to connected!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      // To not open the account info when connecting
      setShowAccountInfo(false);
    }
  };

  /**
   * Toggling connected wallet info (address, provider, ETH amount)
   *
   * @param event Mouse Event
   */
  const handleToggleAccountInfo = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
    setShowAccountInfo((previousOpen) => !previousOpen);
  };

  /**
   * Close connected wallet info
   */
  const handleCloseAccountInfo = () => {
    setShowAccountInfo(false);
  };

  /**
   * Copy wallet address to clipboard
   */
  const handleCopyAddress = () => {
    setCopiedAddress(true);
    navigator.clipboard.writeText(account!);
    setTimeout(() => {
      setCopiedAddress(false);
    }, 3000);
  };

  // THIS FUNCTION NEEDS SOME EDIT
  // Check if the there is a saved connected account in the local storage
  // This acts as save login functionality in normal web apps
  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, []);
  // -----------

  /**
   * Track the change of the chain ID
   *
   * If the user connected to the application with an unsupported network
   * We will alert a message to let him know this, and request for changing network.
   *
   * If the user refused changing the network we will disconnect the user.
   */
  useEffect(() => {
    // Switching network funtion when the chainId changes
    const autoSwitchNetwork = async () => {
      try {
        await switchNetwork(convertChainIdToHex(SupportedNetworks.SEPOLIA));
      } catch (error) {
        console.log("Switching networks failed");
        deactivateWeb3();
      }
    };

    if (chainId && !SupportedNetworks[convertChainIdToInt(chainId)]) {
      alert(
        "You are in an unsuppoted network \nPlease Switch Network to sepolia to use the Dapp"
      );
      autoSwitchNetwork().catch((error) => {
        console.log(error);
      });
    }
  }, [chainId]);

  // tracking changing accounts processes
  // If the user connected more than one account to our application, we will track if he switched between one account and the other
  // If the user disconnected the last connected account, the account will be null
  useEffect(() => {
    Moralis.onAccountChanged((account: string | null) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);

  // Change the balance of the account when the value changed
  useEffect(() => {
    const balance: string = nativeBalance?.balance.ether!;
    console.log(balance);
    setCoinBalance(formatBalance(balance));
  }, [nativeBalance?.balance.ether]);

  return (
    <Box>
      {account && chainId && SupportedNetworks[convertChainIdToInt(chainId)] ? (
        <>
          <Button
            variant="text"
            color="inherit"
            sx={{
              display: "flex",
              p: "5px 12px 5px 15px",
              boxShadow: "inset 0px 0px 0px 1px currentColor",
              lineHeight: "20px",
              flex: 1,
              textTransform: "unset",
              whiteSpace: "nowrap",
            }}
            startIcon={
              <Image
                src={walletProfile}
                width={30}
                height={30}
                alt="wallet"
                style={{ borderRadius: "4px" }}
              />
            }
            endIcon={
              <ArrowDropDownIcon
                sx={{ fontSize: "24px !important", ml: "-8px" }}
              />
            }
            onClick={handleToggleAccountInfo}
          >
            {!isSmallScreen && formatWalletAddress(account!)}
          </Button>
          <Menu
            open={showAccountInfo}
            onClose={handleCloseAccountInfo}
            anchorEl={anchorEl}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            elevation={5}
            sx={{ mt: 1, ul: { p: 0 } }}
          >
            <Paper sx={{ minWidth: "250px", pt: 2 }}>
              <Paper elevation={5} sx={{ p: 2, mx: 2, mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Typography
                    variant="caption"
                    sx={{ verticalAlign: "center" }}
                  >
                    Connected with MetaMask
                  </Typography>
                  <Image
                    src={metamaskImg}
                    width={20}
                    height={20}
                    alt="metamask"
                  />
                </Stack>
                {chainId && (
                  <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                    <Image
                      src={walletProfile}
                      width={25}
                      height={25}
                      alt="wallet"
                      style={{ borderRadius: "4px" }}
                    />
                    {
                      <MuiLink
                        href={`${
                          SupportedNetworks[convertChainIdToInt(chainId)]
                            ? SUPPORTED_CHAIN_IDS[convertChainIdToInt(chainId)]
                                .scanner +
                              "address/" +
                              account!
                            : "javascript:void(0)"
                        }`}
                        target={
                          SupportedNetworks[convertChainIdToInt(chainId)]
                            ? "_blank"
                            : "_self"
                        }
                        // underline="none"
                      >
                        {formatWalletAddress(account!)}
                      </MuiLink>
                    }

                    {!copiedAddress ? (
                      <Tooltip title="Copy Address" placement="top-end" arrow>
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
                )}
              </Paper>
              <Divider />
              {chainId && SupportedNetworks[convertChainIdToInt(chainId)] && (
                <Paper sx={{ p: 2 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Image
                      src={
                        coinImages[
                          SUPPORTED_CHAIN_IDS[convertChainIdToInt(chainId)]
                            .image
                        ]
                      }
                      width={50}
                      height={50}
                      alt="evm coin"
                    />
                    <Stack direction="column">
                      <Typography variant="h6" color="text.secondary">
                        {SUPPORTED_CHAIN_IDS[convertChainIdToInt(chainId)].coin}
                      </Typography>
                      <Typography variant="body1">{coinBalance}</Typography>
                    </Stack>
                  </Stack>
                </Paper>
              )}
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => deactivateWeb3()}
                >
                  Disconnect
                </Button>
              </Box>
            </Paper>
          </Menu>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            disabled={isWeb3EnableLoading}
            sx={{ lineHeight: "28px", flex: 1, whiteSpace: "nowrap" }}
            onClick={handleConnect}
          >
            {isWeb3EnableLoading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Connecting &nbsp;
                <CircularProgress size={20} />
              </Box>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </>
      )}
    </Box>
  );
}

export default ConnectButton;
