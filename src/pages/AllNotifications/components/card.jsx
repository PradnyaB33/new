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
          className="bg-white flex justify-between items-center shadow-md sm:w-[20vw] sm:h-[10vh] p-2 m-6 rounded-lg"
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
