// import { NotificationImportant } from "@mui/icons-material";
import Box from "@mui/material/Box";
import axios from "axios";
// import dayjs from "dayjs";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import PunchingRejectModal from "../../components/Modal/RemotePunchingModal/PunchingRejectModal";
import ShiftRejectModel from "../../components/Modal/ShiftRequestModal/ShiftRejectModel";
// import Error from "./Error";
// import Loader from "./Loader";
import UserProfile from "../../hooks/UserData/useUser";

const Notification = () => {
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

  const { data } = useQuery("employee-leave", async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/get`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data;
    } catch (err) {
      console.log(`🚀 ~ file: notification.jsx:37 ~ err:`, err);
      // handleAlert(
      //   true,
      //   "error",
      //   err.response.data.message || "Server is under Maintainance"
      // );
      throw err;
    }
  });

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

      return data;
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
      if(isAcc){
        const finalData = response.data.punchNotification.filter((item) =>{
          return item.status === 'M-approved'
        })
        return finalData
      }
      return response.data.punchNotification;
    } catch (err) {
      console.log(`🚀 ~ file: notification.jsx:37 ~ err:`, err);

      throw err;
    }
  });

  console.log(data3);
  console.log(data2);
  console.log(data);
  return (
    <>
      <Box
        className="py-2"
        sx={{
          flexGrow: 1,
          p: 5,
        }}
      ></Box>

      <div className="flex flex-col gap-8 px-8">
        {data2?.map((items, idx) => {
          console.log("items", items);
          return <ShiftRejectModel key={idx} items={items} />;
          // return <div>hello</div>;
        })}
        {data?.leaveRequests?.map((items, idx) => (
          <LeaveRejectmodal key={idx} items={items} />
        ))}
        {data3?.map((items, idx) => (
          <PunchingRejectModal items={items} length={data3?.length} key={idx} />
        ))}
      </div>
    </>
  );
};

export default Notification;
