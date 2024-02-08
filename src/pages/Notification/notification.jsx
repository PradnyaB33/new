import { CalendarMonth, NotificationImportant } from "@mui/icons-material";
import { Badge, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import Error from "./Error";
import Loader from "./Loader";

const Notification = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [open, setOpen] = useState(false);
  console.log(`🚀 ~ file: notification.jsx:22 ~ open:`, open);
  const [id, setid] = useState("");
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
  const queryClient = useQueryClient();
  console.log(`🚀 ~ file: notification.jsx:26 ~ isLoading:`, isLoading);

  const { mutate: acceptLeaveMutation, isLoading: mutateLoading } = useMutation(
    ({ id }) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/leave/accept/${id}`,
        { message: "Your Request is successfully approved" },
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employee-leave");
      },
    }
  );

  const { mutate: rejectRequestMutation } = useMutation(
    ({ id }) => {
      setid(id);
      setOpen(true);
    },
    {
      onSuccess: () => {
        // No need to reload the whole window, just invalidate the relevant query
        queryClient.invalidateQueries("employee-leave");
      },
    }
  );
  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (mutateLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <>
      <Box
        className="py-2 space-y-5 h-max"
        sx={{
          flexGrow: 1,
          p: 5,
        }}
      >
        <LeaveRejectmodal id={id} open={open} handleClose={handleClose} />
      </Box>

      <>
        {data?.leaveRequests?.length === 0 ? (
          <div className="flex items-center gap-4  bg-sky-100 p-4 px-8 rounded-md shadow-lg">
            <NotificationImportant className="!text-4xl" />
            <h1 className="text-2xl font-semibold">No notification for you </h1>
          </div>
        ) : (
          ""
        )}
        {data?.leaveRequests?.map((items, id) => {
          console.log(`🚀 ~ items:`, dayjs(items.end).diff(dayjs(items.start)));
          return (
            <Grid
              key={id}
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
                      badgeContent={`${dayjs(items.end).diff(
                        dayjs(items.start),
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
                    <h1 className="text-xl px-4 md:!px-0 italic font-semibold ">
                      {items?.employeeId?.first_name} has raised a leave request
                      from {items.description} Leave from{" "}
                      {format(new Date(items.start), "PP")} to{" "}
                      {format(new Date(items.end), "PP")}
                    </h1>

                    <Chip
                      label={items?.description}
                      size="small"
                      sx={{
                        backgroundColor: items?.color,
                        color: "#ffffff",
                      }}
                    />

                    {items.status === "Pending" ? (
                      <Box sx={{ mt: 3, mb: 3 }}>
                        <Stack direction="row" spacing={3}>
                          <Button
                            variant="contained"
                            onClick={() =>
                              acceptLeaveMutation({ id: items._id })
                            }
                            // startIcon={<CheckIcon />}
                            sx={{
                              fontStyle: "italic",
                              fontSize: "12px",
                              padding: "5px 30px",
                              textTransform: "capitalize",
                              backgroundColor: "#42992D",
                              "&:hover": {
                                backgroundColor: "#42992D",
                              },
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() =>
                              rejectRequestMutation({ id: items._id })
                            }
                            variant="contained"
                            sx={{
                              fontStyle: "italic",
                              fontSize: "12px",
                              padding: "5px 30px",
                              textTransform: "capitalize",
                              backgroundColor: "#BB1F11",
                              "&:hover": {
                                backgroundColor: "#BB1F11",
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </Box>
                    ) : items.status === "Rejected" ? (
                      <Box>
                        <Chip label="Request rejected" color="error" />
                      </Box>
                    ) : (
                      <Box>
                        <Chip label="Request Approved" color="success" />
                      </Box>
                    )}
                  </div>
                </Box>
              </Grid>
              {/* <Grid item xs={4}>
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      marginTop={5}
                    >
                      <img
                        src="argan_founder.png"
                        alt="my-img"
                        className="border-2 border-gray-400"
                        style={{
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                        }}
                      />
                    </Box>
                  </Box>
                </Grid> */}
            </Grid>
          );
        })}
      </>
    </>
  );
};

export default Notification;
