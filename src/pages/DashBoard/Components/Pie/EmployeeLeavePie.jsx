// //old one
// // import { Skeleton } from "@mui/material";
// // import React from "react";
// // import { Pie } from "react-chartjs-2";
// // import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";

// // const EmployeeLeavePie = () => {
// //   const RemainingLeaves = useLeaveTable();

// //   const { data: remainingLeaves, isLoading } = RemainingLeaves;

// //   const data = {
// //     labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
// //     datasets: [
// //       {
// //         label: "Total Leaves",
// //         data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
// //         backgroundColor:
// //           remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
// //       },
// //     ],
// //   };

// //   const options = {
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     plugins: {
// //       legend: {
// //         display: true,
// //         position: "right",
// //       },
// //     },
// //   };
// //   return (
// //     <article className="mb-2 w-full h-max bg-white rounded-md border">
// //       {isLoading ? (
// //         <div className="p-4 !pb-2 space-y-2">
// //           <h1 className="text-lg  font-bold text-[#67748E]">
// //             Total Leaves Left
// //           </h1>
// //           <Skeleton variant="rounded" height={150} animation="wave" />
// //         </div>
// //       ) : (
// //         <div className="w-full">
// //           <div className="border-b-[2px] flex w-full px-4 items-center justify-between">
// //             <div className="flex items-center gap-2 py-2  ">
// //               <h1 className="text-lg  font-bold text-[#67748E]">
// //                 Total Leaves Left
// //               </h1>
// //             </div>
// //           </div>
// //           {/* <Divider variant="fullWidth" orientation="horizontal" /> */}
// //           <div className="p-2  w-auto ">
// //             <Pie data={data} options={options} />
// //           </div>
// //         </div>
// //       )}
// //     </article>
// //   );
// // };

// // export default EmployeeLeavePie;

// import { Skeleton } from "@mui/material";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import React, { useEffect } from "react";
// import { Pie } from "react-chartjs-2";
// import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";

// const EmployeeLeavePie = () => {
//   const RemainingLeaves = useLeaveTable();
//   const { data: remainingLeaves, isLoading } = RemainingLeaves;

//   useEffect(() => {
//     AOS.init({ duration: 800, once: true });
//   }, []);

//   const data = {
//     labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
//     datasets: [
//       {
//         label: "Total Leaves",
//         data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
//         backgroundColor:
//           remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: "right",
//         labels: {
//           color: "#444",
//           font: {
//             size: 14,
//           },
//         },
//       },
//     },
//   };

//   return (
//     <article
//       className="mb-2 w-full  h-max bg-white rounded-md shadow-sm "
//     >
//       <div className="flex flex-col ">
//         <h1
//           className="text-lg  font-semibold text-[#67748E] pt-4 px-4 mb-2"
//         >
//           Total Leaves Left
//         </h1>
//         <br />
//         {isLoading ? (
//           <div className="flex items-center justify-center w-full h-54">
//             <Skeleton
//               variant="rounded"
//               width="100%"
//               height="100%"
//               animation="wave"
//             />
//           </div>
//         ) : (
//           <div className="w-full h-54 pb-4">
//             <Pie data={data} options={options} />
//           </div>
//         )}
//       </div>
//     </article>
//   );
// };

// export default EmployeeLeavePie;
import { Skeleton } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useContext } from "react";
import { Doughnut } from "react-chartjs-2"; // Change Pie to Doughnut
import axios from "axios";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";

const EmployeeLeaveDonut = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const param = useParams();
  const organisationId = param?.id;

  // Fetch the total leaves from the API using useQuery
  const { data: totalLeaves, isLoading } = useQuery(
    "totalLeaves",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-all-leave-count/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data; // Adjust this if the response has a different structure
    },
    {
      enabled: !!authToken, // Only fetch if authToken exists
    }
  );

  // Fetch the remaining leaves
  const RemainingLeaves = useLeaveTable();
  const { data: remainingLeaves, isLoading: isLoading2 } = RemainingLeaves;

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Helper function to prepare the data for each leave type's donut chart based on remainingLeaves
  const getDonutData = (remainingLeave) => {
    const totalLeave = totalLeaves?.data?.find(
      (leave) => leave._id === remainingLeave._id
    );

    const totalCount = totalLeave?.count ?? 0;
    const remainingCount = remainingLeave?.count ?? 0;
    const takenCount = totalCount - remainingCount;

    return {
      labels: [], // No labels are shown on the chart
      datasets: [
        {
          data: [remainingCount, Math.max(takenCount, 0)], // Ensures no negative values
          backgroundColor: [remainingLeave.color, "#D3D3D3"], // Leave color and gray for taken leaves
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    cutout: '70%',
  };

  return (
    <article className="mb-2 w-full h-max ">
      <div className="flex flex-col h-[250px]">
        <h1 className="text-xl font-semibold text-[#67748E]">
          Leave Balance
        </h1>
        <br />
        {isLoading || isLoading2 ? (
          <div className="flex items-center justify-center w-full h-54">
            <Skeleton variant="rounded" width="100%" height="100%" animation="wave" />
          </div>
        ) : (
          <div className="w-full grid grid-cols-3    gap-5">
            {remainingLeaves?.leaveTypes?.map((remainingLeave) => {
              // const totalLeave = totalLeaves?.data?.find(
              //   (leave) => leave._id === remainingLeave._id
              // );
              const remainingCount = remainingLeave?.count ?? 0;

              return (
                <div key={remainingLeave._id} className="w-full h-full relative bg-white p-2 px-6 border-[0.5px] border-[#E5E7EB]-500">
                  <h2 className="text-center font-semibold text-[#67748E]">
                    {remainingLeave.leaveName}
                  </h2>
                  <div className="relative">
                    <Doughnut data={getDonutData(remainingLeave)} options={options} style={{ width: "300px", height: "140px" }} />
                    <div
                      className="absolute top-0 left-[35%]  bottom-0 flex items-center justify-center"
                      style={{ pointerEvents: 'none' }} // Prevent interactions with the overlay
                    >
                      <span className="text-xl font-bold text-[#67748E]">
                        {remainingCount} Days
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default EmployeeLeaveDonut;
