import React from "react";
import PunchAcceptModal from "../../components/Modal/RemotePunchingModal/PunchAcceptModal";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";

const PunchNotification = () => {
  const { data } = usePunchNotification();
  console.log(`🚀 ~ file: page.jsx:7 ~ data:`, data);
  return (
    <div>
      {data?.map((items, idx) => (
        <PunchAcceptModal items={items} length={data?.length} key={idx} />
      ))}
    </div>
  );
};

export default PunchNotification;
