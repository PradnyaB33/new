import { Notifications } from "@mui/icons-material";
import { Badge } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import useNotificationCount from "../notification-zustand";

const NotificationIcon = () => {
  const { notificationCount } = useNotificationCount();

  return (
    <Link to={"/notification"}>
      <Badge
        variant={"standard"}
        color={"error"}
        badgeContent={notificationCount}
      >
        <Notifications className="text-white" />
      </Badge>
    </Link>
  );
};

export default NotificationIcon;
