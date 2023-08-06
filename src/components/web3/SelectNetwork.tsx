import { useEffect, useState } from "react";

// UI Components
import Image from "next/image";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

// Images
import ethereumImg from "@/src/assets/images/networks/ethereum.svg";

// Hooks and Functions
import { useTheme, useMediaQuery } from "@mui/material";
import { useChain, useMoralis } from "react-moralis";
import { convertChainIdToHex, convertChainIdToInt } from "../../utils/format";

// Data and Types
import { SelectChangeEvent } from "@mui/material";
import { SUPPORTED_CHAIN_IDS, SupportedNetworks } from "../../types/networks";

// -----------

function SelectNetwork() {
  // Networks images
  const NetworksImages = {
    [SUPPORTED_CHAIN_IDS[SupportedNetworks.SEPOLIA].image]: ethereumImg,
  };

  const { switchNetwork, chainId } = useChain();
  const { isWeb3Enabled } = useMoralis();
  const [network, setNetwork] = useState<string | null>(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Tracking The change of the network
   *
   * @param event Selecting different network event
   */
  const handleChange = async (event: SelectChangeEvent) => {
    try {
      await switchNetwork(event.target.value);

      setNetwork(event.target.value);
      toast.info(
        `Switched to ${
          SUPPORTED_CHAIN_IDS[convertChainIdToInt(chainId!)].unique_name
        } network `
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Change Selected Network when connecting
  useEffect(() => {
    if (isWeb3Enabled) {
      setNetwork(chainId);
      return;
    }
    console.log("From Networks, Web3Enable: " + isWeb3Enabled);
    if (chainId && SupportedNetworks[convertChainIdToInt(chainId)]) {
      setNetwork(chainId);
      toast.info(
        `Connected to ${
          SUPPORTED_CHAIN_IDS[convertChainIdToInt(chainId)].unique_name
        } network `
      );
    } else if (!chainId) {
      setNetwork(null);
    }
  }, [chainId]);

  return (
    <>
      {network ? (
        <FormControl fullWidth margin="none">
          <Select
            autoWidth={true}
            labelId="select-network"
            id="select-network"
            size="small"
            sx={{ p: 0, borderRadius: "16px" }}
            value={network!}
            onChange={handleChange}
            defaultValue={network!}
            renderValue={
              isSmallScreen
                ? () => {
                    if (isSmallScreen) {
                      return (
                        <Stack direction="row" alignItems="center">
                          <Image
                            src={
                              NetworksImages[
                                SUPPORTED_CHAIN_IDS[
                                  convertChainIdToInt(network)
                                ].image
                              ]
                            }
                            width={23}
                            height={23}
                            alt={
                              SUPPORTED_CHAIN_IDS[convertChainIdToInt(network)]
                                .unique_name
                            }
                          />
                        </Stack>
                      );
                    }
                  }
                : undefined
            }
          >
            {Object.keys(SUPPORTED_CHAIN_IDS)
              .map((e) => +e)
              .map((chainId: SupportedNetworks) => (
                <MenuItem key={chainId} value={convertChainIdToHex(chainId)}>
                  <Stack direction="row" alignItems="center">
                    <Image
                      src={NetworksImages[SUPPORTED_CHAIN_IDS[chainId].image]}
                      width={23}
                      height={23}
                      alt={SUPPORTED_CHAIN_IDS[chainId].unique_name}
                    />

                    <Typography variant="subtitle2" px={1}>
                      {SUPPORTED_CHAIN_IDS[chainId].view_name}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      ) : (
        <></>
      )}
    </>
  );
}

export default SelectNetwork;
