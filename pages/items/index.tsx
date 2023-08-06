import React, { useState, useEffect } from "react";
import axios from "axios";

// UI Componnts
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// --> Our Components
import Layout from "@/src/components/Layout";

// Hooks and functions
import BuyListingCard from "@/src/components/cards/BuyListingCard";

// Data and types
import { BuyListingCardType } from "@/src/types/data";
import { IListedItem } from "@/lib/listedItemsSchema";

// ------------------

type HomeProps = {
  items: IListedItem[];
};

function Items({ items }: HomeProps) {
  const [cardItems, setCardItems] = useState<BuyListingCardType[]>([]);

  // Store items in state managment
  // - items is passed as props from our DB
  // - get item props that we need and store it in our local items
  useEffect(() => {
    const itemsDB: BuyListingCardType[] = items.map((item) => ({
      id: item._id,
      seller: item.seller,
      nftAddress: item.nftAddress,
      collectionName: item.collectionName,
      tokenId: item.tokenId,
      price: item.price,
      imageUrl: item.imageUrl,
    }));

    setCardItems(itemsDB.slice());
  }, [items]);

  return (
    <Layout>
      {/* Listed NFTs */}
      <Container maxWidth="lg" sx={{ pb: 5, mt: "72px" }}>
        <Typography variant="h2" pt={3} pb={2} color="text.secondary">
          Listed NFTs
        </Typography>
        <Box>
          <Grid container spacing={2}>
            {cardItems.map((list, i) => (
              <Grid item key={"list-" + i} xs={12} sm={6} md={4} lg={3}>
                <BuyListingCard
                  id={list.id}
                  seller={list.seller}
                  nftAddress={list.nftAddress}
                  tokenId={list.tokenId}
                  price={list.price}
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

/**
 * fetch listedItems GET request from our database, and pass them to the component props
 *
 * @returns items from our database in props
 */
export async function getServerSideProps() {
  try {
    const { data } = await axios.get(`${process.env.API_URL}listedItems`, {
      headers: {
        "content-type": "application/json",
      },
    });

    console.log(data);

    const listedItems: IListedItem[] = data.items;

    return {
      props: { items: listedItems },
    };
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return {
      props: {
        items: [], // Return an empty array or handle the error case as needed
      },
    };
  }
}

export default Items;
