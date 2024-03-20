import { AccountCircle, PersonOutline } from "@mui/icons-material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import useGetUser from "../../hooks/Token/useUser";
import UserProfile from "../../hooks/UserData/useUser";

export default function ProfileIcon() {
  const navigate = useNavigate();

  // const { removeCookie, cookies } = useContext(UseContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const open = Boolean(anchorEl);
  const [availableUserProfileData, setAvailableProfileData] = useState();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const userId = user?._id;
  const { authToken } = useGetUser();

  const { data } = useQuery("emp-profile", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/populate/get`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data.emp;
  });

  console.log(data);

  useEffect(() => {
    const fetchAvailableUserProfileData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setAvailableProfileData(response.data.employee);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };
    fetchAvailableUserProfileData();
  }, [token, userId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // setAnchorEl(null);
    // console.log(cookies.aeigs);
    navigate("/sign-in");
    window.location.reload();
    Cookies.remove("aegis");
    Cookies.remove("role");
  };

  const handleNavigate = (link) => {
    navigate(link);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="basic-button"
        className="bg-white"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {data?.user_logo_url ? (
          <Avatar>
            <img src={data?.user_logo_url} alt="" />
          </Avatar>
        ) : (
          <Avatar className="!bg-[#1976d2]">
            <AccountCircle className="!text-white" />
          </Avatar>
        )}
      </IconButton>
      <Menu
        id="basic-menu"
        className="!pt-0 !p-0 !shadow-lg "
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {user?._id ? (
          <div>
            <h1 className="!px-4 pt-4  text-lg">Account</h1>
            {/* <Divider variant="fullWidth" orientation="horizontal" /> */}
            <div className="flex !pl-0 !pr-2 !w-[230px] flex-col !z-10  mx-4 !py-0 bg-white   !items-start !justify-start">
              <div className="w-max flex gap-3 pt-4 pb-6  items-center  h-max rounded-full ">
                <Avatar
                  variant="circular"
                  src={"" || availableUserProfileData?.user_logo_url}
                  alt="none"
                  sx={{ width: 35, height: 35 }}
                  className="!rounded-[50%]
                     !shadow-lg  !object-cover"
                />
                <div>
                  <h1 className="italic !font-semibold  text-gray-600  !text-sm ">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-sm text-gray-600  ">{user?.email}</p>
                </div>
              </div>
            </div>

            <Divider variant="fullWidth" orientation="horizontal" />

            <MenuItem
              key="profile"
              onClick={() => handleNavigate("/employee-profile")}
              className="flex gap-4  !text-sm items-center justify-center !py-3 hover:!bg-gray-100  "
            >
              <PersonOutline className="!text-[19px]" /> Profile
            </MenuItem>

            <MenuItem key="sign-out" className="!p-0" onClick={handleSignOut}>
              <div className="flex  w-full h-full items-center !text-sm  hover:!bg-red-500 !text-red-500 !py-3 hover:!text-white transition-all gap-4  px-4">
                <ExitToAppIcon className="!text-[19px]" /> Log out
              </div>
            </MenuItem>
          </div>
        ) : (
          <>
            <Link key="sign-up-link" to="/sign-up">
              <MenuItem onClick={handleClose}>Sign Up</MenuItem>
            </Link>
            <Link key="sign-in-link" to="/sign-in">
              <MenuItem onClick={handleClose}>Sign In</MenuItem>
            </Link>
            ,
          </>
        )}
      </Menu>
    </>
  );
}
