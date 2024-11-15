import React, { useEffect } from "react";
import useStudentListStore from "./useStudentListStore";



const FullskapeTableComponent = ({ register, setValue, watch, addedEmployee = [] }) => {
  const { employeeList } = useStudentListStore();
  const allSelected = watch("selectAll");

  useEffect(() => {
    if (employeeList && addedEmployee) {
      employeeList.forEach((item) => {
        const isAlreadyAdded = addedEmployee.some((emp) => emp._id === item._id);
        setValue(`${item._id}`, isAlreadyAdded || allSelected); // Synchronize the checkbox values
      });
    }
  }, [allSelected, employeeList, addedEmployee, setValue]); // Ensure dependencies cover all necessary updates

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setValue("selectAll", checked);
    employeeList.forEach((item) => {
      setValue(`${item._id}`, checked);
    });
  };

  return (
    <table className="min-w-full bg-white text-left text-sm font-light">
      <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
        <tr className="font-semibold">
          <th scope="col" className="text-center py-3 w-1/12">
            <input
              type="checkbox"
              {...register("selectAll")}
              onChange={handleSelectAll}
              checked={allSelected || false}
            />
          </th>
          <th scope="col" className="py-3 w-2/12">First Name</th>
          <th scope="col" className="py-3 w-2/12">Last Name</th>
          <th scope="col" className="py-3 w-2/12">Email</th>
          <th scope="col" className="py-3 w-1/12">Added</th>
        </tr>
      </thead>
      <tbody>
        {employeeList && employeeList.length > 0 ? (
          employeeList.map((item) => (
            <tr key={item._id} className="border-b border-gray-200 dark:border-neutral-700">
              <td className="py-4 text-center">
                <input
                  {...register(`${item._id}`)}
                  type="checkbox"
                  className="checkbox"
                  value={item._id}
                  checked={watch(`${item._id}`) || false}
                />
              </td>
              <td className="py-4">{item.first_name || "N/A"}</td>
              <td className="py-4">{item.last_name || "N/A"}</td>
              <td className="py-4">{item.email || "N/A"}</td>
              <td className="py-4 text-center">
                {addedEmployee.some((emp) => emp._id === item._id) ? "Yes" : "No"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4">
              No Employees Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default FullskapeTableComponent;
