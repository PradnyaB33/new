import { format } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import Card from "../components/Card";
import EmpGraph from "../components/Dashboard/EmpGraph";
import Message from "../components/Message";

const PerformanceDashboard = () => {
  const user = UserProfile().getCurrentUser();
  const role = UserProfile().useGetCurrentRole();
  const authToken = useAuthToken();
  const {
    fetchPerformanceSetup,
    getPerformanceDashboardTable,
    getEmployeePerformance,
  } = usePerformanceApi();
  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  const { data: tableData } = useQuery(["dashboardTable"], () =>
    getPerformanceDashboardTable({ role, authToken })
  );
  console.log(`🚀 ~ tableData:`, tableData);
  const { data: selfGoals } = useQuery(["selfData"], () =>
    getEmployeePerformance({ id: user._id, authToken })
  );

  // const selfData = selfGoals?.goals?.forEach((goal) => {
  //   // let completed = goal?.filter((goal) => goal.goalStatus === "Completed");
  //   console.log(`🚀 ~ goal:`, goal);
  //   // return completed;
  // });

  const statusCounts = selfGoals?.goals?.reduce((acc, goal) => {
    const { goalStatus, endDate } = goal;
    const today = new Date();
    const goalEndDate = new Date(endDate);

    // Check if the goal is overdue and increment 'Overdue' count accordingly
    if (goalEndDate < today) {
      acc["Overdue"] = (acc["Overdue"] || 0) + 1;
    } else {
      // Increment count for the existing status
      if (acc[goalStatus]) {
        acc[goalStatus] += 1;
      } else {
        acc[goalStatus] = 1; // Initialize count for new status
      }
    }

    return acc;
  }, {}); // Initial accumulator is an empty object

  return (
    <div
    // className="px-8 "
    >
      {/* <div className="flex items-center justify-between ">
        <div className="w-full py-4  ">
          <h1 className="text-2xl ">Performance Dashboard</h1>
          <p>Manage and organize goals setting</p>
        </div>
      </div> */}

      <div class="flex items-center justify-between ">
        <div class="space-y-1">
          <h2 class="text-2xl tracking-tight">Dashboard</h2>
          <p class="text-sm text-muted-foreground">
            Top picks for you. Updated daily.
          </p>
        </div>
      </div>

      <Message />

      <div className="flex flex-wrap gap-4">
        <Card
          title={"Total Goals"}
          data={`${statusCounts?.Completed ?? 0} / ${
            selfGoals?.goals?.length
          } completed`}
        />
        <Card title={"In Due"} data={statusCounts?.Overdue ?? 0} />
        <Card title={"Current Stage"} data={performance?.stages} />
        <Card
          title={"Timeline"}
          data={`${
            performance?.startdate &&
            format(new Date(performance?.startdate), "PP")
          } - 
                ${
                  performance?.enddate &&
                  format(new Date(performance?.enddate), "PP")
                }`}
        />
      </div>

      <aside className="flex my-4 ">
        <div className="w-[35%] rounded-sm p-4">
          <h1 className="text-lg  font-bold text-[#67748E]">Goals chart</h1>
          <EmpGraph goalsData={statusCounts} />
        </div>
      </aside>

      {/* <PerformanceTable
        tableData={tableData}
        isLoading={isFetching}
        performance={performance}
      /> */}
    </div>
  );
};

export default PerformanceDashboard;
