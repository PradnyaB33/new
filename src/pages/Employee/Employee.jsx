import { Container } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import EmployeeListToRole from "./EmployeeListToRole";

const Employee = () => {
  const { organisationId } = useParams();

  const renderEmployeeComponent = () => {
    return <EmployeeListToRole organisationId={organisationId} />;
  };

  return (
    <Container maxWidth="xl" className="bg-gray-50">
      {renderEmployeeComponent()}
    </Container>
  );
};

export default Employee;