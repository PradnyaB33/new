import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box, Grid } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import NotificationIcon from "./NotificationIcon";
import ProfileIcon from "../../profieicon/profileIcon";
import aegislogo from "../../../assets/logoAegis.jpeg"; // Adjust import according to your structure
import { DrawerProvider, useDrawer } from "./Drawer"
import TestNavItems from "./test-nav-items";
import { Outlet, useParams } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import ChangeRole from "../../InputFileds/ChangeRole";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";

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
    const { organisationId } = useParams();
    const orgId = organisationId;
    console.log("sssssorganisationId", orgId);

    const navigate = useNavigate();

    // React.useEffect(() => {
    //     // const hasEmployeeOnboarding = pathname.includes("employee-onboarding");
    //     getOrganizationIdFromPathname(location.pathname);
    //     // eslint-disable-next-line
    // }, [location.pathname, orgId]);

    const { data } = useSubscriptionGet({
        organisationId: orgId,
    });
    console.log("mayuridata", data);

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
                            <IconButton sx={{ color: "black", opacity: "0.5" }} onClick={() => navigate(-1)}>
                                <ChevronLeftIcon />
                            </IconButton>

                        </Grid>
                        <Grid lg={10} sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "end" }}>
                            <Box sx={{ display: "flex", }}>
                                {data?.organisation?.logo_url && (
                                    <img
                                        src={data.organisation.logo_url}
                                        alt="Organization Logo"
                                        style={{ width: "30px", height: "auto", margin: " 0px 10px" }}
                                    />
                                )}
                                <Typography variant="h6" sx={{ fontWeight: "600", color: "black", mr: "10px" }}> {data?.organisation?.orgName}</Typography>
                                <Box className="border-r border-[#808080]"></Box>
                            </Box>
                            <Box >   <NotificationIcon />
                                <ProfileIcon />
                            </Box>
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
