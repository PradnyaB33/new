import { Menu } from "@mui/icons-material";
import { AppBar, Badge, IconButton, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";
import { useCallback } from "react"; // Import useCallback
import { useLocation } from "react-router-dom";
import ProfileIcon from "../profieicon/profileIcon";
import NotificationIcon from "./components/NotificationIcon";
import TestNavItems from "./components/test-nav-items";

export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  // Use useCallback to memoize the toggleDrawer function
  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const list = (
    <Box
      sx={{ width: 250, height: 100 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <TestNavItems toggleDrawer={toggleDrawer} />
      {/* <NavItems toggleDrawer={toggleDrawer} /> */}
    </Box>
  );

  return (
    <div
      className={`${
        location.pathname.includes("/sign-in") ||
        location.pathname.includes("/sign-up") ||
        location.pathname.includes("/terms-and-conditions") ||
        location.pathname.includes("/choose-role")
          ? "hidden"
          : "block"
      }`}
    >
      <AppBar position="fixed">
        <Toolbar className="justify-between">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            <Menu /> {/* Pass Menu component as a child */}
          </IconButton>
          <Badge>
            <Typography variant="h6" noWrap component="div">
              AEGIS
            </Typography>
          </Badge>
          <div className="flex gap-2 items-center">
            <NotificationIcon />
            <ProfileIcon />
          </div>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        PaperProps={{ style: { background: "white" } }}
        color="white"
        anchor="left"
        open={open}
        onClose={toggleDrawer} // Removed unnecessary function call here
        onOpen={toggleDrawer} // Removed unnecessary function call here
      >
        <div className="py-4 px-10 border-b-[.5px] flex  items-center gap-4 border-gray-300 ">
          <img src="/logo.svg" className="h-[30px]" alt="logo" />
          <div>
            <h1 className="text-2xl">AEGIS</h1>
          </div>
        </div>

        {/* <div className="mt-4 flex gap-3 px-4 w-full text-sm items-center">
          <Select
            options={user?.profile?.map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
            placeholder={"Choose your role"}
            className="w-full"
          />
        </div> */}
        {list}
      </SwipeableDrawer>
    </div>
  );
}
