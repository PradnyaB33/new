import { format } from "date-fns";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import Card from "../components/Card";
import DashboardTable from "../components/Dashboard/DashboardTable";
import EmpGraph from "../components/Dashboard/EmpGraph";
import Message from "../components/Message";

const PerformanceDashboard = () => {
  const user = UserProfile().getCurrentUser();
  const role = UserProfile().useGetCurrentRole();
  const [employeeGoals, setEmployeeGoals] = useState();
  const { organisationId } = useParams();
  console.log(`🚀 ~ organisationId:`, organisationId);
  const authToken = useAuthToken();
  const {
    fetchPerformanceSetup,
    // getPerformanceDashboardTable,
    getEmployeePerformance,
    getPerformanceTable,
  } = usePerformanceApi();
  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  const { data: tableData, isFetching: tableFetching } = useQuery(
    {
      queryKey: ["performanceDashTable"],
      queryFn: () => getPerformanceTable({ authToken, role, organisationId }),
    },
    { enabled: role === "Manager" || role === "HR" }
  );

  const goalStatusCounts =
    role === "Employee"
      ? []
      : tableData?.reduce((acc, record) => {
          if (record.goals && record.goals.length) {
            record.goals.forEach((goal) => {
              const today = new Date();
              const endDate = new Date(goal.endDate);
              if (!acc["total"]) {
                acc["total"] = 0;
              }
              acc["total"]++;
              if (endDate < today) {
                // Count as overdue
                if (!acc["overdue"]) {
                  acc["overdue"] = 0;
                }
                acc["overdue"]++;
              } else {
                // Count as per goalStatus
                if (goal.goalStatus) {
                  if (!acc[goal.goalStatus]) {
                    acc[goal.goalStatus] = 0;
                  }
                  acc[goal.goalStatus]++;
                }
              }
            });
          }
          return acc;
        }, {});

  const { data: selfGoals } = useQuery(
    ["selfData"],
    () => getEmployeePerformance({ id: user._id, authToken }),
    { enabled: role === "Employee" }
  );
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
    <div>
      <div class="flex items-center justify-between ">
        <div class="space-y-1">
          <h2 class="text-2xl tracking-tight">Dashboard</h2>
          <p class="text-sm text-muted-foreground">
            Manage and organize goals setting
          </p>
        </div>
      </div>

      <Message />

      <div className="flex flex-wrap gap-4">
        <Card
          title={"Total Goals"}
          data={
            role === "Employee"
              ? `${statusCounts?.Completed ?? 0} / ${
                  selfGoals?.goals?.length ?? 0
                } completed`
              : `${goalStatusCounts?.Completed ?? 0} / ${
                  goalStatusCounts?.total ?? 0
                } completed`
          }
        />
        <Card
          title={"Total Overdue Goals"}
          data={
            role === "Employee"
              ? statusCounts?.Overdue ?? 0
              : goalStatusCounts?.overdue ?? 0
          }
        />
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

      {(role === "Manager" || role === "Super-Admin" || role === "HR") && (
        <div className="my-4">
          <DashboardTable
            tableData={tableData}
            tableFetching={tableFetching}
            role={role}
            performance={performance}
          />
        </div>
      )}

      {role === "Employee" && (
        <aside className="flex my-4 ">
          <div className="w-[35%] rounded-sm p-4">
            <h1 className="text-lg  font-bold text-[#67748E]">Goals chart</h1>
            <EmpGraph goalsData={statusCounts} />
          </div>
        </aside>
      )}
      {/* <PerformanceTable
        tableData={tableData}
        isLoading={isFetching}
        performance={performance}
      /> */}
    </div>
  );
};

export default PerformanceDashboard;
