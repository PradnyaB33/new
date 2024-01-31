import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import axios from "axios";
import React from "react";
import useOrg from "../../../State/Org/Org";
import useGetUser from "../../../hooks/Token/useUser";
import { convertCamelToTitle } from "./step-3";

const Step4 = () => {
  const data = useOrg();
  const { authToken, decodedToken } = useGetUser();
  console.log(`🚀 ~ file: step-4.jsx:17 ~ decodedToken:`, decodedToken.user);
  console.log(
    `🚀 ~ file: step-4.jsx:60 ~ handleFom.data.logo_url:`,
    data.logo_url
  );
  console.log(`🚀 ~ file: step-4.jsx:14 ~ data:`, data);
  const valueObject = {
    memberCount: 40,
    remotePunchingCount: 1000,
    performanceManagementCount: 40,
    analyticsAndReportingCount: 40,
    skillMatricesCount: 40,
  };
  if (data.data === undefined) {
    return "Please Select Plan And Package";
  }

  const handleFom = async () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: authToken,
      },
    };

    if (data.data === undefined) {
      return "Please Select Plan And Package";
    }

    console.log(`🚀 ~ file: step-4.jsx:106 ~ data.logo_url:`, data.logo_url);
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

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/organization`,
        formData,
        config
      );
      console.log(`🚀 ~ file: step-4.jsx:77 ~ response:`, response.data);
      const options = {
        key: response?.data?.key,
        amount: "50000",
        currency: "INR",
        name: "Aegis Plan for software", //your business name
        description: "Get Access to all premium keys",
        image: response.data.organisation.image,
        subscription_id: response.data.subscription_id, //This
        callback_url: `${process.env.REACT_APP_API}/verification`,
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
      };
      const razor = new window.Razorpay(options);
      razor.open();
      console.log(`🚀 ~ file: step-4.jsx:31 ~ response:`, response);
    } catch (error) {
      console.error(`Error during POST request:`, error);
      // Handle error as needed
    }
  };

  return (
    <div className="px-4 grid grid-cols-6 bg-[#f8fafb] p-4 rounded-md">
      <div className="grid col-span-2">
        <img src="/payment.svg" alt="" />
      </div>
      <div className=" grid col-span-4 p-8 gap-2 grid-rows-4">
        <div className=" !row-span-1">
          <h2 className="text-2xl font-bold ">Your Package Pricing</h2>
          <p className=" text-gray-500">Organisation Package </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">
          {Object.entries(data.data)
            .reverse()
            .map((doc) => {
              console.log(`🚀 ~ file: step-4.jsx:17 ~ doc:`, doc);
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
          <Button onClick={handleFom} variant="contained">
            Confirm And Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
