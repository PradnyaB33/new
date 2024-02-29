import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
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
  const handleDismiss = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    };
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/organization/delete/${id}`,
      config
    );
    console.log(`🚀 ~ file: step-4.jsx:77 ~ response:`, response);
    return response.data;
  };
  const handleForm = async () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: authToken,
      },
    };

    console.log(`🚀 ~ file: step-4.jsx:45 ~ data:`, data);
    console.log(
      `🚀 ~ file: step-4.jsx:61 ~  !data.industry_type:`,
      !data.isTrial
    );
    if (data.packageInfo === undefined) {
      return "Please Select Plan And Package";
    }

    const formData = new FormData();

    // Append file to FormData
    formData.append("logo_url", data.logo_url);
    formData.append("orgName", data.orgName);
    formData.append("foundation_date", data.foundation_date);
    formData.append("web_url", data.web_url);
    formData.append("industry_type", data.industry_type);
    formData.append("email", data.email);
    formData.append("isTrial", data.isTrial);
    formData.append(
      "organization_linkedin_url",
      data.organization_linkedin_url
    );
    formData.append("location", data.location);
    formData.append("contact_number", data.contact_number);
    formData.append("description", data.description);
    formData.append("creator", data.creator);
    formData.append("packageId", data.packageId);
    formData.append("count", data.count);

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization`,
      formData,
      config
    );
    console.log(`🚀 ~ file: step-4.jsx:96 ~ response:`, response);
    return response.data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      const options = {
        key: data?.key,
        amount: "50000",
        currency: "INR",
        name: "Aegis Plan for software", //your business name
        description: "Get Access to all premium keys",
        image: data.organisation.image,
        subscription_id: data.subscription_id, //This
        callback_url: `${process.env.REACT_APP_API}/route/organization/verify/${data.organisation._id}`,
        prefill: {
          name: `${decodedToken.user.first_name} ${decodedToken.user.last_name}`, //your customer's name
          email: decodedToken.user.email,
          contact: decodedToken.user.phone_number,
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
            mutate2(data.organisation._id);
            console.log("Checkout form closed by the user");
          },
        },
      };
      const razor = new window.Razorpay(options);
      console.log(`🚀 ~ file: step-4.jsx:111 ~ razor:`, razor);
      razor.open();
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

  console.log(`🚀 ~ file: step-4.jsx:126 ~ data?.data:`, data?.data);
  if (data?.packageInfo === undefined) {
    return "Please Select Plan And Package";
  }

  if (isLoading) {
    return <Loader />;
  }
  if (isLoading2) {
    return <Loader />;
  }
  console.log(
    `🚀 ~ file: step-4.jsx:150 ~ getPrice(data?.packageInfo?.packageName):`,
    getPrice(data?.packageInfo?.packageName)
  );
  console.log(
    `🚀 ~ file: step-4.jsx:172 ~ data?.packageInfo?.packageName:`,
    data?.packageInfo?.packageName
  );
  return (
    <div className="px-4 grid bg-[#f8fafb] p-4 rounded-md items-center">
      <div className="p-8 gap-2 flex flex-col items-center">
        <div className=" ">
          <h2 className="text-2xl font-bold ">Your Package Pricing</h2>
          <p className=" text-gray-500">You have selected Basic Package </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">
          <PricingCard
            setConfirmOpen={setConfirmOpen}
            h1={data?.packageInfo?.packageName}
            packageId={process.env.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
            value={data?.packageId}
            price={getPrice(data?.packageInfo?.packageName)}
            mapArray={returnArray(data?.packageInfo?.packageName)}
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
    return packageArray.filter((doc, index) => doc.Basic === "✓" && index < 5);
  } else if (plan === "Intermediate Plan") {
    return packageArray
      .filter((doc, index) => doc.Intermediate === "✓" && index < 5)
      .reverse();
  } else {
    return packageArray
      .filter((doc, index) => doc.Enterprise === "✓")
      .reverse()
      .filter((doc, index) => index < 5);
  }
};
const getPrice = (plan) => {
  if (plan === "Basic Plan") {
    return 55;
  } else if (plan === "Intermediate Plan") {
    return 85;
  } else {
    return 115;
  }
};
