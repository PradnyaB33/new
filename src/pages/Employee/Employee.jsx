import { Container } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
const Employee = () => {
  const { organisationId } = useParams();
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  console.log("role", role);
  console.log("user", user.organizationId);

  // Determine which component to render based on the role
  const renderEmployeeComponent = () => {
    if (
      role === "Super-Admin" ||
      role === "Delegate-Super-Admin" ||
      role === "HR" ||
      role === "Department-Head" ||
      role === "Delegate-Department-Head"
    ) {
      return <EmployeeListToRole organisationId={organisationId} />;
    } else if (
      role === "Employee" ||
      role === "Department-Admin" ||
      role === "Delegate-Department-Admin" ||
      role === "Accountant" ||
      role === "Delegate-Accountant" ||
      role === "Manager"
    ) {
      return <EmployeeListToEmployee organisationId={user.organizationId} />;
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
