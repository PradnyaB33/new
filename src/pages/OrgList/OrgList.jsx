import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { IoBusiness } from "react-icons/io5";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import Organisation from "../Home/components/Organisation";

const OrgList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  const { data, isLoading } = useQuery(["orgData"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/get`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  // const dotsresponsive = {
  //   desktop: {
  //     breakpoint: { max: 3000, min: 1400 },
  //     items: 4,
  //     slidesToSlide: 1,
  //   },
  //   tablet: {
  //     breakpoint: { max: 1400, min: 1050 },
  //     items: 3,
  //     slidesToSlide: 1,
  //   },
  //   mobile: {
  //     breakpoint: { max: 1050, min: 500 },
  //     items: 2,
  //     slidesToSlide: 1,
  //   },
  // };

  // const CustomRightArrow = ({ onClick }) => {
  //   // onMove means if dragging or swiping in progress.
  //   return (
  //     <button
  //       className="p-2 rounded-full border-sky-600 font-bold bg-slate-300 text-sky-600 border absolute right-0"
  //       onClick={() => onClick()}
  //     >
  //       <East />
  //     </button>
  //   );
  // };

  // const CustomLeftArrow = ({ onClick }) => {
  //   return (
  //     <button
  //       className="p-2 rounded-full text-[2px] border-sky-600 font-bold bg-slate-300 text-sky-600 border absolute left-0"
  //       onClick={() => onClick()}
  //     >
  //       <West className="h-2 w-4 text-[5px]" />
  //     </button>
  //   );
  // };

  return (
    <div className="bg-gray-50 h-screen">
      <div className="p-10  !pb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center justify-center gap-2 ">
              <Avatar
                className="!bg-blue-500  h-[100px] text-4xl p-1 shadow-sm"
                variant="rounded"
                sx={{ width: "46", height: "46" }}
              >
                <IoBusiness />
              </Avatar>
              {/* <SvgIcon className="text-blue-500 bg-white h-[100px] text-4xl p-1 shadow-sm"></SvgIcon> */}
              <h1 className="!text-[1.7rem] font-semibold text-black">
                List of Organizations
              </h1>
            </div>
            <p className="text-gray-600">Select and manage your oragnization</p>
          </div>

          <Link to={"/add-organisation"}>
            <button className=" flex  group justify-center gap-2 items-center rounded-md px-6 py-[.3rem] text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
              Add Organization
            </button>
          </Link>
        </div>
      </div>

      {!isLoading && (
        // <Carousel
        //   swipeable={false}
        //   draggable={false}
        //   customRightArrow={<CustomRightArrow />}
        //   customLeftArrow={<CustomLeftArrow />}
        //   responsive={dotsresponsive}
        // >
        <div className="flex flex-wrap  gap-x-6 gap-y-2 px-10">
          {data?.organizations?.map((item, index) => (
            <div className="h-max py-4" key={index}>
              <Organisation item={item} id={index} />
            </div>
          ))}
        </div>
        // </Carousel>
      )}
    </div>
  );
};

export default OrgList;
