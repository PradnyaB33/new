import ShiftIcon from "@mui/icons-material/AccessTime";
import DepartmentIcon from "@mui/icons-material/AccountTree";
import RemoteIcon from "@mui/icons-material/Computer";
import NotificationIcon from "@mui/icons-material/NotificationImportant";
import React from "react";

const Card = ({ card }) => {
  const icons = [NotificationIcon, ShiftIcon, RemoteIcon, DepartmentIcon];

  return (
    <>
      {card.map((item, index) => (
        <div
          key={index}
          className="bg-white flex justify-between items-center shadow-lg sm:w-[300px] sm:pl-3 sm:pr-3 sm:h-[100px] h-[80px] w-[100%] p-2 sm:m-6 gap-0 rounded-lg"
        >
          <div>
            <h1>{item.name}</h1>
            <p>Notification count : {item.count}</p>
          </div>

          <div
            className="w-[40px] h-[40px] p-4 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: item.color }}
          >
            {React.createElement(icons[index], {
              className: "!text-white",
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;
