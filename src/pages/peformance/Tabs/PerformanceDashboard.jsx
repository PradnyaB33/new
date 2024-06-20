import { format } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import Card from "../components/Card";
import Message from "../components/Message";

const PerformanceDashboard = () => {
  const user = UserProfile().getCurrentUser();
  const role = UserProfile().useGetCurrentRole();
  const authToken = useAuthToken();
  const { fetchPerformanceSetup, getPerformanceDashboardTable } =
    usePerformanceApi();
  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  const { data: tableData } = useQuery(["dashboardTable"], () =>
    getPerformanceDashboardTable({ role, authToken })
  );
  console.log(`🚀 ~ tableData:`, tableData, performance);

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
        <Card title={"Total Goals"} data={"10 / 13 completed"} />
        <Card title={"In Due"} data={10} />
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

      {/* <PerformanceTable
        tableData={tableData}
        isLoading={isFetching}
        performance={performance}
      /> */}
    </div>
  );
};

export default PerformanceDashboard;
