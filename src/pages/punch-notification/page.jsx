import React from "react";
import PunchingRejectModal from "../../components/Modal/RemotePunchingModal/PunchingRejectModal";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";

const PunchNotification = () => {
  const { data } = usePunchNotification();
  console.log(`🚀 ~ file: page.jsx:7 ~ data:`, data);
  return (
    <div>
      {data?.map((items, idx) => (
        <PunchingRejectModal items={items} length={data?.length} key={idx} />
      ))}
    </div>
  );
};

export default PunchNotification;
