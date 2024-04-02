import React from "react";
import useTrainingStore from "../zustand-store";
import Departmental from "./components/departmental-form";
import Individual from "./components/individual-form";
import Organizational from "./components/organisational-form";

const Step2 = () => {
  const { trainingType } = useTrainingStore();
  if (trainingType === "Individual") {
    return <Individual />;
  }
  if (trainingType === "Organizational") {
    return <Organizational />;
  }
  if (trainingType === "Departmental") {
    return <Departmental />;
  }

  return <div>Please Select Training Type</div>;
};

export default Step2;
