import { Container } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import EmpUnderMgr from "./EmpUnderMgr";
import EmployeeList from "./EmployeeList";
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
