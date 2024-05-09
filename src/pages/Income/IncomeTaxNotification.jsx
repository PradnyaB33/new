import { Info, West } from "@mui/icons-material";
import { Chip, IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import useIncomeTax from "../../hooks/IncomeTax/useIncomeTax";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";

const IncomeTaxNotification = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  // const role = useGetCurrentRole();
  // const redirect = useNavigate();
  const authToken = useAuthToken();
  const { financialYear } = useIncomeTax();

  const { data: empTDSData, isLoading: empDataLoading } = useQuery({
    queryKey: ["TDSNotify"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSNotify/${user._id}/${financialYear}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  console.log(`🚀 ~ empTDSData:`, empTDSData);
  return (
    <section className=" min-h-[90vh]  h-auto  bg-gray-50 ">
      <header className="text-xl w-full pt-6 flex items-start gap-2 bg-white shadow-md   p-4">
        <Link to="/income-tax">
          <IconButton>
            <West className=" !text-xl" />
          </IconButton>
        </Link>
        TDS Notifications
      </header>

      <div className="p-4 space-y-2  ">
        {empDataLoading ? (
          <div className="bg-white py-4 px-8 rounded-md shadow-sm space-y-2">
            <div>
              <Skeleton variant="text" className="text-xl" />
              <Skeleton variant="text" className="text-gray-500" />
            </div>
            <Skeleton variant="rectangular" height={24} width={80} />
          </div>
        ) : empTDSData?.length <= 0 ? (
          <div className="flex px-4 w-full items-center my-4">
            <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
              <Info /> No notification found
            </h1>
          </div>
        ) : (
          empTDSData?.map((ele, id) => (
            <div
              key={id}
              className="bg-white py-4 px-8 rounded-md shadow-sm space-y-2"
            >
              <div>
                <h1 className="text-xl tracking-tight">{ele?.name}</h1>
                {ele.message && <p>{ele.message}</p>}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Chip
                  size="small"
                  label={ele.status}
                  className={`
              ${
                ele.status === "Approved" ? "!bg-green-600" : "!bg-red-600"
              } !text-white`}
                />
                <p>{moment(ele?.updatedAt).fromNow()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default IncomeTaxNotification;
