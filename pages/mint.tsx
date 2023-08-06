import * as React from "react";

// UI Componnts
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// --> Our Components
import Layout from "@/src/components/Layout";
import MintCard from "@/src/components/cards/MintCard";

// Data and Types
import { contractAddresses } from "@/constants";
import { MintCardType } from "@/src/types/data";

// ------------------

/**
 * - Our Collections that we made before
 */
const listings: MintCardType[] = [
  {
    collectionName: "Camelo",
    nftAddress: contractAddresses.sepolia.Camels,
    imageUrl:
      "https://ipfs.io/ipfs/QmPSsxXG1KJJhzJXhD3dfATu1NEYLBv1taSSmuQCw3754n",
  },
  {
    collectionName: "Birdo",
    nftAddress: contractAddresses.sepolia.Birds,
    imageUrl:
      "https://ipfs.io/ipfs/QmRq1z1N4xqAeWCdszHZSZK5Qi3yVdhDvj3HptdpSd5AyG",
  },
  {
    collectionName: "Pandato",
    nftAddress: contractAddresses.sepolia.Pandas,
    imageUrl:
      "https://ipfs.io/ipfs/QmcWVYpAqNCfTN2CyPgqyg3REzXokWLTzUu2Qi4Be7f9ET",
  },
  {
    collectionName: "Dolphino",
    nftAddress: contractAddresses.sepolia.Dolphines,
    imageUrl:
      "https://ipfs.io/ipfs/QmSFm6aNZM13VipFuYVYjum9LEpzGZDqR1k8EG3taeEehG",
  },
  {
    collectionName: "Snako",
    nftAddress: contractAddresses.sepolia.Snakes,
    imageUrl:
      "https://ipfs.io/ipfs/QmNZFyjyMGktzSVJBgKimpXJ5eba9Aja5mdvfPnwix2Trg",
  },
];

function Mint() {
  return (
    <Layout>
      {/* Listed NFTs */}
      <Container maxWidth="lg" sx={{ pb: 5, mt: "72px" }}>
        <Typography variant="h2" pt={3} pb={2} color="text.secondary">
          Mint new item
        </Typography>
        <Box>
          <Grid container spacing={2}>
            {listings.map((list, i) => (
              <Grid item key={"list-" + i} xs={12} sm={6} md={4} lg={3}>
                <MintCard
                  nftAddress={list.nftAddress!}
                  collectionName={list.collectionName}
                  imageUrl={list.imageUrl}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}

export default Mint;
