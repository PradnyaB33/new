import React from "react";
import ShiftRejectModel from "../../components/Modal/ShiftRequestModal/ShiftRejectModel";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";

const PunchNotification = () => {
  const { data } = useShiftNotification();
  return (
    <div>
      {data?.map((items, idx) => {
        return <ShiftRejectModel key={idx} items={items} />;
      })}
    </div>
  );
};

export default PunchNotification;
