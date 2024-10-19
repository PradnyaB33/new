import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import CAppDatePicker from "../../components/date-picker/Cdate-picker";
import ReusableModal from "../../components/Modal/component";
import useLeaveData from "../../hooks/Leave/useLeaveData";
import UserProfile from "../../hooks/UserData/useUser";
import { UseContext } from "../../State/UseState/UseContext";
import LeaveTable from "./components/LeaveTabel";
import Mapped from "./components/mapped-form";

const LeaveRequisition = () => {
  const {
    data,
    shiftData,
    setCalendarOpen,
    isLoading,
    handleSubmit,
    handleInputChange,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    isCalendarOpen,
    handleUpdateFunction,
    selectEvent,
    setSelectedLeave,
    selectedLeave,
    setselectEvent,
    deleteLeaveMutation,
    calLoader,
    setCalLoader,
  } = useLeaveData();

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();

  const user = UserProfile().getCurrentUser();
  console.log("Thsii is user", user);

  // Fetch department data
  const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
    ["machinePunching", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/availableRecords`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data[0].availableRecords;
    }
  );

  // Manage loading state for selected dates
  const [isDataLoading, setIsDataLoading] = useState(true);
  console.log(isDataLoading);

  // Manage visibility of CAppDatePicker
  const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);
  // Update loading state when data is ready
  useEffect(() => {
    if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
      setIsDataLoading(false);
    }
  }, [newAppliedLeaveEvents, isMachineLoading]);

  useEffect(() => {
    if (
      newAppliedLeaveEvents.length <= 0 &&
      Array.isArray(newAppliedLeaveEvents)
    ) {
      setIsCAppDatePickerVisible(true);
    }
  }, [newAppliedLeaveEvents]);

  return (
    <div
      className="!bg-[#F9FAFC]"
      style={{ height: "90vh", overflowY: "auto", bgcolor: "#F9FAFC" }}
    >
      {/* <div className="!bg-[#F9FAFC]" style={{ bgcolor: "#F9FAFC !important" }}>
        <HeadingOneLineInfo
          className={"!bg-[#F9FAFC] p-4 pt-8 pb-4 !m-0"}
          heading={"Attendance & Leave Management"}
          info={
            "Track your attendance and submit your leave requests here for timely approval and efficient management"
          }
        />
      </div> */}
      <div className="flex  flex-col lg:flex-row  ">
        {/* Left side - Leave Table */}
        <div className="flex   border-r  flex-col  lg:w-[25%] ">
          <div className=" h-full  ">
            <LeaveTable />
          </div>
        </div>

        {/* Right side - Date Picker & Selected Dates */}
        <div className="flex flex-col  lg:w-[75%]   ">
          {/* Render Date Picker */}
          {/* {isCAppDatePickerVisible ? ( */}
          <CAppDatePicker
            data={data}
            shiftData={shiftData}
            machinePunchingRecord={machinePunchingRecord}
            handleUpdateFunction={handleUpdateFunction}
            selectEvent={selectEvent}
            setselectEvent={setselectEvent}
            setCalendarOpen={setCalendarOpen}
            setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
            selectedLeave={selectedLeave}
            setSelectedLeave={setSelectedLeave}
            newAppliedLeaveEvents={newAppliedLeaveEvents}
            isCalendarOpen={isCalendarOpen}
            deleteLeaveMutation={deleteLeaveMutation}
            calLoader={calLoader}
            setCalLoader={setCalLoader}
            setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
          />
        </div>
      </div>

      <ReusableModal
        heading={"Apply Leave"}
        open={!isCAppDatePickerVisible}
        onClose={() => setIsCAppDatePickerVisible(true)}
      >
        <>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {newAppliedLeaveEvents.map((item, index) => (
                <Mapped
                  key={index}
                  setCalendarOpen={setCalendarOpen}
                  subtractedLeaves={data?.LeaveTypedEdited}
                  item={item}
                  index={index}
                  newAppliedLeaveEvents={newAppliedLeaveEvents}
                  setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                />
              ))}
              <div className="w-full flex justify-center my-1">
                <Button type="submit" variant="contained" className="font-bold">
                  Apply
                </Button>
              </div>
            </div>
          </form>

          <AppDatePicker
            data={data}
            shiftData={shiftData}
            machinePunchingRecord={machinePunchingRecord}
            handleUpdateFunction={handleUpdateFunction}
            selectEvent={selectEvent}
            setselectEvent={setselectEvent}
            setCalendarOpen={setCalendarOpen}
            setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
            selectedLeave={selectedLeave}
            setSelectedLeave={setSelectedLeave}
            newAppliedLeaveEvents={newAppliedLeaveEvents}
            isCalendarOpen={isCalendarOpen}
            deleteLeaveMutation={deleteLeaveMutation}
            calLoader={calLoader}
            setCalLoader={setCalLoader}
          />
        </>
      </ReusableModal>
    </div>
  );
};

export default LeaveRequisition;
