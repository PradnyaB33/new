import { CalendarMonth } from "@mui/icons-material";
import WestIcon from "@mui/icons-material/West";
import { Badge, Button, Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import "tailwindcss/tailwind.css";
// import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AppDatePicker from "../../../components/date-picker/date-picker";
import UserProfile from "../../../hooks/auth/useUser";
import ShiftTable from "./components/ShiftsTable";
import Mapped from "./components/mapped-form";

// Set up the localizer for moment.js

const ShiftManagement = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  // const { handleAlert } = useContext(TestContext);
  const { shifts, setShifts } = useState([]);
  // const [subtractedLeaves, setSubtractedLeaves] = useState([]);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [appliedLeaveEvents, setAppliedLeaveEvents] = useState([]);
  const [newAppliedLeaveEvents, setNewAppliedLeaveEvents] = useState([]);
  // const queryclient = useQueryClient();
  const { isLoading } = useQuery(
    // "employee-leave-table-without-default",
    "shift-management",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${user.organizationId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      // Below is to get shifts selected
      // setAppliedLeaveEvents([...response.data.currentYearLeaves]);
      // This is to get all shifts
      setShifts(response.data.shifts);
      console.log("THis is complete", response.data);
      return response.data;
      //
      // Below are taken leaves
      // setAppliedLeaveEvents([...response.data.currentYearLeaves]);
      // Below are all leaves
      // setSubtractedLeaves(response.data.LeaveTypedEdited);
    }
  );

  // no need to create new shift here
  // const createLeaves = async () => {
  //   newAppliedLeaveEvents.forEach(async (value) => {
  //     try {
  //       await axios.post(
  //         `${process.env.REACT_APP_API}/route/leave/create`,
  //         value,
  //         {
  //           headers: {
  //             Authorization: authToken,
  //           },
  //         }
  //       );
  //     } catch (error) {
  //       console.error(`🚀 ~ error:`, error);
  //       handleAlert(
  //         true,
  //         "error",
  //         error?.response?.data?.message || "Leaves not created succcesfully"
  //       );
  //     }
  //   });
  // };
  // const leaveMutation = useMutation(createLeaves, {
  //   onSuccess: () => {
  //     console.log("success");

  //     queryclient.invalidateQueries("employee-leave-table");
  //     queryclient.invalidateQueries("employee-leave-table");
  //     queryclient.invalidateQueries("employee-summary-table");
  //     queryclient.invalidateQueries("employee-leave-table-without-default");
  //     setNewAppliedLeaveEvents([]);
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //   },
  // });
  const handleInputChange = () => {
    setCalendarOpen(true);
    setSelectedLeave(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCalendarOpen(false);

    setCalendarOpen(false);
    setAnchorEl("");

    // leaveMutation.mutate();
  };

  return (
    <>
      <section className="">
        <header className="text-xl pt-6 bg-gray-50 shadow-md font-semibold p-4">
          <Link to={"/"}>
            <WestIcon className="mx-4 !text-xl" />
          </Link>
          Shift Management
        </header>

        <div className="flex flex-col-reverse md:flex-row w-full justify-start p-6 gap-4">
          <div className="flex flex-col gap-4">
            <ShiftTable />
          </div>

          <article className="md:w-[100%] space-y-2">
            {isLoading ? (
              <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg">
                <div className="flex items-center gap-8 px-2">
                  <Badge
                    badgeContent={"loading"}
                    color="primary"
                    variant="standard"
                  >
                    <Button
                      disabled
                      variant="contained"
                      size="large"
                      className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
                      color="info"
                    >
                      <CalendarMonth className="!text-4xl text-gr" />
                    </Button>
                  </Badge>
                  <div>
                    <Skeleton variant="text" width={160} height={20} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg ">
                <div className="flex items-center gap-8 px-2">
                  <Badge badgeContent={"Click"} color="primary">
                    <Button
                      disabled={isLoading}
                      onClick={handleInputChange}
                      variant="contained"
                      size="large"
                      className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
                      color="info"
                    >
                      <CalendarMonth className=" !text-4xl" />
                    </Button>
                  </Badge>
                  <p className="!text-gray-400 font-semibold mb-2 text-xl">
                    Set Shifts for days
                  </p>
                </div>
              </div>
            )}

            <AppDatePicker
              isCalendarOpen={isCalendarOpen}
              setCalendarOpen={setCalendarOpen}
              anchorEl={anchorEl}
              appliedLeaveEvents={appliedLeaveEvents}
              setAppliedLeaveEvents={setAppliedLeaveEvents}
              setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
              newAppliedLeaveEvents={newAppliedLeaveEvents}
              selectedLeave={selectedLeave}
              setSelectedLeave={setSelectedLeave}
            />

            {newAppliedLeaveEvents?.length > 0 &&
            Array.isArray(newAppliedLeaveEvents) ? (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="h-max !mt-4 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
                >
                  <h1 className="text-gray-400 font-semibold mb-4 text-md">
                    Selected Leave's
                  </h1>
                  <div className="flex flex-col gap-4">
                    {shifts?.map((item, index) => (
                      <Mapped
                        key={index}
                        setCalendarOpen={setCalendarOpen}
                        shifts={shifts}
                        item={item}
                        index={index}
                        // newAppliedLeaveEvents={newAppliedLeaveEvents}
                        // setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                      />
                    ))}
                    <div className="w-full m-auto flex justify-center my-4">
                      <Button
                        type="submit"
                        variant="contained"
                        className="font-bold m-auto w-fit"
                      >
                        Apply for Shifts allowance
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="w-full h-max grid justify-center relative gap-4 !mt-4 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg">
                  <Button
                    disabled={isLoading}
                    onClick={() => setCalendarOpen(true)}
                    variant="text"
                    size="large"
                    className="text-center !italic w-fit !m-auto"
                  >
                    {" "}
                    {!isLoading
                      ? "Apply for Shifts allowance"
                      : "Wait Calendar is Loading"}
                  </Button>
                </div>
              </>
            )}
          </article>
        </div>
      </section>
    </>
  );
};

export default ShiftManagement;
