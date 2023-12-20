import { NotificationsOutlined, PersonOutline } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Divider } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";

export default function ProfileIcon() {
  const navigate = useNavigate();
  const { cookies, removeCookie } = useContext(UseContext);
  const token = cookies["aeigs"];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [user, setUser] = useState();

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.user) {
        setUser(decodedToken.user);
      } else {
        setUser();
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
  }, [token]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    removeCookie("aeigs");
    setAnchorEl(null);
    navigate("/sign-in");
    window.location.reload();
  };

  // const handleNotificationClick = () => {
  //   navigate("/notification");
  //   setAnchorEl(null);
  // };

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
        <Avatar className="!bg-[#1976d2]">
          <AccountCircleIcon className="!text-white" />
        </Avatar>
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
        {token ? (
          <div>
            <h1 className="!px-4 pt-4 pb-2 text-xl">Account</h1>
            {/* <Divider variant="fullWidth" orientation="horizontal" /> */}
            <div className="flex !w-[230px] flex-col !z-10 !px-0 mx-4 !py-0 bg-white   !items-start !justify-start">
              <div className="w-max flex gap-3 pt-4 pb-6  items-center  h-max rounded-full ">
                <Avatar
                  variant="circular"
                  src=""
                  alt="none"
                  sx={{ width: 35, height: 35 }}
                  className="!rounded-[50%]
                     !shadow-lg  !object-cover"
                />
                <div>
                  <h1 className="italic !font-semibold  text-gray-600  !text-md ">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-sm text-gray-600  ">{user?.email}</p>
                  {/* <p className="text-sm italic">
                    Working as{" "}
                    <Tooltip title={user?.profile.join(",")}>
                      <span className="text-blue-500 cursor-pointer hover:underline ">
                        @job
                      </span>
                    </Tooltip>
                  </p> */}
                </div>
              </div>
            </div>

            <Divider variant="fullWidth" orientation="horizontal" />

            <MenuItem
              key="profile"
              onClick={() => handleNavigate("/userprofile")}
              className="flex gap-4 items-center justify-center !py-3 hover:!bg-gray-100  "
            >
              <PersonOutline className="!text-[19px]" /> Profile
            </MenuItem>

            <MenuItem
              key="notification"
              className="flex gap-4  items-center justify-center !py-3 hover:!bg-gray-100  "
              onClick={() => handleNavigate("/notification")}
            >
              <NotificationsOutlined className="!text-[19px]" /> Notification
            </MenuItem>

            <MenuItem key="sign-out" className="!p-0" onClick={handleSignOut}>
              <div className="flex  w-full h-full items-center  hover:!bg-red-500 !text-red-500 !py-3 hover:!text-white transition-all gap-4  px-4">
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
