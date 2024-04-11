import React from "react";
import EmployeeTable from "./components/table";
import useTrainingFormEmployee from "./my-training-use-query";

const MyTraining = () => {
  const { data, setPage, isLoading, page } = useTrainingFormEmployee();
  console.log(`🚀 ~ file: page.jsx:7 ~ data:`, data);
  return (
    <div className="pt-14 p-8">
      <div>
        <h4>Assigned Trainings : {data?.data?.length}</h4>
        <h4>Ongoing Trainings</h4>
        <h4>Upcoming Trainings</h4>
      </div>
      <EmployeeTable
        data={data?.data}
        setPage={setPage}
        isLoading={isLoading}
        totalResult={data?.totalResults}
        page={page}
      />
    </div>
  );
};

export default MyTraining;
// <h1 className="text-4xl font-bold text-left w-full">My Training</h1>
//      <div className="flex justify-center mt-4 w-full">
//        <div className="w-full">
//          <div className="flex justify-between">
//            <h1 className="text-2xl font-bold">Training</h1>
//            <Button variant="contained">Create Your own training</Button>
//          </div>
//          <div className="flex justify-between">
//            <div className="flex flex-col">
//              <p className="text-xl text-gray-500">
//                Click on add new button to create trainings
//              </p>
//            </div>
//          </div>
//        </div>
//      </div>
