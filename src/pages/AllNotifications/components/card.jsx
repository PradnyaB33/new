// import { TrendingUp } from "@mui/icons-material";
// import {
//   default as AccessTimeIcon,
//   default as ShiftIcon,
// } from "@mui/icons-material/AccessTime";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import RemoteIcon from "@mui/icons-material/Computer";
// import FolderIcon from "@mui/icons-material/Folder";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import NotificationIcon from "@mui/icons-material/NotificationImportant";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import React from "react";
// import { Link } from "react-router-dom";
// import UserProfile from "../../../hooks/UserData/useUser";
// const Card = ({ card = false }) => {
//   const { useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();

//   const icons = [
//     NotificationIcon,
//     ShiftIcon,
//     RemoteIcon,
//     TrendingUp,
//     FolderIcon,
//     AttachMoneyIcon,
//     AccessTimeIcon,
//     AttachMoneyIcon,
//     AccessTimeIcon,
//     ReceiptIcon,
//     InsertDriveFileIcon,
//     InsertDriveFileIcon,
//     InsertDriveFileIcon,
//     InsertDriveFileIcon,
//     InsertDriveFileIcon,
//   ];

//   return (
//     <>
//       {card.map((item, index) => (
//         <Link to={role === "Employee" ? item?.url2 : item?.url} key={index}>
//           <div
//             key={index}
//             className="cursor-pointer hover:shadow-2xl border-gray-200 border bg-white flex justify-between items-center shadow-lg sm:w-[300px] sm:pl-3 sm:pr-3 sm:h-[100px] h-[80px] w-full p-2 sm:m-6 gap-0 rounded-lg"
//           >
//             <div>
//               <h1>{item.name}</h1>
//               <p>Notification count : {item.count}</p>
//             </div>

//             <div
//               className="w-[40px] h-[40px] p-4 flex items-center justify-center rounded-lg"
//               style={{ backgroundColor: item.color }}
//             >
//               {React.createElement(icons[index], {
//                 className: "!text-white",
//               })}
//             </div>
//           </div>
//         </Link>
//       ))}
//     </>
//   );
// };

// export default Card;

import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import UserProfile from "../../../hooks/UserData/useUser";

// TabPanel component for displaying content
const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const Card = ({ card = [] }) => {
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [selectedTab, setSelectedTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };



  return (
    <div>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="card tabs"
      >
        {card.map((item, index) => (
          <Tab
            key={index}
            label={

              <span style={{ display: "flex", alignItems: "center" }}>
                {item.name}
                <div
                  style={{
                    padding: "2px 8px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "50%",
                    marginLeft: "8px",
                    color: "black",
                  }}
                >
                  {item.count}
                </div>
              </span>
            }
            id={`simple-tab-${index}`}
            aria-controls={`simple-tabpanel-${index}`}
          />

        ))}
      </Tabs>

      {card.map((item, index) => (
        <TabPanel value={selectedTab} index={index} key={index}>
          {role === "Employee" ? item?.empPage : item?.page}
        </TabPanel>
      ))}
    </div>
  );
};

export default Card;
