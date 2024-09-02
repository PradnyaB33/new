import { Person, West } from "@mui/icons-material";
import moment from "moment";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { CustomOption } from "../../../components/InputFileds/AuthInputFiled";
import useManagerCalender from "./useManagerCalender";

const ManagementCalender = () => {
  const localizer = momentLocalizer(moment);
  const { organisationId } = useParams("");
  const [employee, setEmployee] = useState("");
  console.log(`🚀 ~ employee:`, employee);

  const { EmployeeLeaves, leaveTableData, employeeData, employeeLoading } =
    useManagerCalender({ employee, organisationId });

  return (
    <div>
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee Attendance
      </header>

      {/* Top Bar */}

      <section className="p-4 px-8 bg-gray-50 min-h-[80vh] ">
        <div>
          <h1 className="text-2xl text-gray-700   font-semibold  tracking-tight">
            View Employee Attendence
          </h1>
          <p className="text-gray-500 text-sm tracking-tight ">
            Here you can view your employee attendance
          </p>
        </div>

        <div className="my-4 w-[30%]">
          <div className={`space-y-1 min-w-[15vw] `}>
            <label className={` font-semibold text-gray-500 text-lg`}>
              Select Employee
            </label>
            <div
              className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px] items-center`}
            >
              <Person className="text-gray-700 md:text-lg !text-[1em]" />
              <Select
                aria-errormessage=""
                placeholder={"Assignee"}
                isClearable
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderWidth: "0px",
                    boxShadow: "none",
                  }),
                }}
                className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                components={{
                  Option: CustomOption,
                  IndicatorSeparator: () => null,
                }}
                options={employeeData?.map((emp) => ({
                  value: emp._id,
                  label: `${emp.first_name} ${emp.last_name}`,
                  image: emp.user_logo_url,
                }))}
                onChange={(value) => {
                  setEmployee(value?.value);
                }}
              />
            </div>
          </div>
        </div>

        {
          //   employeeLoading ? (
          //   <div className="h-[60vh] flex items-center justify-center">
          //     <CircularProgress />
          //   </div>
          // ) :
          employeeLoading ||
          // EmployeeLeaves?.currentYearLeaves?.length <= 0 ||
          !EmployeeLeaves ? (
            <div className="flex items-center flex-col gap-2 justify-center">
              <img src="/calender.svg" className="h-[200px]" alt="none" />
              <div>
                <h1 className="text-4xl text-gray-700   font-semibold  tracking-tight">
                  {employeeLoading
                    ? "Loading..."
                    : !employee
                    ? "Select Employee!"
                    : "No Data Found"}
                </h1>
                <h1 className="text-sm text-gray-700   font-semibold  tracking-tight">
                  {employeeLoading
                    ? ""
                    : !employee
                    ? "Please Select Employee to view the data"
                    : "No data found for this selected employee about attendance"}
                </h1>
              </div>
            </div>
          ) : (
            <section className="w-full flex gap-4 ">
              <div className="w-[30%] bg-white h-max rounded-md border ">
                <header className="bg-gray-200">
                  <h1 className="text-xl  text-gray-700  border-b-2 p-4  font-semibold  tracking-tight">
                    Balance Leaves
                  </h1>
                </header>

                {leaveTableData?.leaveTypes?.map((item, id) => (
                  <div key={id} className="border-b p-4  ">
                    <div className="flex items-center gap-2">
                      <div
                        style={{ background: item.color }}
                        className={`h-3 w-3 rounded-full `}
                      />
                      <div>
                        <h1 className="text-lg text-gray-700   tracking-tight">
                          {item?.leaveName}
                        </h1>
                        <h1 className="text-xl">{item?.count}</h1>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-b p-4  ">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl text-gray-700 font-semibold  tracking-tight">
                      Total
                    </h1>
                    <h1 className="text-xl text-gray-700 font-semibold   tracking-tight">
                      {leaveTableData?.totalCoutn}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="manager-cal w-[70%] p-4 bg-white rounded-md border flex items-center justify-center ">
                <Calendar
                  localizer={localizer}
                  eventPropGetter={(event) => {
                    let backgroundColor = "blue";

                    if (event?.status) {
                      switch (event.status) {
                        case "Pending":
                          backgroundColor = "orange";
                          break;
                        case "Rejected":
                          backgroundColor = "red";
                          break;
                        case "Approved":
                          backgroundColor = "green";
                          break;
                        default:
                          backgroundColor = "blue";
                          break;
                      }
                    }
                    if (event.color) {
                      backgroundColor = event.color;
                    }

                    return {
                      style: {
                        backgroundColor,
                      },
                    };
                  }}
                  views={["month"]}
                  // components={{
                  //   toolbar: CustomToolbar,
                  // }}
                  events={EmployeeLeaves?.currentYearLeaves}
                  startAccessor="start"
                  endAccessor="end"
                  style={{
                    height: "75vh",
                    width: "100%",
                    border: "none",
                    background: "#fff",
                  }}
                />
              </div>
            </section>
          )
        }
      </section>
    </div>
  );
};

export default ManagementCalender;
