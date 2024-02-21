import { Download, Notifications } from "@mui/icons-material";
import { Badge } from "@mui/material";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import useGetUser from "../../../hooks/Token/useUser";

const NotificationIcon = () => {
  const { authToken } = useGetUser();
  const { data, isFetching } = useQuery("employee-leave", async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    } catch (err) {
      console.error(`🚀 ~ file: notification.jsx:37 ~ err:`, err);
      throw err;
    }
  });
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
