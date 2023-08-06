// MUI Components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// ---------

const Loader = () => {
  return (
    <Box textAlign="center" maxWidth={700} mx="auto" py={2} height="100vh">
      <Typography variant="h4" mb={3}>
        Fetching Data, please refresh the page if it takes too much time
      </Typography>
      <CircularProgress color="primary" size={100} />
    </Box>
  );
};

export default Loader;
