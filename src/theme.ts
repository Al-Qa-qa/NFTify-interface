import { Poppins } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { blue, orange, red, grey } from "@mui/material/colors";

// -----------

export const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "unset",
          whiteSpace: "nowrap",
          borderRadius: "16px",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: blue["300"],
    },
    secondary: {
      main: grey["700"],
    },
    // error: {
    //   main: red.A400,
    // },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h1: {
      fontSize: 60,
      fontWeight: 700,
      "@media (max-width:600px)": {
        fontSize: 35,
        fontWeight: 700,
      },
    },
    h2: {
      fontSize: 35,
      fontWeight: 400,
      "@media (max-width:600px)": {
        fontSize: 32,
      },
    },
    h3: {
      fontSize: 28,
      fontWeight: 500,
    },
    h4: {
      fontSize: 22,
      fontWeight: 500,
    },
    h5: {
      fontSize: 20,
      fontWeight: 500,
    },
    h6: {
      fontSize: 16,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 500,
    },
  },
});

export default theme;
