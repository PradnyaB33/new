import React from "react";
import Card from "./components/card";
import useNotification from "./components/useNotification";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const ParentNotification = () => {
  const { dummyData } = useNotification();
  const visibleData = dummyData.filter((item) => item.visible === true);

  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Notification"} />

      <Card card={visibleData} />

    </BoxComponent>
  );
};

export default ParentNotification;
