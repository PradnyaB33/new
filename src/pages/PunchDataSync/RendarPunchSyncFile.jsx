// import { Container } from "@mui/material";
// import React, { useContext } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "react-query";
// import axios from "axios";
// import EmpInfoByDynimacally from "./EmpInfoByDynanimacally";
// import EmpInfoPunchStatus from "./EmpInfoPunchStatus";
// import { UseContext } from "../../State/UseState/UseContext";

// const RenderPunchSyncFile = () => {
//   const { organisationId } = useParams();
//   // Get cookies
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   // Get punching data by org
//   const { data: tempPunchData } = useQuery(
//     ["tempPunchData", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-temp-punching-data`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: !!organisationId && !!authToken,
//     }
//   );

//   console.log("tempPunchData", tempPunchData);

//   // Determine which component to render based on the role
//   const renderPunchSyncComponent = () => {
//     if (!tempPunchData || tempPunchData.length === 0) {
//       return <EmpInfoPunchStatus organisationId={organisationId} />;
//     } else {
//       return <EmpInfoByDynimacally organisationId={organisationId} />;
//     }
//   };

//   return (
//     <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
//       {renderPunchSyncComponent()}
//     </Container>
//   );
// };

// export default RenderPunchSyncFile;
import React, { useContext, useState } from "react";
import { Container, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import EmpInfoByDynimacally from "./EmpInfoByDynanimacally";
import EmpInfoPunchStatus from "./EmpInfoPunchStatus";
import { UseContext } from "../../State/UseState/UseContext";

const RenderPunchSyncFile = () => {
  const { organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [syncOption, setSyncOption] = useState("file"); // Default is "file"

  // Get punching data by org
  const { data: tempPunchData } = useQuery(
    ["tempPunchData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-temp-punching-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  console.log("tempPunchData", tempPunchData);

  // Handler for changing sync option
  const handleSyncOptionChange = (option) => {
    setSyncOption(option);
  };

  return (
    <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
      <Typography variant="h5" className="mb-4">
        Do you want to sync the data via:
      </Typography>
      <div className="mb-6">
        <Button
          variant={syncOption === "file" ? "contained" : "outlined"}
          onClick={() => handleSyncOptionChange("file")}
        >
          Upload File
        </Button>
        <Button
          variant={syncOption === "dynamic" ? "contained" : "outlined"}
          onClick={() => handleSyncOptionChange("dynamic")}
          className="ml-4"
        >
          Dynamically Display
        </Button>
      </div>

      {syncOption === "file" ? (
        <EmpInfoPunchStatus organisationId={organisationId} />
      ) : (
        <EmpInfoByDynimacally organisationId={organisationId} />
      )}
    </Container>
  );
};

export default RenderPunchSyncFile;
