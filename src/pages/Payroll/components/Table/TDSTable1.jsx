import React, { useState } from "react";

const TDSTable1 = () => {
  const createTDSArray = (year) => {
    const months = [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ];

    return months.map((month) => ({
      month: month + " " + year,
      HRA: 2000,
      DA: 1000,
      Basic: 20000,
      GrossSalary: 30000,
      PF: 3000,
      NetSalary: 5000,
    }));
  };

  const [year, setYear] = useState(2024);
  const [tdsData, setTDSData] = useState(createTDSArray(year));

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    setYear(newYear);
    setTDSData(createTDSArray(newYear));
  };

  return (
    <div className="mt-2 space-y-2">
      <label htmlFor="year">Select Year: </label>
      <input
        type="number"
        id="year"
        name="year"
        value={year}
        onChange={handleYearChange}
      />

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
            <td>2500</td>
            {tdsData.map((item) => (
              <td>{item.Basic}</td>
            ))}
          </tr>

          <tr className="!font-medium h-20 border-b">
            <td className="py-4 px-4">HRA</td>
            <td>25000</td>
            {tdsData.map((item) => (
              <td>{item.HRA}</td>
            ))}
          </tr>
          <tr className="!font-medium h-20 border-b">
            <td className="py-4 px-4">DA</td>
            <td>25000</td>
            {tdsData.map((item) => (
              <td>{item.DA}</td>
            ))}
          </tr>

          <tr className="!font-medium bg-gray-300 h-10 border-b">
            <td className="py-4 px-4 font-bold">Gross Salary</td>
            <td className="font-bold">25000</td>
            {tdsData.map((item) => (
              <td className="font-bold">{item.GrossSalary}</td>
            ))}
          </tr>

          <tr className="!font-medium h-20  border-b">
            <td className="py-4 px-4">PF</td>
            <td className="pr-4">25000</td>
            {tdsData.map((item) => (
              <td>{item.PF}</td>
            ))}
          </tr>

          <tr className="!font-medium bg-blue-600 text-white h-10 border-b">
            <td className="py-4 px-4 font-bold">NetSalary</td>
            <td className="font-bold">25000</td>
            {tdsData.map((item) => (
              <td className="font-bold">{item.NetSalary}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TDSTable1;
