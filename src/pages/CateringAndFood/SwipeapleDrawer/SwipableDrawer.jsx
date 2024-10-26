// import React from 'react'

import { useLocation } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";
import { useCallback,useState,useEffect } from "react";
import TestNavItems from "../../../components/app-layout/components/test-nav-items";
import NotificationIcon from "../../../components/app-layout/components/NotificationIcon";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import ProfileIcon from "../../../components/profieicon/profileIcon";
import ChangeRole from "../../../components/InputFileds/ChangeRole";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import { useParams } from "react-router";
import useAuthToken from "../../hooks/Token/useAuth";

import axios from "axios";

export default function SwipableDrawer() {
  const { employeeId } = useParams();
    const [open, setOpen] = React.useState(false);
    const [isSelfOnboarded, setIsSelfOnboarded] = useState(false);
    const location = useLocation();
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
  
    const role = UserProfile().useGetCurrentRole();
  
    // Update organization ID when URL changes
    React.useEffect(() => {
      // const hasEmployeeOnboarding = pathname.includes("employee-onboarding");
      getOrganizationIdFromPathname(location.pathname);
      // eslint-disable-next-line
    }, [location.pathname, orgId]);
  
    const { data } = useSubscriptionGet({
      organisationId: orgId,
    });
  
    const toggleDrawer = useCallback(() => {
      setOpen(!open);
    }, [open]);
  
    const list = (
      <Box
        sx={{ width: 250, height: 100 }}
        role="presentation"
        onKeyDown={toggleDrawer}
      >
        <TestNavItems toggleDrawer={toggleDrawer} />
      </Box>
    );
  
    const paths = ["/sign-in", "/organizationList"];
    const isLocation = React.useMemo(() => {
      return paths.some((path) => {
        return location.pathname.includes(path) || location.pathname === "/";
      });
      // eslint-disable-next-line
    }, [location.pathname]);
  
    //resolved bug
    const pathsToHideOrgName = ["/add-organisation", "/organizationList"];
  
    const authToken = useAuthToken();

    // Fetch employee details to check if the user is self-onboarded
    useEffect(() => {
      if (employeeId) {
        const fetchEmployeeData = async () => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
              {
                headers: {
                  Authorization: authToken,
                },
              }
            );
            // setIsSelfOnboarded(response.data?.employee?.isSelfOnboard || false);
            const isSelfOnboard = response.data?.employee?.isSelfOnboard || false;
            setIsSelfOnboarded(isSelfOnboard);
            console.log("isSelfOnboarded:", isSelfOnboard);
          } catch (error) {
            console.error("Error fetching employee data:", error);
          }
        };
  
        fetchEmployeeData();
      }
    }, [employeeId, authToken]);
  
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
          <Toolbar className="flex justify-between items-center">
            <div className="flex items-center">
            {!isSelfOnboarded && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                edge="start"
                sx={{ marginRight: 2 }}
              >
                <Menu />
              </IconButton>
               )}
  
              <div className="hidden sm:flex items-center">
     
  
                <span className="inline-flex items-center justify-center w-13 h-13 bg-white border border-gray-500 rounded-full p-2">
                  <img
                    src="/A1.jpg"
                    alt="AEGIS"
                    className="w-8 h-8 object-cover rounded-full mix-blend-multiply"
                  />
                </span>
  
                <img
                  src="/Aegis_logo_name.png"
                  alt="AEGIS"
                  className="w-[3.6rem] h-[2.3rem] -mt-2 ml-1 -top-2 object-cover text-white "
                />
              </div>
            </div>
  
            <div className="flex gap-2 items-center">
              {/* {data?.organisation?.orgName &&
              !isLocation &&
              data?.organisation?.orgName}
              {role && <NotificationIcon />} */}
              {/* //resolved bug */}
              {data?.organisation?.orgName &&
                !isLocation &&
                !pathsToHideOrgName.includes(location.pathname) &&
                data?.organisation?.orgName}
              {role && <NotificationIcon />}
              <ProfileIcon />
            </div>
          </Toolbar>
        </AppBar>
  
        <SwipeableDrawer
          PaperProps={{ style: { background: "white" } }}
          color="white"
          anchor="left"
          open={open}
          onClose={toggleDrawer}
          onOpen={toggleDrawer}
        >
          <div className="py-2 px-10 border-b-[.5px] flex items-center gap-2 border-gray-300">
            <span className="inline-flex items-center justify-center w-13 h-13 bg-white border border-gray-500 rounded-full p-2">
              <img
                src="/A1.jpg"
                alt="AEGIS"
                className="w-8 h-8 object-cover rounded-full mix-blend-multiply"
              />
            </span>
  
            <img
              // src="/Aegis_logo_name.png"
              src="/A2.jpg"
              alt="AEGIS"
              className="w-[3.6rem] h-[2.1rem] -mt-1   object-cover text-white mix-blend-multiply"
            />
          </div>
          <ChangeRole />
          {list}
        </SwipeableDrawer>
      </div>
    );
  }
  