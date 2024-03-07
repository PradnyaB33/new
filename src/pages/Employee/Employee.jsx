import React from "react";
import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import EmployeeList from "./EmployeeList";
import EmpUnderMgr from "./EmpUnderMgr";
const Employee = () => {
  const { organisationId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = user.profile;

  // Determine which component to render based on the role
  const renderEmployeeComponent = () => {
    if (role.includes("Super-Admin") || role.includes("HR")) {
      return <EmployeeList organisationId={organisationId} />;
    } else if (role.includes("Manager")) {
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
