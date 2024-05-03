import ShiftIcon from "@mui/icons-material/AccessTime";
import DepartmentIcon from "@mui/icons-material/AccountTree";
import RemoteIcon from "@mui/icons-material/Computer";
import FolderIcon from "@mui/icons-material/Folder";
import NotificationIcon from "@mui/icons-material/NotificationImportant";
import React from "react";
import { Link } from "react-router-dom";

const Card = ({ card, loading }) => {
  const icons = [
    NotificationIcon,
    ShiftIcon,
    RemoteIcon,
    DepartmentIcon,
    FolderIcon,
  ];

  const Skeleton = () => {
    return (
      <div className="border-gray-200 border bg-white flex justify-between items-center shadow-lg sm:w-[300px] sm:pl-3 sm:pr-3 sm:h-[100px] h-[80px] w-full p-2 sm:m-6 gap-0 rounded-lg animate-pulse">
        <div className="w-full">
          <div className="h-5 bg-gray-300 mb-2 rounded-md"></div>
          <div className="h-3 bg-gray-300 rounded-md"></div>
        </div>
        <div className="w-[40px] h-[40px] p-4 bg-gray-300 flex items-center justify-center rounded-lg"></div>
      </div>
    );
  };

  return (
    <>
      {loading
        ? Array.from({ length: card.length }).map((_, index) => (
            <Skeleton key={index} />
          ))
        : card.map((item, index) => (
            <Link to={item?.url} key={index}>
              <div
                key={index}
                className="cursor-pointer hover:shadow-2xl border-gray-200 border bg-white flex justify-between items-center shadow-lg sm:w-[300px] sm:pl-3 sm:pr-3 sm:h-[100px] h-[80px] w-full p-2 sm:m-6 gap-0 rounded-lg"
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
            </Link>
          ))}
    </>
  );
};

export default Card;
