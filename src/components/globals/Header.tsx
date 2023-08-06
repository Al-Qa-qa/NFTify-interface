// UI Components
import Link from "next/link";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// --> Our Components
import SelectNetwork from "@/src/components/web3/SelectNetwork";
import ConnectButton from "@/src/components/web3/ConnectButton";

// Images
import logo from "@/public/nft.png";

// Icons
import MenuIcon from "@mui/icons-material/Menu";

// --------------------------

type HeaderProps = {
  handleMenuOpen: () => void;
};

const Header = ({ handleMenuOpen }: HeaderProps) => {
  return (
    <AppBar position="fixed" elevation={0}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 2 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            component={Link}
            href="/"
            sx={{ color: "unset", textDecoration: "unset" }}
          >
            <Image src={logo} alt={"crypto support"} height={40} />
            <Typography variant="h4" component="h1" pl={1}>
              NFTify
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <SelectNetwork />
            <ConnectButton />
            <Box display="flex" alignItems="center">
              <IconButton
                aria-label="menu"
                size="medium"
                onClick={handleMenuOpen}
              >
                <MenuIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Stack>
        </Stack>
      </Container>
      <Divider />
    </AppBar>
  );
};

export default Header;
