import React from "react";
import Card from "./components/card";
const ParentNotification = () => {
  const dummyData = [
    {
      name: "Leave Notification",
      count: 4,
      color: "#FF7373",
    },
    {
      name: "Shift Notification",
      count: 4,
      color: "#3668ff",
    },
    {
      name: "Remote Punching Notification",
      count: 4,
      color: "#51FD96",
    },
    {
      name: "Department Notification",
      count: 2,
      color: "#51E8FD",
    },
  ];
  return (
    <div className="w-full h-screen flex p-4">
      <Card card={dummyData} />
    </div>
  );
};

export default ParentNotification;
