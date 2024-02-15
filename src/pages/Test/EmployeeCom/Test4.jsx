import React from "react";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";

const Test4 = () => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    gender,
    bank_account_no,
    date_of_birth,
    designation,
    worklocation,
    deptname,
    employmentType,
    empId,
    joining_date,
    salarystructure,
    dept_cost_center_no,
    companyemail,
    shift_allocation,
    data,
  } = useEmpState();

  console.log(data);

  return (
    <>
      <div className="w-full mt-4">
        <h1 className="text-2xl mb-2 font-bold">Confirm Details</h1>

        <div className="p-3">
          <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
            Personal details
          </h1>
          <div className="grid grid-cols-3">
            <div className=" p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500  text-sm">Full name</h1>
              <p className="">
                {first_name} {last_name}
              </p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Personal email</h1>
              <p className="">{email}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Contact</h1>
              <p className="">{phone_number}</p>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className=" p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Gender</h1>
              <p className="">{gender}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Date of joining</h1>
              <p className="">{date_of_birth}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Permanat address</h1>
              <p className="">{address}</p>
            </div>
          </div>

          <div className="p-2 w-[30%] rounded-sm ">
            <h1 className="text-gray-500 text-sm">Bank account</h1>
            <p className="">{bank_account_no}</p>
          </div>

          <div className="grid grid-cols-3">
            <div className=" p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Aadhar No</h1>
              <p className="">{adhar_card_number}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">Pan card</h1>
              <p className="">{pan_card_number}</p>
            </div>
            <div className="p-2 w-[30%] rounded-sm ">
              <h1 className="text-gray-500 text-sm">CitizenShip status</h1>
              <p className="">{citizenship}</p>
            </div>
          </div>

          <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
            Company details
          </h1>

          <div className="grid grid-cols-3 justify-between">
            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Employee No</h1>
              <p className="">{empId}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Department</h1>
              <p className="">{deptname?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Company email</h1>
              <p className="">{companyemail}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 justify-between">
            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Date of joining</h1>
              <p className="">{joining_date}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Department</h1>
              <p className="">{deptname?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Designation</h1>
              <p className="">{designation?.label}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 justify-between">
            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Shift</h1>
              <p className="">{shift_allocation?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Department cost No</h1>
              <p className="">{dept_cost_center_no?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Location</h1>
              <p className="">{worklocation?.label}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 justify-between">
            <div className=" p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Employment Types</h1>
              <p className="">{employmentType?.label}</p>
            </div>
            <div className="p-2 rounded-sm ">
              <h1 className="text-gray-500 text-sm">Salary Template</h1>
              <p className="">{salarystructure?.label}</p>
            </div>
          </div>

          <h1 className=" text-lg bg-gray-200 px-4 py-2 w-full  my-2">
            Additional details
          </h1>
          <div className="grid grid-cols-3 justify-between">
            {Object.entries(data)?.map(([key, value]) => (
              <div className="p-2 rounded-sm ">
                <h1 className="text-gray-500 text-sm">{key}</h1>
                <p className="">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Test4;
