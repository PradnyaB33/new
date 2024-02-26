import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const TDSTable1 = () => {
  const authToken = useAuthToken();
  const createTDSArray = (data) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (data && data.length > 0) {
      return data.map((item) => ({
        month: item.salary.formattedDate,
        HRA: Number(item.salary.hraSalary),
        DA: item.salary.daSalary,
        Basic: item.salary.basicSalary,
        GrossSalary: Number(item.salary.totalGrossSalary),
        PF: 0,
        NetSalary: item.salary.totalNetSalary,
      }));
    }

    // If data is not available, return default TDS array
    return months.map((month) => ({
      month: month + " " + 2023,
      HRA: 0,
      DA: 0,
      Basic: 0,
      GrossSalary: 0,
      PF: 0,
      NetSalary: 0,
    }));
  };

  const [year, setYear] = useState();

  const {
    data: financialData,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["salaryFinacialYear"],
    queryFn: async () => {
      try {
        const salaryData = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/getEmployeeSalaryPerFinancialYear?fromDate=5-2023&toDate=3-2024`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return salaryData.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [tdsData, setTDSData] = useState(createTDSArray(financialData));

  const totalHRA = tdsData.reduce((total, i) => total + Number(i.HRA), 0);
  const totalGrossSalary = tdsData.reduce(
    (total, i) => total + Number(i.GrossSalary),
    0
  );

  const totalBasic = tdsData.reduce((total, i) => total + Number(i.Basic), 0);
  const totalNetSalary = tdsData.reduce(
    (total, i) => total + Number(i.NetSalary),
    0
  );
  const totalDA = tdsData.reduce((total, i) => total + Number(i.DA), 0);

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    setYear(newYear);
    setTDSData(createTDSArray(newYear));
  };

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center w-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          {/* <label htmlFor="year">Select Year: </label>
          <input
            type="number"
            id="year"
            name="year"
            value={year}
            onChange={handleYearChange}
          /> */}

          <table className="min-w-full bg-white border-gray-200 border-[.5px]  text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="px-3 py-3">
                  Salary Breakup
                </th>
                <th scope="col" className="py-3">
                  Total
                </th>
                {tdsData.map((item) => (
                  <th scope="col" className="py-3">
                    {item.month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="!font-medium h-20 border-b">
                <td className="py-4 px-4">BASIC</td>
                <td>{totalBasic.toFixed(2)}</td>
                {tdsData.map((item) => (
                  <td>{item.Basic}</td>
                ))}
              </tr>

              <tr className="!font-medium h-20 border-b">
                <td className="py-4 px-4">HRA</td>
                <td>{totalHRA.toFixed(2)}</td>

                {tdsData.map((item) => (
                  <td>{item?.HRA?.toFixed(2)}</td>
                ))}
              </tr>
              <tr className="!font-medium h-20 border-b">
                <td className="py-4 px-4">DA</td>
                <td>{totalDA?.toFixed(2) ?? 0.0}</td>
                {tdsData.map((item) => (
                  <td>{item?.DA}</td>
                ))}
              </tr>

              <tr className="!font-medium h-20  border-b">
                <td className="py-4 px-4">PF</td>
                <td className="pr-4">0.00</td>
                {tdsData.map((item) => (
                  <td>{item.PF.toFixed(2)}</td>
                ))}
              </tr>

              <tr className="!font-medium h-20 border-b">
                <td className="py-4 px-4 font-bold">Gross Salary</td>
                <td className="font-bold"> {totalGrossSalary.toFixed(2)}</td>
                {tdsData.map((item) => (
                  <td className="font-bold">{item?.GrossSalary?.toFixed(2)}</td>
                ))}
              </tr>

              <tr className="!font-medium   h-20 border-b">
                <td className="py-4 px-4 font-bold">NetSalary</td>
                <td className="font-bold">{totalNetSalary.toFixed(2)}</td>
                {tdsData.map((item) => (
                  <td className="font-bold">{item.NetSalary}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default TDSTable1;
