import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";
import PackageInfo from "../../../components/Modal/PackagesModal/package-info";
import Loader from "../../../components/app-loader/page";
import useGetUser from "../../../hooks/Token/useUser";
import { packageArray } from "../../../utils/Data/data";
import PricingCard from "./step-2-components/pricing-card";

const Step4 = () => {
  // to define state , hook , import other function
  const [confirmOpen, setConfirmOpen] = useState(false);
  const data = useOrg();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const { authToken, decodedToken } = useGetUser();
  const config = {
    headers: {
      Authorization: authToken,
    },
  };

  // to define the handleForm function to add organization
  const handleForm = async () => {
    if (data.packageInfo === undefined) {
      return "Please Select Plan And Package";
    }

    let totalPrice = getPriceMain * data?.count;
    const mainData = {
      ...data,
      packageInfo: data?.packageInfo?.packageName,
      totalPrice: totalPrice + totalPrice * 0.02,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization`,
      mainData,
      config
    );
    return response.data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else if (data?.paymentType === "RazorPay") {
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
              console.log("Checkout form closed by the user");
            },
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        handleAlert(true, "success", data?.message);
        navigate("/organizationList");
      }
    },
    onError: async (data) => {
      console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);

      handleAlert(
        true,
        "error",
        data?.response?.data?.message || "Please fill all mandatory field"
      );
    },
  });

  // to define the function for package calculation
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
