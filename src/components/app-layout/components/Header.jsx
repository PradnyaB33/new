import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import NotificationIcon from "./NotificationIcon";
import ProfileIcon from "../../profieicon/profileIcon";
import aegislogo from "../../../assets/logoAegis.jpeg"; // Adjust import according to your structure
import { DrawerProvider, useDrawer } from "./Drawer"
import TestNavItems from "./test-nav-items";
import { Outlet } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChangeRole from "../../InputFileds/ChangeRole";
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
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
        }),
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

    return (
        <>
            <AppBar
                position="fixed"
                open={open}
                sx={{ backgroundColor: "#F9FAFC", boxShadow: "none", border: "none" }}
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
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton sx={{ color: "black", opacity: "0.5" }}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton sx={{ color: "black", opacity: "0.5" }}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <NotificationIcon />
                            <ProfileIcon />
                        </Box>
                    </Box>
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
                        border: "none",

                    },
                }}
            >
                <Toolbar sx={{ justifyContent: "center" }}>

                    <img src={aegislogo} alt="AEGIS" style={{ width: "120px", height: "auto" }} />
                </Toolbar>

                <List
                    className="overflow-auto  sticky top-0 w-full h-[90vh]"
                    sx={{ paddingTop: "0px" }}>
                    <Box> <IconButton
                        sx={{ color: "black", opacity: "0.5", }}
                        onClick={handleDrawerOpen}
                    >
                        <ChevronLeftIcon />
                    </IconButton></Box>
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
