import axios from "axios";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import UserProfile from "../../hooks/UserData/useUser";
import Card from "./components/card";

const ParentNotification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  let isAcc = false;
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const profileArr = user.profile;

  profileArr.forEach((element) => {
    if (element === "Accountant") {
      isAcc = true;
    }
  });

  const { data } = useLeaveNotificationHook();

  const { data: data2 } = useQuery("shift-request", async () => {
    try {
      let url;
      if (isAcc) {
        url = `${process.env.REACT_APP_API}/route/shiftApply/getForAccountant`;
        const response = await axios.get(url, {
          headers: { Authorization: authToken },
        });
        return response.data.requests;
      } else {
        url = `${process.env.REACT_APP_API}/route/shiftApply/getForManager`;
        const response = await axios.get(url, {
          headers: { Authorization: authToken },
        });
        const data = response.data.requests.filter(
          (item) => item.status === "Pending"
        );
        return data;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  });

  const { data: data3 } = useQuery("punch-request", async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/punch-notification/notification-user`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.punchNotification;
    } catch (err) {
      console.log(`🚀 ~ file: notification.jsx:37 ~ err:`, err);

      throw err;
    }
  });
  const dummyData = [
    {
      name: "Leave Notification",
      count: data?.length,
      color: "#FF7373",
      url: "/leave-notification",
    },
    {
      name: "Shift Notification",
      count: data2?.length,
      color: "#3668ff",
      url: "/shift-notification",
    },
    {
      name: "Remote Punching Notification",
      count: data3?.length,
      color: "#51FD96",
      url: "/remote-notification",
    },
    {
      name: "Department Notification",
      count: 2,
      color: "#51E8FD",
      url: "/department-notification",
    },
  ];
  return (
    <div className="pt-5">
      <div className="w-full h-full gap-2 flex p-4 flex-wrap justify-center">
        <Card card={dummyData} />
      </div>
    </div>
  );
};

export default ParentNotification;
