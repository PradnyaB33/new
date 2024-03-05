import { NotificationImportant } from "@mui/icons-material";
import Box from "@mui/material/Box";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import ShiftRejectModel from "../../components/Modal/ShiftRequestModal/ShiftRejectModel";
import Error from "./Error";
import Loader from "./Loader";

const AccountantNotification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [newData, setNewData] = useState([])

  const { handleAlert } = useContext(TestContext);

  const { data, isLoading, isError, error, isFetching } = useQuery(
    "employee-leave",
    async () => {
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
        handleAlert(
          true,
          "error",
          err.response.data.message || "Server is under Maintainance"
        );
        throw err;
      }
    }
  );


  // const { data: newData } = useQuery(
  //   "shift-request",
    const checkStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/shiftApply/getForManager`,
          {
            headers: { Authorization: authToken },
          }
        );
        setNewData(response.data);
      } catch (err) {
        console.log(`🚀 ~ file: notification.jsx:37 ~ err:`, err);
        handleAlert(
          true,
          "error",
          err.response.data.message || "Server is under Maintainance"
        );
        throw err;
      }
    }
    useEffect(() =>{
      checkStatus()
    },[])
  console.log("newData", newData);


  if (isError) {
    return <Error error={error} />;
  }

  if (isLoading) {
    return <Loader />
  }

  if (isFetching) {
    return <Loader />
  }
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
        {data?.leaveRequests?.length === 0 && newData?.requests?.length === 0 ? (
          <>
            <div className="flex items-center gap-4  bg-sky-100 p-4 px-8 rounded-md shadow-lg">
              <NotificationImportant className="!text-4xl" />
              <h1 className="text-2xl font-semibold">No Notification</h1>
            </div>
          </>
        ) : (
          ""
        )}
        {
          newData?.requests?.map((items, idx) => {
            console.log(`🚀 ~ items:`, dayjs(items.end).diff(dayjs(items.start)));
            return <ShiftRejectModel key={idx} items={items} />
          })
        }
        {
          data?.leaveRequests?.map((items, idx) => {
            console.log(`🚀 ~ items:`, dayjs(items.end).diff(dayjs(items.start)));
            return <LeaveRejectmodal key={idx} items={items} />
          })
        }
      </div>
    </>
  );
};

export default AccountantNotification;
