import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import useOrg from "../../../State/Org/Org";
import PackageInfo from "../../../components/Modal/PackagesModal/package-info";
import Loader from "../../../components/app-loader/page";
import useGetUser from "../../../hooks/Token/useUser";
import { packageArray } from "../../../utils/Data/data";
import PricingCard from "./step-2-components/pricing-card";

const Step4 = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const data = useOrg();
  console.log(`🚀 ~ file: step-4.jsx:15 ~ data:`, data);
  const { authToken, decodedToken } = useGetUser();
  const config = {
    headers: {
      Authorization: authToken,
    },
  };
  const handleDismiss = async (id) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/organization/delete/${id}`,
      config
    );
    console.log(`🚀 ~ file: step-4.jsx:77 ~ response:`, response);
    return response.data;
  };
  const handleForm = async () => {
    console.log(`🚀 ~ file: step-4.jsx:45 ~ data:`, data);
    console.log(
      `🚀 ~ file: step-4.jsx:61 ~  !data.industry_type:`,
      !data.isTrial
    );
    if (data.packageInfo === undefined) {
      return "Please Select Plan And Package";
    }

    let totalPrice = getPriceMain * data?.count;
    const mainData = {
      ...data,
      packageInfo: data?.packageInfo?.packageName,
      totalPrice: totalPrice + totalPrice * 0.02,
    };

    console.log(`🚀 ~ file: step-4.jsx:67 ~ mainData:`, mainData);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization`,
      mainData,
      config
    );
    console.log(`🚀 ~ file: step-4.jsx:96 ~ response:`, response);
    return response.data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      console.log(`🚀 ~ file: step-4.jsx:87 ~ data:`, data);
      if (data?.paymentType === "Phone_Pay") {
        // window.location.href = data?.redirectUrl;
      } else {
        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Aegis Plan for software", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data.order.id, //This
          callback_url: data?.callbackURI,
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
          },
          notes: {
            address:
              "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
          },
          theme: {
            color: "#1976d2",
          },
          modal: {
            ondismiss: function () {
              mutate2(data.organization._id);
              console.log("Checkout form closed by the user");
            },
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      }
    },
    onError: async (data) => {
      console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);
      toast.error(
        data?.response?.data?.message || "Please fill all mandatory field"
      );
    },
  });
  const { mutate: mutate2, isLoading: isLoading2 } = useMutation({
    mutationFn: handleDismiss,
  });
  console.log(
    `🚀 ~ file: step-4.jsx:124 ~ data?.packageInfo:`,
    data?.packageInfo
  );
  const getPriceMain = useMemo(() => {
    const expirationDate = moment().add(3 * data?.cycleCount, "months");
    const dateDifference = expirationDate.diff(moment(), "days");
    if (data?.packageInfo?.packageName === "Basic Plan") {
      const perDayPrice = 55 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else if (data?.packageInfo?.packageName === "Intermediate Plan") {
      const perDayPrice = 85 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else {
      return 115;
    }
  }, [data?.cycleCount, data?.packageInfo?.packageName]);
  if (data?.packageInfo === undefined) {
    return "Please Select Plan And Package";
  }

  if (isLoading) {
    return <Loader />;
  }
  if (isLoading2) {
    return <Loader />;
  }

  return (
    <div className="px-4 grid bg-[#f8fafb] p-4 rounded-md items-center">
      <div className="p-4 gap-4 flex flex-col items-center">
        <div className=" ">
          <h2 className="text-2xl font-bold ">Your Package Pricing</h2>
          <p className=" text-gray-500">
            You have selected {data?.packageInfo?.packageName} Total price will
            be {getPriceMain * data?.count}
            {" Rs"}
          </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">
          <PricingCard
            setConfirmOpen={setConfirmOpen}
            h1={data?.packageInfo?.packageName}
            packageId={process.env.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
            value={data?.packageId}
            price={getPriceMain}
            mapArray={returnArray(data?.packageInfo?.packageName)}
            button={false}
          />
        </div>
        <div className="flex">
          <Button onClick={mutate} variant="contained">
            Submit
          </Button>
          <PackageInfo
            open={confirmOpen}
            handleClose={() => {
              setConfirmOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4;

const returnArray = (plan = "Basic Plan") => {
  if (plan === "Basic Plan") {
    return packageArray.filter((doc, index) => doc.Basic === "✓" && index <= 5);
  } else if (plan === "Intermediate Plan") {
    return packageArray
      .filter((doc, index) => doc.Intermediate === "✓" && index <= 5)
      .reverse();
  } else {
    return packageArray
      .filter((doc, index) => doc.Enterprise === "✓")
      .reverse()
      .filter((doc, index) => index <= 5);
  }
};
