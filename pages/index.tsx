import React from "react";

// UI Componnts
import Image from "next/image";
import RouterLink from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
// --> Our Components
import Layout from "@/src/components/Layout";

// Images
import homePreview from "@/src/assets/images/home-preview-2.jpg";
import easyMint from "@/src/assets/images/features/easy-mint.png";
import lowFees from "@/src/assets/images/features/low-fees.png";
import testnetSupport from "@/src/assets/images/features/testnet-support.png";
import fast from "@/src/assets/images/features/fast.png";
import solidity from "@/src/assets/images/technologies-used/solidity-2.svg";
import hardhat from "@/src/assets/images/technologies-used/hardhat.svg";
import alchemy from "@/src/assets/images/technologies-used/alchemy2.png";
import moralis from "@/src/assets/images/technologies-used/moralis.png";
import nextjs from "@/src/assets/images/technologies-used/nextjs.svg";
import mui from "@/src/assets/images/technologies-used/mui.png";

// ------------------

/**
 * This Decentralized Application development process completed.
 * There are some things that can be fixed but its ok.
 * This dApp (NFT Marketplace) can be scaled to improve functionaity and UI/UX
 * The last step is for production.
 * When production you will need to use local client node instead of public one.
 * Good luck xD.
 */

// ------------------

function Home() {
  return (
    <Layout>
      {/* Listed NFTs */}
      <Container maxWidth="lg" sx={{ pb: 5, mt: "72px" }}>
        {/* Intro Section */}
        <Box component="section" pb={12}>
          <Box pt={5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} alignItems="center">
                <Box pt={{ xs: 2, md: 8 }}>
                  <Typography variant="h1" mb={3}>
                    NFTs became easy with NFTify
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" mb={3}>
                    Start minting, listing, or buying NFTs easy from now using
                    NFTify marketplace
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      LinkComponent={RouterLink}
                      href="/items"
                    >
                      Explore Items
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      LinkComponent={RouterLink}
                      href="/list-item"
                    >
                      List New Item
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  display={{ xs: "none", md: "flex" }}
                  alignItems="flex-start"
                  border="2px solid #444"
                  borderRadius={3}
                >
                  <Image
                    src={homePreview}
                    // width={1000}
                    alt="NFTify nft art"
                    style={{
                      width: "100%",
                      height: "fit-content",
                      borderRadius: 24,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Why NFtify section */}
        <Box component="section" pb={12}>
          <Typography variant="h2" textAlign="center" mb={5}>
            Why NFTify
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2, height: "100%" }}
              >
                <Image
                  src={easyMint}
                  width={70}
                  height={70}
                  alt="easy mint NFTs"
                />
                <Typography variant="h4" pt={2}>
                  Easy to mint
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  You can mint new NFTs easily with for free with NFTify
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2, height: "100%" }}
              >
                <Image
                  src={lowFees}
                  width={70}
                  height={70}
                  alt="low transaction fees"
                />
                <Typography variant="h4" pt={2}>
                  low Tx feex
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  NFTify has 0% fees on buying, selling, listing or withdrawing
                  money
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2, height: "100%" }}
              >
                <Image
                  src={testnetSupport}
                  width={70}
                  height={70}
                  alt="tech support"
                />
                <Typography variant="h4" pt={2}>
                  Testnet Support
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  NFTify works on sepolia testnet, so you can test it without
                  paying
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2, height: "100%" }}
              >
                <Image src={fast} width={70} height={70} alt="fast" />
                <Typography variant="h4" pt={2}>
                  Super fast
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  Transaction are fast and UI resond is fast too
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        {/* Technologies used section */}
        <Box component="section" pb={12}>
          <Typography variant="h2" textAlign="center" mb={5}>
            Technologies used
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2 }}
              >
                <Image
                  src={solidity}
                  width={70}
                  height={70}
                  alt="solidity lang"
                />
                <Typography variant="h4" pt={2}>
                  Solidity
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  Smart contract programming language
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2 }}
              >
                <Image src={hardhat} width={70} height={70} alt="hardhat" />
                <Typography variant="h4" pt={2}>
                  Hardhat
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  Ethereum development environment
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2 }}
              >
                <Image
                  src={alchemy}
                  width={70}
                  height={70}
                  alt="alchemy"
                  style={{ borderRadius: "4px" }}
                />
                <Typography variant="h4" pt={2}>
                  Alchemy
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  EVM node (client) provider
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2 }}
              >
                <Image src={moralis} width={70} height={70} alt="moralis" />
                <Typography variant="h4" pt={2}>
                  Moralis
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  Web3 APIs provider
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2 }}
              >
                <Image src={nextjs} width={70} height={70} alt="nextjs" />
                <Typography variant="h4" pt={2}>
                  Nextjs
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  full stack framework used to build UI
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Stack
                direction="column"
                spacing={1}
                alignItems="center"
                component={Paper}
                sx={{ p: 2 }}
              >
                <Image src={mui} width={70} height={70} alt="mui" />
                <Typography variant="h4" pt={2}>
                  MUI
                </Typography>
                <Typography
                  variant="subtitle2"
                  textAlign="center"
                  color="text.secondary"
                >
                  UI library used in application
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}

export default Home;
