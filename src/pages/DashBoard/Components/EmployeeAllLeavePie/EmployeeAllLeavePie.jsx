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
// import React, { useContext, useEffect } from "react";
// import { Pie } from "react-chartjs-2";
// import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";
// import axios from "axios";
// import { UseContext } from "../../../../State/UseState/UseContext";
// import { useParams } from "react-router-dom";
// import { useQuery } from "react-query";

// const EmployeeAllLeavePie = () => {
//     const { cookies } = useContext(UseContext);
//     const authToken = cookies["aegis"];
//     const param = useParams();
//     const organisationId = param?.id;
//     const RemainingLeaves = useLeaveTable();
//     const { data: remainingLeaves, isLoading } = RemainingLeaves;

//     useEffect(() => {
//         AOS.init({ duration: 800, once: true });
//     }, []);

//     const data = {
//         labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
//         datasets: [
//             {
//                 label: "Total Leaves",
//                 data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
//                 backgroundColor:
//                     remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: true,
//                 position: "right",
//                 labels: {
//                     color: "#444",
//                     font: {
//                         size: 14,
//                     },
//                 },
//             },
//         },
//     };

//     const { data: totalLeaves, isLoading1 } = useQuery(
//         "totalLeaves",
//         async () => {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_API}/route/get-all-leave-count/${organisationId}`,
//                 {
//                     headers: {
//                         Authorization: authToken,
//                     },
//                 }
//             );
//             return response.data;
//         },
//         {
//             enabled: !!authToken,
//         }
//     );
//     return (
//         <article
//             className="mb-2 w-full  h-max bg-white rounded-md shadow-sm "
//         >
//             <div className="flex flex-col ">
//                 <h1
//                     className="text-lg  font-semibold text-[#67748E] pt-4 px-4 mb-2"
//                 >
//                     My Leave
//                 </h1>
//                 <br />
//                 {isLoading ? (
//                     <div className="flex items-center justify-center w-full h-54">
//                         <Skeleton
//                             variant="rounded"
//                             width="100%"
//                             height="100%"
//                             animation="wave"
//                         />
//                     </div>
//                 ) : (
//                     <div className="w-full h-54 pb-4">
//                         <Pie data={data} options={options} />
//                     </div>
//                 )}
//             </div>
//         </article>
//     );
// };

// export default EmployeeAllLeavePie;
import { Skeleton } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useContext, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";
import axios from "axios";
import { UseContext } from "../../../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

const EmployeeAllLeavePie = () => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const param = useParams();
    const organisationId = param?.id;
    const RemainingLeaves = useLeaveTable();
    const { data: remainingLeaves, isLoading } = RemainingLeaves;

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // Fetch total leaves from the API
    const { data: totalLeaves, isLoading: isLoading1 } = useQuery(
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
            return response.data;
        },
        {
            enabled: !!authToken,
        }
    );

    // Prepare data for the Pie chart
    const chartData = () => {
        if (!remainingLeaves || !totalLeaves) return { labels: [], data: [] };

        const leaveData = remainingLeaves.leaveTypes?.map((leaveType) => {
            const totalCount = totalLeaves.data?.find(
                (total) => total._id === leaveType._id
            )?.count || 0; // Total leaves
            const remainingCount = leaveType.count || 0; // Remaining leaves
            const takenCount = totalCount - remainingCount; // Calculate taken leaves

            return {
                leaveName: leaveType.leaveName,
                remainingCount,
                takenCount: Math.max(takenCount, 0), // Ensure no negative values
                color: leaveType.color,
            };
        });

        return {
            labels: leaveData.map((leave) => leave.leaveName), // Leave names
            datasets: [
                {
                    label: "Leaves",
                    data: leaveData.flatMap((leave) => [leave.remainingCount, leave.takenCount]), // Flattened array of remaining and taken counts
                    backgroundColor: leaveData.flatMap((leave) => [leave.color, "#D3D3D3"]), // Use specific color for remaining and gray for taken
                },
            ],
        };
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right",
                labels: {
                    color: "#444",
                    font: {
                        size: 14,
                    },
                },
            },
        },
    };

    const data = chartData(); // Get chart data

    return (
        <article className="mb-2 w-full h-max ">
            <div className="flex flex-col h-[250px]">
                <h1 className="text-xl font-semibold text-[#67748E]">
                    My Leave
                </h1>
                <br />
                {isLoading || isLoading1 ? (
                    <div className="flex items-center justify-center w-full h-54">
                        <Skeleton variant="rounded" width="100%" height="100%" animation="wave" />
                    </div>
                ) : (
                    <div className="w-full h-full  bg-white border-[0.5px] border-[#E5E7EB]-500">
                        <Pie data={data} options={options} style={{ width: "400px", height: "140px" }} />
                    </div>
                )}
            </div>
        </article>
    );
};

export default EmployeeAllLeavePie;
