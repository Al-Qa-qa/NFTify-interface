import React, { Fragment, ReactNode, useState } from "react";
import Link from "next/link";
// Styles
import "react-toastify/dist/ReactToastify.css";

// MUI Components
import { Slide, ToastContainer } from "react-toastify";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import StoreIcon from "@mui/icons-material/Store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

// Self UI Components
import Header from "./globals/Header";
import Footer from "./globals/Footer";

// ------------

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  /**
   * Open navigation menu
   */
  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  /**
   * Close navigation menu
   */
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <Fragment key={"aa"}>
      <div>
        <Header handleMenuOpen={handleMenuOpen} />
        <main>{children}</main>
        <Footer />
      </div>
      {/* Menu Drawer (nav) */}
      <Drawer anchor="right" open={menuOpen} onClose={handleMenuClose}>
        <Box width="250px">
          <Stack direction="row" justifyContent="flex-end" sx={{ p: 1 }}>
            <IconButton
              aria-label="close"
              size="medium"
              onClick={handleMenuClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Stack>
          <Divider />
          <Stack direction="column">
            <List>
              <ListItem>
                <ListItemButton
                  sx={{ borderRadius: "16px" }}
                  LinkComponent={Link}
                  href="/items"
                >
                  <ListItemIcon>
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText primary="Listed Items" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  sx={{ borderRadius: "16px" }}
                  LinkComponent={Link}
                  href="/account"
                >
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account Page" />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemButton
                  sx={{ borderRadius: "16px" }}
                  LinkComponent={Link}
                  href="/list-item"
                >
                  <ListItemIcon>
                    <AddCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add new Item" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  sx={{ borderRadius: "16px" }}
                  LinkComponent={Link}
                  href="/mint"
                >
                  <ListItemIcon>
                    <ImageSearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Mint NFT" />
                </ListItemButton>
              </ListItem>
            </List>
          </Stack>
        </Box>
      </Drawer>
      {/*  */}
      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#222",
        }}
        theme="dark"
      />
    </Fragment>
  );
};

export default Layout;
