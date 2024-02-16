import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import useOrg from "../../../State/Org/Org";
import Loader from "../../../components/app-loader/page";
import useGetUser from "../../../hooks/Token/useUser";
import { convertCamelToTitle } from "./step-3";

const Step4 = () => {
  const data = useOrg();
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
    if (data.data === undefined) {
      return "Please Select Plan And Package";
    }

    if (
      !data.logo_url ||
      !data.orgName ||
      !data.foundation_date ||
      !data.web_url ||
      !data.industry_type ||
      !data.email ||
      !data.location ||
      !data.contact_number ||
      !data.description ||
      !data.creator
    ) {
      console.log("Please fill all mandatory field");
      throw new Error("Please fill all mandatory field");
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
    formData.append("remotePunching", data.remotePunching);
    formData.append("performanceManagement", data.performanceManagement);
    formData.append("analyticsAndReporting", data.analyticsAndReporting);
    formData.append("skillMatrices", data.skillMatrices);
    formData.append("data", JSON.stringify(data.data));

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
        data?.response?.data?.message || "Please fill all madatory field"
      );
    },
  });
  const { mutate: mutate2, isLoading: isLoading2 } = useMutation({
    mutationFn: handleDismiss,
  });
  const valueObject = {
    memberCount: 40,
    remotePunchingCount: 1000,
    performanceManagementCount: 40,
    analyticsAndReportingCount: 40,
    skillMatricesCount: 40,
  };
  console.log(`🚀 ~ file: step-4.jsx:126 ~ data?.data:`, data?.data);
  if (data?.data === undefined) {
    return "Please Select Plan And Package";
  }

  if (isLoading) {
    return <Loader />;
  }
  if (isLoading2) {
    return <Loader />;
  }
  return (
    <div className="px-4 grid md:grid-cols-6 grid-cols-1 bg-[#f8fafb] p-4 rounded-md">
      <div className="grid md:col-span-2 col-span-1 items-center">
        <img src="/payment.svg" className="h-[100px]" alt="" />
      </div>
      <div className=" grid col-span-4 p-8 gap-2 grid-rows-3 md:grid-rows-4">
        <div className=" !row-span-1">
          <h2 className="text-2xl font-bold ">Your Package Pricing</h2>
          <p className=" text-gray-500">Organization Package </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">
          {Object.entries(data.data)
            .reverse()
            .map((doc) => {
              return (
                <Accordion className="">
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    {convertCamelToTitle(doc[0]) === "Member Count"
                      ? "Basic Package"
                      : convertCamelToTitle(doc[0])}
                  </AccordionSummary>
                  <AccordionDetails className="!px-4">
                    <div className="grid grid-cols-2 w-full">
                      <div className="col-span-1 text-left underline">
                        {" "}
                        {valueObject[doc[0]]}Rs × {doc[1]} Employees
                      </div>
                      <div className="col-span-1 text-center">
                        {" "}
                        {valueObject[doc[0]] * doc[1]}
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </div>
        <div className="row-span-1 items-center justify-center flex">
          <Button onClick={mutate} variant="contained">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
