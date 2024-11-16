import React, { useContext, useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
import axios from "axios";
import moment from "moment";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import BasicButton from "../../components/BasicButton";
import CAppDatePicker from "../../components/date-picker/Cdate-picker";
import ReusableModal from "../../components/Modal/component";
import useLeaveData from "../../hooks/Leave/useLeaveData";
import useLeaveTable from "../../hooks/Leave/useLeaveTable";
import { UseContext } from "../../State/UseState/UseContext";
import LeaveTable from "./components/LeaveTabel";
import Mapped from "./components/mapped-form";

const LeaveRequisition = () => {
  const {
    data,
    shiftData,
    setCalendarOpen,
    handleSubmit,
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

  const [isDataLoading, setIsDataLoading] = useState(true);
  console.log(`🚀 ~ isDataLoading:`, isDataLoading);
  const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const { data: leaves, isLoading } = useLeaveTable(
    selectedMonth,
    selectedYear
  );

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
    //eslint-disable-next-line
  }, [newAppliedLeaveEvents]);

  return (
    <div
      className="!bg-[#F9FAFC] min-h-[40vh] h-auto"
      style={{ overflowY: "auto", bgcolor: "#F9FAFC" }}
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
            <LeaveTable data={leaves} isLoading={isLoading} />
          </div>
        </div>

        <div className="flex flex-col  lg:w-[75%]   ">
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
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
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
              <div className="w-full gap-2 flex justify-end my-1">
                <BasicButton
                  title="Cancel"
                  variant="outlined"
                  onClick={() => setIsCAppDatePickerVisible(true)}
                  type="button"
                  color={"danger"}
                />
                <BasicButton title={"Apply"} onClick={() => {}} type="submit" />
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
