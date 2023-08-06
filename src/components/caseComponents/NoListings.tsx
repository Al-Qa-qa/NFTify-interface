// MUI Components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";

const NoListings = () => {
  return (
    <Box textAlign="center" maxWidth={700} mx="auto" p={2} height="100vh">
      <Typography variant="h3" color="text.secondary" mb={3}>
        You don't have any listings in the marketplace
      </Typography>
      <Typography mb={3}>
        You can go and list some NFTs into the marketplace and start earning som
        money
      </Typography>
      <Button
        variant={"contained"}
        size="large"
        LinkComponent={Link}
        href="/list-item"
      >
        List Items
      </Button>
    </Box>
  );
};

export default NoListings;
