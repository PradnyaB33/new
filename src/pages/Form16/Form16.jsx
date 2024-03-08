import React from "react";
import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
import Form16Emp from "./Form16Emp";
import Form16Hr from "./Form16Hr";

const Form16 = () => {
  const { organisationId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = user.profile;

  const renderForm16Component = () => {
    if (role.includes("Super-Admin") || role.includes("HR")) {
      return <Form16Hr organisationId={organisationId} />;
    } else if (role.includes("Employee") || role.includes("HR")) {
      return <Form16Emp organisationId={organisationId} />;
    }

    return null;
  };
  return (
    <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
      {renderForm16Component()}
    </Container>
  );
};

export default Form16;
