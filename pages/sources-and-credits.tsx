import React from "react";

// UI Componnts
import MuiLink from "@/src/Link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
// --> Our Components
import Layout from "@/src/components/Layout";

// ------------------

function SourcesAndCredits() {
  return (
    <Layout>
      {/* Listed NFTs */}
      <Container maxWidth="lg" sx={{ pb: 5, mt: "72px" }}>
        <Typography variant="h2" pt={3} pb={2} color="text.secondary">
          Sources and Credits
        </Typography>
        <Typography variant="subtitle1">
          All images used are free or under freepik licence
        </Typography>
        <Typography variant="subtitle1">
          All icons used are free or under flaticon licence
        </Typography>
        <br />
        <Divider />
        <br />
        <Stack direction="column" spacing={0.5}>
          <Typography variant="body2">
            Home preview image:{" "}
            <MuiLink href="https://www.freepik.com/free-ai-image/tiger-with-cyborg-design-black-background_41436361.htm#page=2&query=nft%20art&position=27&from_view=keyword&track=ais">
              Image By ryujintmvn
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Pandas collection images:{" "}
            <MuiLink href="https://www.freepik.com/free-vector/cute-pandas-seamless-pattern_30161869.htm#query=pandas&position=24&from_view=search&track=sph">
              Image by brgfx
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Camels collection image:{" "}
            <MuiLink href="https://www.freepik.com/free-vector/cute-man-riding-camel-cartoon-vector-icon-illustration-people-animal-icon-concept-isolated-premium_40269018.htm#query=camel&position=45&from_view=search&track=sph">
              Image by catalyststuff
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Birds collection image:{" "}
            <MuiLink href="https://www.freepik.com/free-vector/hand-drawn-cartoon-animal-illustration_41041462.htm#page=3&query=birds&position=12&from_view=search&track=sph">
              Image By pikisuperstar
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Dolphins collection image:{" "}
            <MuiLink href="https://www.freepik.com/free-vector/hand-drawn-dolphin-cartoon-illustration_48927673.htm#query=dolphines&position=40&from_view=search&track=sph">
              Image By freepik
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Snakes collection image:{" "}
            <MuiLink href="https://www.freepik.com/free-vector/hand-drawn-medical-pharmacy-symbol_29900471.htm#page=4&query=snake&position=42&from_view=search&track=sph">
              Image By freepik
            </MuiLink>
          </Typography>
          <br />
          <Divider />
          <br />
          <Typography variant="body2">
            Camel NFT image:{" "}
            <MuiLink href="https://www.freepik.com/free-psd/3d-rendering-wild-animal_37851256.htm#query=camel&position=31&from_view=search&track=sph">
              Image By freepik
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Panda NFT image:{" "}
            <MuiLink href="https://www.freepik.com/free-psd/3d-rendering-wild-animal_37851240.htm#from_view=detail_serie">
              Image By freepik
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Snake NFT image:{" "}
            <MuiLink href="https://www.freepik.com/free-psd/3d-rendering-wild-animal_37851246.htm#from_view=detail_serie">
              Image By freepik
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Bird NFT image:{" "}
            <MuiLink href="https://www.freepik.com/free-psd/3d-rendering-wild-animal_37851252.htm#from_view=detail_serie">
              Image By freepik
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Dolphin NFT image:{" "}
            <MuiLink href="https://www.freepik.com/free-psd/3d-icon-with-aquatic-animal_36190300.htm#query=dolphins&position=1&from_view=search&track=sph">
              Image By freepik
            </MuiLink>
          </Typography>
          <br />
          <Divider />
          <br />
          <Typography variant="body2">
            Logo:{" "}
            <MuiLink
              href="https://www.flaticon.com/free-icons/nft"
              title="nft icons"
            >
              Nft icons created by juicy_fish - Flaticon
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Easy mint icon:{" "}
            <MuiLink
              href="https://www.flaticon.com/free-icons/dig"
              title="dig icons"
            >
              Dig icons created by Freepik - Flaticon
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            low fees icon:{" "}
            <MuiLink
              href="https://www.flaticon.com/free-icons/fee"
              title="fee icons"
            >
              Fee icons created by Freepik - Flaticon
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Testnet support icon:{" "}
            <MuiLink
              href="https://www.flaticon.com/free-icons/blockchain"
              title="blockchain icons"
            >
              Blockchain icons created by Freepik - Flaticon
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            Super fast icon:{" "}
            <MuiLink
              href="https://www.flaticon.com/free-icons/quick"
              title="quick icons"
            >
              Quick icons created by Cuputo - Flaticon
            </MuiLink>
          </Typography>
        </Stack>
      </Container>
    </Layout>
  );
}

export default SourcesAndCredits;
