// MUI Components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";

const NoNFTs = () => {
  return (
    <Box textAlign="center" maxWidth={700} mx="auto" p={2} height="100vh">
      <Typography variant="h3" color="text.secondary" mb={3}>
        You don't have any NFTs
      </Typography>
      <Typography mb={3}>
        You can go and mint some NFTs for free from mint page
      </Typography>
      <Button
        variant={"contained"}
        size="large"
        LinkComponent={Link}
        href="/mint"
      >
        Mint NFTs
      </Button>
    </Box>
  );
};

export default NoNFTs;
