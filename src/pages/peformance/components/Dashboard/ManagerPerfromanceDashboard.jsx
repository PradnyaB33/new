import React from "react";
import { Doughnut } from "react-chartjs-2";

const ManagerPerfromanceDashboard = () => {
  const data = {
    labels: ["1 Star", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Ratings Count",
        data: [12, 19, 3, 5], // Example counts for each rating
        backgroundColor: [
          "#EC6B56", // Red - Bad
          "#FF851B", // Orange - Below Average
          "#FFDC00", // Yellow - Average
          "#2ECC40", // Green - Good
        ],
      },
    ],
  };
  const data2 = {
    labels: ["completed", "Not started", "In progress", "Overdue"],
    datasets: [
      {
        label: "Ratings Count",
        data: [12, 19, 3, 5], // Example counts for each rating
        backgroundColor: ["#2ECC40", "#808080", "#0074D9", "#EC6B56"],
      },
    ],
  };

  const options = {
    responsive: true,
    barThickness: 45,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Project Task Status",
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
          barPercentage: 0.6,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };

  // const options = {
  //   barThickness: 45,
  //   elements: {
  //     line: {
  //       tension: 0.5,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false,
  //         barPercentage: 0.6,
  //       },
  //     },
  //     y: {
  //       grid: {
  //         display: true,
  //       },
  //     },
  //   },
  //   maintainAspectRatio: false,
  //   responsive: true,
  // };
  const optionsDougnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  return (
    <section className="flex gap-4 ">
      {/* <aside className="w-[60%]">
        <div className="w-full px-4 pb-4  flex flex-col border rounded-sm bg-white  justify-center">
          <div className="flex my-4 sm:flex-row flex-col sm:justify-between gap-2 sm:items-center">
            <h1 className="text-lg font-bold text-[#67748E]">
              Best Employee Graph
            </h1>
          </div>
          <div className="h-auto w-full ">
            <Bar options={options} data={data} />
          </div>
        </div>
      </aside> */}

      <aside className="w-full  grid h-max  gap-8">
        {/* <div className="w-max px-4 pb-4  flex flex-col  rounded-sm bg-gray-50 border  justify-center">
          <div className="flex my-4 sm:flex-row flex-col sm:justify-between gap-2 sm:items-center">
            <h1 className="text-lg font-bold text-[#67748E]">Goals chart</h1>
          </div>
          <div className="h-[125px] pr-10 w-max ">
            <Doughnut options={optionsDougnut} data={data2} />
          </div>
        </div> */}

        <div className="w-max px-4 pb-4  flex flex-col rounded-sm bg-gray-50 border  justify-center">
          <div className="flex my-4 sm:flex-row flex-col sm:justify-between gap-2 sm:items-center">
            <h1 className="text-lg font-bold text-[#67748E]">Rating Graph</h1>
          </div>
          <div className="h-[125px] pr-10 w-max ">
            <Doughnut options={optionsDougnut} data={data} />
          </div>
        </div>
      </aside>
    </section>
  );
};

export default ManagerPerfromanceDashboard;
