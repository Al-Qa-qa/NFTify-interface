// MUI Components
import RouterLink from "next/link";
import Image from "next/image";
import MuiLink from "@/src/Link";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

// Image
import logo from "@/public/nft.png";

// NOTEL using routerlink and muilink is nonsince as MUI team made a Link component that solves this problem

// -----

const FooterLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <MuiLink
      color="inherit"
      underline="none"
      sx={{
        cursor: "pointer",
        opacity: 0.5,
        "&:hover": { opacity: 0.8 },
      }}
      href={href}
    >
      {text}
    </MuiLink>
  );
};

const FooterExternalLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <MuiLink
      color="inherit"
      underline="none"
      sx={{
        cursor: "pointer",
        opacity: 0.5,
        "&:hover": { opacity: 0.8 },
      }}
      href={href}
    >
      {text}
    </MuiLink>
  );
};

const Footer = () => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Container maxWidth="lg">
        <Box py={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <Stack
                direction="row"
                alignItems="center"
                component={RouterLink}
                href="/"
                sx={{ color: "unset", textDecoration: "unset" }}
              >
                <Image src={logo} alt={"crypto support"} height={40} />
                <Typography variant="h4" component="h1" pl={1}>
                  NFTify
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Start minting, listing, or buying NFTs easy from now using
                NFTify marketplace
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Typography variant="h5" mb={2}>
                Marketplace
              </Typography>
              <Stack direction="column" spacing={2}>
                <FooterLink text="Explore" href="/items" />
                <FooterLink text="Account" href="/account" />
                <FooterLink text="List new item" href="/list-item" />
                <FooterLink text="Mint an item" href="/mint" />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Typography variant="h5" mb={2}>
                Links
              </Typography>
              <Stack direction="column" spacing={2}>
                <FooterLink text="Account" href="/account" />
                <FooterLink
                  text="Sources and Credits"
                  href="/sources-and-credits"
                />
                <FooterExternalLink
                  text="Contact Developer"
                  href="mailto:ahmed.cross10@gmail.com"
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Typography variant="h5" mb={2}>
                Social Links
              </Typography>
              <Stack direction="column" spacing={2}>
                <FooterExternalLink
                  text="Github"
                  href="https://github.com/Al-Qa-qa/"
                />
                <FooterExternalLink
                  text="Twitter"
                  href="https://twitter.com/Al_Qa_qa"
                />
                <FooterExternalLink
                  text="Discord"
                  href="https://discord.com/users/al_qa_qa"
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography textAlign="center">
          @ {new Date().getFullYear()} NFTify, All right reserved
        </Typography>
      </Container>
    </Paper>
  );
};

export default Footer;

/*

*/
