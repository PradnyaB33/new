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
  const [syncOption, setSyncOption] = useState("file");

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
      <Typography variant="h5" className="mb-4" style={{ padding: "10px 0" }}>
        Do you want to sync the data via:
      </Typography>
      <div className="mb-6" style={{ display: "flex", gap: "16px" }}>
        <Button
          variant={syncOption === "file" ? "contained" : "outlined"}
          onClick={() => handleSyncOptionChange("file")}
        >
          Upload File
        </Button>
        <Button
          variant={syncOption === "dynamic" ? "contained" : "outlined"}
          onClick={() => handleSyncOptionChange("dynamic")}
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
