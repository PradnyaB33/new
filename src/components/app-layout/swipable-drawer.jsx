import { Menu } from "@mui/icons-material";
import { AppBar, Badge, IconButton, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";
import { useCallback } from "react"; // Import useCallback
import { useLocation } from "react-router-dom";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import useGetUser from "../../hooks/Token/useUser";
import UserProfile from "../../hooks/UserData/useUser";
import ChangeRole from "../InputFileds/ChangeRole";
import ProfileIcon from "../profieicon/profileIcon";
import NotificationIcon from "./components/NotificationIcon";
import TestNavItems from "./components/test-nav-items";

export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [orgId, setOrgId] = React.useState(null);
  const { decodedToken: decoded } = useGetUser();
  // Function to extract organization ID from pathname
  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    let orgId;

    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      if (parts[orgIndex + 1] === null || undefined) {
        orgId = decoded?.user?.organizationId;
      } else {
        orgId = parts[orgIndex + 1];
      }
    } else {
      orgId = decoded?.user?.organizationId;
    }
    setOrgId(orgId);
  };

  // Update organization ID when URL changes
  React.useEffect(() => {
    // const hasEmployeeOnboarding = pathname.includes("employee-onboarding");
    getOrganizationIdFromPathname(location.pathname);
    console.log(`🚀 ~ orgId:`, orgId);
    // eslint-disable-next-line
  }, [location.pathname, orgId]);

  const { data } = useSubscriptionGet({
    organisationId: orgId,
  });
  console.log(`🚀 ~ data:`, data);

  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const list = (
    <Box
      sx={{ width: 250, height: 100 }}
      role="presentation"
      // onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <TestNavItems toggleDrawer={toggleDrawer} />
      {/* <NavItems toggleDrawer={toggleDrawer} /> */}
    </Box>
  );

  const paths = ["/sign-in", "/organizationList"];
  const isLocation = React.useMemo(() => {
    return paths.some((path) => location.pathname.includes(path));
  }, [location.pathname]);
  console.log(`🚀 ~ isLocation:`, isLocation);

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
            {/* <h1 className="py-[0.125em] px-2 rounded-sm  font-bold">
              Organization one
            </h1> */}

            {data?.organisation?.orgName &&
              !isLocation &&
              data?.organisation?.orgName}
            {role && role !== "Employee" && <NotificationIcon />}

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
        <ChangeRole />
        {list}
      </SwipeableDrawer>
    </div>
  );
}
