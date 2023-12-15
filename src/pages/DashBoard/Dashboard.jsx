import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { organisationId } = useParams();

  return <>Dashboard</>;
};

export default Dashboard;
