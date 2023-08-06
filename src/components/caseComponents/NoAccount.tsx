// MUI Components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NoAccount = () => {
  return (
    <Box textAlign="center" maxWidth={700} mx="auto" p={2} height="100vh">
      <Typography variant="h3" color="text.secondary" mb={3}>
        No connected account ❗️
      </Typography>
      <Typography>
        Please connect you wallet from Connect Wallet button to start using the
        application
      </Typography>
    </Box>
  );
};

export default NoAccount;
