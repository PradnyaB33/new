import { format } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import Card from "../components/Card";
import PerformanceTable from "../components/Dashboard/PerformanceTable";

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

  return (
    <div className="px-8 ">
      <div className="flex items-center justify-between ">
        <div className="w-full py-4  ">
          <h1 className="text-2xl ">Performance Dashboard</h1>
          <p>Manage and organize goals setting</p>
        </div>
      </div>

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

      <PerformanceTable
        tableData={tableData?.result}
        performance={performance}
      />
    </div>
  );
};

export default PerformanceDashboard;
