import { Download, Notifications } from "@mui/icons-material";
import { Badge } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import useLeaveNotificationHook from "../../../hooks/QueryHook/notification/leave-notification/hook";

const NotificationIcon = () => {
  const { data, isFetching } = useLeaveNotificationHook();
  return (
    <Link to={"/notification"}>
      <Badge
        variant={"standard"}
        color={isFetching ? "secondary" : "error"}
        badgeContent={
          isFetching ? (
            <Download className="!text-[10px] text-white" />
          ) : (
            data?.leaveRequests?.length
          )
        }
      >
        <Notifications className="text-white" />
      </Badge>
    </Link>
  );
};

export default NotificationIcon;
