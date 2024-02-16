import { Skeleton } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../hooks/Token/useUser";
import Setup from "../Setup";
import SubscriptionCard from "./components/subscription-card";
import SubscriptionRow from "./components/subscriptionRow";

const Subscription = () => {
  const { decodedToken, authToken } = useGetUser();
  const queryClient = useQueryClient();
  const { organisationId } = useParams();

  // Get Query
  const getSubscription = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/subscription/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading } = useQuery({
    queryKey: [`subscription-${organisationId}`],
    queryFn: getSubscription,
    onSuccess: (data) => {
      console.log(
        `🚀 ~ file: Subscription.jsx:38 ~  moment.unix(data?.subscription.created_at):`,
        moment.unix(data?.subscription.created_at)
      );
      console.log(
        `🚀 ~ file: Subscription.jsx:38 ~  moment.unix(data?.subscription?.charge_at):`,
        moment.unix(data?.subscription?.charge_at)
      );
      console.log(
        `🚀 ~ file: Subscription.jsx:38 ~  moment():`,
        moment.duration(moment().diff(data?.subscription?.charge_at)).days()
      );
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  // const deleteMutation = useMutation(
  //   (id) =>
  //     axios.delete(
  //       `${process.env.REACT_APP_API}/route/employment-types/${id}`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     ),
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch the data after successful deletion
  //       queryClient.invalidateQueries("empTypes");
  //       handleAlert(true, "success", "Employeement types deleted succesfully");
  //     },
  //   }
  // );

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-full md:w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-[30px] border-b-[.1px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3">
                <div className="rounded-full bg-brand/purple h-[30px] w-[30px] flex items-center justify-center"></div>
                <h1 className="!text-lg font-bold tracking-wide text-brand/neautrals">
                  Membership & Billing
                </h1>
              </div>
            </div>
            <div className="p-[30px] grid grid-cols-3">
              <div className=" col-span-2 grid grid-cols-2 gap-[24px]">
                {/* {data?.} */}
                <SubscriptionRow
                  leftText={"Status"}
                  rightText={data?.subscription?.status}
                  loading={isLoading}
                  chip={true}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Packages"}
                  rightText={`${data?.organisation?.packages?.length} Package active`}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Plan Details"}
                  rightText={"AEGIS PLAN"}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Plan Description"}
                  rightText={`${data?.plan?.item?.description}`}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Billing Amount"}
                  rightText={`${data?.plan?.item?.amount / 100} ₹ / Employee`}
                />
                <SubscriptionRow
                  loading={isLoading}
                  leftText={"Billing Frequency"}
                  rightText={`${data?.plan?.period}`}
                />
              </div>
              <div className="col-span-1 text-brand/primary-blue grid justify-center text-xl font-bold">
                <img
                  src="/subscription-mail.svg"
                  alt="Subscription"
                  className="m-auto h-[175px]"
                />

                <div>
                  Your Next billing date is after
                  <span className="text-brand/neautrals">
                    {" "}
                    {isLoading ? (
                      <Skeleton className="!inline-block" width={10} />
                    ) : (
                      moment
                        .duration(
                          moment
                            .unix(data?.subscription?.charge_at)
                            .diff(moment())
                        )
                        .days()
                    )}
                  </span>{" "}
                  days
                </div>
              </div>
            </div>
            <div className="p-[30px] flex flex-col gap-4">
              <h1 className="!text-lg font-bold tracking-wide text-brand/neautrals">
                Active Packages
              </h1>
              <div className="w-full flex flex-row flex-wrap gap-8">
                {data?.organisation?.packages.map((doc) => {
                  return (
                    <SubscriptionCard
                      header={doc?.name}
                      description={doc?.description}
                    />
                  );
                })}
              </div>
            </div>
          </article>
        </Setup>
      </section>
    </>
  );
};

export default Subscription;
