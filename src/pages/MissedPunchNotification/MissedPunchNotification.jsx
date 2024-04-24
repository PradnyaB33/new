import React, { useState } from "react";
import { Search, West  ,RequestQuote,} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import useMissedPunchNotificationCount from "../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import MissedPunchNotified from "./missedPunchNotified";
import UserProfile from "../../hooks/UserData/useUser";

const MissedPunchNotification = () => {
  const { missPunchData } = useMissedPunchNotificationCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  console.log("role" , role);

  
  const filteredEmployees = missPunchData && Array.isArray(missPunchData) 
    ? missPunchData.filter(employee =>
        employee.employeeId?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId?.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : [];

  
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee); 
  }; 

  console.log("selected emplyee" , selectedEmployee);

  const employeeId = selectedEmployee && selectedEmployee?.employeeId?._id;
  console.log("employee id" , employeeId);

  return (
    <div className="w-full">
      <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
        <West className="mx-4 !text-xl" />
        Employee Missed Punch Request
      </header>
      <section className="min-h-[90vh] flex">
        <article className="w-[20%] overflow-auto max-h-[90vh] h-full bg-white border-gray-200">
          <div className="p-6 !py-2">
            <div className="space-y-2">
              <div className={`flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}>
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none px-2`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          {filteredEmployees.length > 0 && (
            <div>
              {filteredEmployees.map((employee) => (
                <div
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50`}
                  key={employee?.employeeId?._id}
                  onClick={() => handleEmployeeClick(employee)} 
                >
                  <Avatar src={employee?.avatarSrc} />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {employee?.employeeId?.first_name}{" "}
                      {employee?.employeeId?.last_name}
                    </h1>
                    <h1 className={`text-sm text-gray-500`}>
                      {employee.employeeId?.email}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
        <div className="w-[80%]">
          {selectedEmployee ? (
            <MissedPunchNotified employee={selectedEmployee} employeeId = {employeeId} />
          ) : (
            <div className="p-4 space-y-1 flex items-center gap-3">
            <Avatar className="text-white !bg-blue-500">
              <RequestQuote />
            </Avatar>
            <div>
              <h1 className=" text-xl">Missed Punch Requests</h1>
              <p className="text-sm">
               {` Here ${role} would be able to approve or reject the  missed punch
                notifications`}
              </p>
            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MissedPunchNotification;
