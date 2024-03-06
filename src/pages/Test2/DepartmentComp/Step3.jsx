import React, { useContext } from "react";
import axios from "axios";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import { Error } from "@mui/icons-material";
import { useMutation } from "react-query";
const Step3 = ({ prevStep }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();
  const navigate = useNavigate("");

  const {
    dept_name,
    dept_description,
    dept_location,
    dept_head_name,
    dept_delegate_head_name,
    dept_cost_center_name,
    dept_cost_center_description,
    dept_id,
    dept_cost_center_id,
    emptyState,
  } = useDepartmentState();
  const data = useDepartmentState();
  console.log(data);
  const handleSubmit = useMutation(
    () => {
      const deptData = {
        departmentName: dept_name,
        departmentDescription: dept_description,
        departmentLocation: dept_location.value,
        ...(dept_head_name && { departmentHeadName: dept_head_name.value }),
        ...(dept_delegate_head_name && {
          departmentHeadDelegateName: dept_delegate_head_name.value,
        }),
        costCenterName: dept_cost_center_name,
        departmentId: dept_id,
        dept_cost_center_id: dept_cost_center_id,
      };

      console.log("deptdata", deptData);
      const response = axios.post(
        `${process.env.REACT_APP_API}/route/department/create/${organisationId}`,
        deptData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response;
    },
    {
      onSuccess: (response) => {
        handleAlert(
          true,
          "success",
          `${dept_name} department added successfully`
        );
        emptyState();
        navigate(`/organisation/${organisationId}/department-list`);
      },
      onError: (error) => {},
    }
  );

  return (
    <>
      <div className="w-full mt-4">
        <h1 className="text-2xl mb-2 font-bold">Confirm Details</h1>

        {dept_location?.value && dept_name && dept_id && dept_cost_center_id ? (
          <>
            <div className="p-3">
              <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
                Department Details
              </h1>
              <div className="grid w-full grid-cols-3  mb-4">
                <div className=" p-2 w-[30%] rounded-sm ">
                  <h1 className="text-gray-500 w-full text-sm">Name</h1>
                  <p className="w-full">{dept_name}</p>
                </div>
                <div className="p-2 w-[30%] rounded-sm ">
                  <h1 className="text-gray-500 text-sm"> Location</h1>
                  <p className="">{dept_location?.label}</p>
                </div>
                <div className="p-2 w-[30%] rounded-sm ">
                  <h1 className="text-gray-500 text-sm">Description</h1>
                  <p className="">{dept_description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="w-[40%] ">
                  <h1 className="text-gray-500 text-sm">Department Head</h1>
                  <p className="">{dept_head_name?.label}</p>
                </div>
                <div className=" w-[40%]">
                  <h1 className="text-gray-500 text-sm">
                    Delegate Department Head
                  </h1>
                  <p className="">{dept_delegate_head_name?.label}</p>
                </div>
              </div>

              <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
                Department Cost Center Details
              </h1>

              <div className="grid grid-cols-3 justify-between">
                <div className=" p-2 rounded-sm ">
                  <h1 className="text-gray-500 text-sm">
                    Department Cost Center Name
                  </h1>
                  <p className="">{dept_cost_center_name}</p>
                </div>

                <div className="p-2 rounded-sm ">
                  <h1 className="text-gray-500 text-sm">
                    Department Cost Center Description
                  </h1>
                  <p className="">{dept_cost_center_description}</p>
                </div>
                <div className="p-2 rounded-sm ">
                  <h1 className="text-gray-500 text-sm">Department ID</h1>
                  <p className="">{dept_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 justify-between">
                <div className="p-2 rounded-sm ">
                  <h1 className="text-gray-500 text-sm">
                    Department Cost Center ID
                  </h1>
                  <p className="">{dept_cost_center_id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-end w-full justify-between">
              <button
                type="button"
                onClick={() => {
                  prevStep();
                }}
                className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Prev
              </button>
              <button
                onClick={() => handleSubmit.mutate()}
                className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <section className=" py-6 px-8 rounded-md w-full">
            <article className="flex items-center mb-1 text-red-500 gap-2">
              <Error className="!text-2xl" />
              <h1 className="text-xl font-semibold">
                Kindly fill, all the fields
              </h1>
            </article>
            <p>
              Please fill in the fields from the previous steps to be able to
              view and confirm the addition of the department
            </p>
          </section>
        )}
      </div>
    </>
  );
};

export default Step3;
