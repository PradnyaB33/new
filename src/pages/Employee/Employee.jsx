import React from "react";
import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import EmployeeList from "./EmployeeList";
import EmpUnderMgr from "./EmpUnderMgr";
const Employee = () => {
  const { organisationId } = useParams();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  // Determine which component to render based on the role
  const renderEmployeeComponent = () => {
    if (role === "Super-Admin" || role === "HR") {
      return <EmployeeList organisationId={organisationId} />;
    } else if (role === "Manager") {
      return <EmpUnderMgr organisationId={organisationId} />;
    }

    return null;
  };

  return (
    <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
      {renderEmployeeComponent()}
    </Container>
  );
};

export default Employee;
