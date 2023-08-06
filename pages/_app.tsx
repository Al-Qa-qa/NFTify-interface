import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";

// emotion
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../src/createEmotionCache";

// MUI
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme";

// Contexts
import { MoralisProvider } from "react-moralis";

// -------------------

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>NFTify - Simple NFT Market Place</title>
      </Head>
      <ThemeProvider theme={theme}>
        <MoralisProvider initializeOnMount={false}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline enableColorScheme />
          <Component {...pageProps} />
        </MoralisProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
