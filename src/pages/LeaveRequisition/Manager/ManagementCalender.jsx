import { West } from "@mui/icons-material";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Link } from "react-router-dom";

const ManagementCalender = () => {
  const localizer = momentLocalizer(moment);

  return (
    <div>
      <header className="text-xl w-full pt-6 bg-white border-b   p-4">
        <Link to={-1}>
          <West className="mx-4 !text-xl" />
        </Link>
        Performance Management
      </header>

      <section className="w-full flex">
        <div className="w-[40%]"></div>
        <div className="w-[60%] p-4 border flex items-center ">
          <Calendar
            localizer={localizer}
            views={["month"]}
            // components={{
            //   toolbar: CustomToolbar,
            // }}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "75vh",
              width: "100%",
              background: "#fff",
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default ManagementCalender;
