import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Box, Grid, Stack } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import aegislogo from "../../../assets/logoAegis.jpeg"; // Adjust import according to your structure
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import ChangeRole from "../../InputFileds/ChangeRole";
import ProfileIcon from "../../profieicon/profileIcon";
import { DrawerProvider, useDrawer } from "./Drawer";
import NotificationIcon from "./NotificationIcon";
import TestNavItems from "./test-nav-items";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      width: open ? drawerWidth : 0,
      top: 0,
      left: 0,
      height: "100vh",
      zIndex: 1300,
    },
    [theme.breakpoints.up("md")]: {
      position: "relative",
      overflowX: "hidden",
      width: open ? drawerWidth : theme.spacing(9),
    },
  },
}));

export default function Header() {
  return (
    <DrawerProvider>
      <Box sx={{ display: "flex" }}>
        <HeaderContent />
      </Box>
    </DrawerProvider>
  );
}

function HeaderContent() {
  const { open, handleDrawerOpen } = useDrawer();
  const { organisationId } = useParams();
  const orgId = organisationId;

  const navigate = useNavigate();

  const { data } = useSubscriptionGet({
    organisationId: orgId,
  });

  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        className="!border-b !bg-white"
        sx={{ boxShadow: "none" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none", border: "none" }),
            }}
          >
            <MenuIcon style={{ color: "black" }} />
          </IconButton>
          <Grid
            container
            lg={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Grid lg={2} sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{ color: "black", opacity: "0.5" }}
                onClick={() => navigate(-1)}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Grid>
            <Grid
              lg={10}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <Stack
                direction={"row"}
                sx={{ alignItems: "center", gap: "10px" }}
              >
                <Avatar
                  variant="rounded"
                  src={data?.organisation?.logo_url}
                  alt="none"
                  sx={{ width: 28, height: 28 }}
                />

                <h1 className="text-lg font-bold      text-black ">
                  {data?.organisation?.orgName}
                </h1>
              </Stack>
              <span className="border-r-[0.5px]   border-gray-500  text-black !h-[20px]" />
              <div className="space-x-4">
                <NotificationIcon />
                <ProfileIcon />
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : 0,
            height: "auto",
            boxSizing: "border-box",
            overflow: "hidden",
            borderRight: ".5px solid #E5E7EB",
          },
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <img
            src={aegislogo}
            alt="AEGIS"
            style={{ width: "120px", height: "auto" }}
          />
        </Toolbar>

        <List
          className="overflow-auto !border-t  sticky top-0 w-full h-[90vh]"
          sx={{ paddingTop: "0px" }}
        >
          <Box>
            {" "}
            <IconButton
              sx={{ color: "black", opacity: "0.5" }}
              onClick={handleDrawerOpen}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          <ChangeRole />
          <TestNavItems />
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "auto",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sm={12} lg={12}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
