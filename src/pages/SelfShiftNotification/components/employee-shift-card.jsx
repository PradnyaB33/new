import { CalendarMonth } from "@mui/icons-material";
import { Badge, Box, Button, Grid } from "@mui/material";
import { differenceInDays, format, parseISO } from "date-fns";
import dayjs from "dayjs";
import moment from "moment";
import React from "react";

const ShiftRequestCard = ({ items }) => {
  return (
    <Box
      className="py-2 space-y-5 h-max"
      sx={{
        flexGrow: 1,
      }}
    >
      <Grid
        container
        spacing={2}
        className="bg-white w-full"
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Add a box shadow on hover
          borderRadius: "5px",
        }}
      >
        <Grid item className="gap-1  py-4 w-full  h-max space-y-4">
          <Box className="flex md:flex-row items-center  justify-center flex-col gap-8  md:gap-16">
            <div className="w-max">
              <Badge
                className="!z-0"
                badgeContent={`${dayjs(items?.end).diff(
                  dayjs(items?.start) ?? "",
                  "day"
                )} days`}
                color="info"
                variant="standard"
              >
                <Button
                  variant="contained"
                  size="large"
                  className="!rounded-full !bg-gray-100  !h-16 !w-16 group-hover:!text-white !text-black"
                  color="info"
                >
                  <CalendarMonth className="!text-4xl text-gr" />
                </Button>
              </Badge>
            </div>

            <div className="space-y-4 w-full flex flex-col items-center md:items-start justify-center">
              {differenceInDays(
                parseISO(items?.end),
                parseISO(items?.start)
              ) !== 1 ? (
                <>
                  <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                    Your request for {items?.title} from{" "}
                    {moment(items?.start).format("DD-MM-YYYY") ?? ""} to{" "}
                    {moment(items?.end)
                      .subtract(1, "days")
                      .format("DD-MM-YYYY") ?? ""}
                    &nbsp; is {items?.status}.
                  </h1>
                  {items.messageA && (
                    <h1 className="text-gray-600">
                      Accountant Reason : {items?.messageA}
                    </h1>
                  )}
                  {items.messageM && (
                    <h1 className="text-gray-600">
                      Manager Reason : {items?.messageM}
                    </h1>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-xl px-4 md:!px-0 font-semibold ">
                    {" "}
                    Your request for {items?.title} on{" "}
                    {format(new Date(items?.start), "dd-MM-yyyy ")} is{" "}
                    {items?.status}.
                  </h1>
                  {items.messageA && (
                    <h1 className="text-gray-600">
                      Accountant Reason : {items?.messageA}
                    </h1>
                  )}
                  {items.messageM && (
                    <h1 className="text-gray-600">
                      Manager Reason : {items?.messageM}
                    </h1>
                  )}
                </>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShiftRequestCard;
