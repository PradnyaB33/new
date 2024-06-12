import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import OrgTree from "react-org-tree";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../hooks/Token/useAuth";

export default function OrgChart() {
  const { organizationId } = useParams();
  const authToken = useAuthToken();
  const { data: orgChart, isLoading } = useQuery("orgChart", async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getOrgTree/${organizationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  });

  const data = !isLoading ? orgChart : [];

  // ${
  //                    data.name === "HR"
  //                      ? "border-t-[3px] border-green-500"
  //                      : data.name === "Manager"
  //                      ? "border-t-[3px] border-blue-500"
  //                      : "border-t-[3px] border-gray-500"
  //                  }

  return (
    <div className="flex  h-screen  justify-center w-full">
      <div className=" mt-20 h-max">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <OrgTree
              expandAll={true}
              data={data}
              horizontal={false}
              collapsable={true}
              labelClassName="!p-0 !m-0 !bg-transparent !shadow-none"
              renderContent={(data) => {
                return (
                  <div
                    className={` border !text-gray-900 rounded-md !p-4  !px-10`}
                  >
                    <div className="flex justify-center  items-center gap-2">
                      <Avatar src={data.image} sx={{ width: 40, height: 40 }} />
                      <div>
                        <h1 className=" flex text-lg font-medium gap-2">
                          {data.title}
                        </h1>
                        <p className="text-sm text-gray-600 ">{data.name}</p>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
