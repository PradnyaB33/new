import React from "react";

function TestFile() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Company Logo"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <p className="text-lg font-semibold">
            Organization Name: Example Corp
          </p>
          <p className="text-lg">Location: New York, USA</p>
          <p className="text-lg">Contact Number: +1 123-456-7890</p>
          <p className="text-lg">Organization Email: info@example.com</p>
        </div>
      </div>
      <hr className="mb-6" />
      <div>
        <table className="w-full">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-4 py-2">Salary Slip</th>
              <th></th>
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">January 2024</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Employee Name:</td>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2">Date Of Joining:</td>
              <td className="px-4 py-2">2020-01-01</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Degination:</td>
              <td className="px-4 py-2">Software Engineer</td>
              <td className="px-4 py-2">Unpaid Leaves:</td>
              <td className="px-4 py-2">2</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
      {/* Add more HTML elements for other sections of the document */}
    </div>
  );
}

export default TestFile;
