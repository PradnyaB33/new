import moment from "moment";
import { useContext } from "react";
import { TestContext } from "../../../State/Function/Main";

const useLeaveRequisitionMutation = () => {
  const { handleAlert } = useContext(TestContext);
  function calculateDays(startDateString, endDateString) {
    // Parse the start and end dates using Moment.js
    var startDate = moment(startDateString, "YYYY-MM-DD");
    var endDate = moment(endDateString, "YYYY-MM-DD");

    // Calculate the difference in days
    var daysDifference = endDate.diff(startDate, "days");

    return daysDifference;
  }
  async function checkLeaveProblem(
    dataArray = [],
    id = "",
    item,
    newLeaveArray = []
  ) {
    let maxCount = 0;
    let newLeaveCount = 0;
    const doc = dataArray.filter(async (doc) => {
      return doc._id === id;
    });
    console.log(`🚀 ~ file: mutaion.jsx:26 ~ doc:`, doc.length);
    if (doc.length > 0) {
      maxCount = doc[0].count;
      console.log(`🚀 ~ file: mutaion.jsx:25 ~ maxCount:`, maxCount);
    }
    console.log(`🚀 ~ file: mutaion.jsx:18 ~ doc[0].count:`, doc[0].count);
    const newArray = await newLeaveArray.map(
      (value) => value.leaveTypeDetailsId === id
    );
    newArray.forEach((value) => {
      newLeaveCount += calculateDays(value.start, value?.end);
      console.log(`🚀 ~ file: mutaion.jsx:32 ~ newLeaveCount:`, newLeaveCount);
      return null;
    });
    if (maxCount >= newLeaveCount + item?.count) {
      handleAlert(true, "error ", "You don't have balance for it so check ");
      return true;
    }
    return false;
  }
  return { calculateDays, checkLeaveProblem };
};

export default useLeaveRequisitionMutation;
