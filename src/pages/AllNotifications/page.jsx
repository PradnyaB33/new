import React from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import Card from "./components/card";
import useNotification from "./components/useNotification";

const ParentNotification = () => {
  const { dummyData } = useNotification();
  const visibleData = dummyData.filter((item) => item.visible === true);

  return (
    <BoxComponent sx={{ p: "0 !important" }}>
      <Card card={visibleData} />
    </BoxComponent>
  );
};

export default ParentNotification;
