import React from "react";
import { Container } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Alert from "@mui/material/Alert";
import useForm16NotificationHook from "../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";

const Form16Notification = () => {
  const { Form16Notification } = useForm16NotificationHook();
  const hasForm16File =
    Form16Notification &&
    Form16Notification.length > 0 &&
    Form16Notification[0].form16_file;

  return (
    <>
      <div style={{ marginTop: "5%" }}>
        <Container maxWidth="xl" className="bg-gray-50 min-h-screen mt-4">
          <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3">
                <div className="mt-1">
                  <CircleNotificationsIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Notification</h1>
                  <p className="text-xs text-gray-600">
                    Here you can see your notification.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
              {hasForm16File ? (
                <Alert severity="success">
                  Form 16 is uploaded for {Form16Notification[0].year} year.
                </Alert>
              ) : (
                <Alert severity="error">Form 16 is not uploaded yet.</Alert>
              )}
            </div>
          </article>
        </Container>
      </div>
    </>
  );
};

export default Form16Notification;
