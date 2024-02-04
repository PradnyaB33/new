import { ErrorMessage } from "@hookform/error-message/dist";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarMonthOutlined,
  CorporateFare,
  Description,
  FactoryOutlined,
  LocalPostOffice,
  TodayOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useGetUser from "../../../hooks/Token/useUser";
import ImageInput from "./image-input";

const organizationSchema = z.object({
  orgName: z.string(),
  foundation_date: z.string(),
  web_url: z.string(),
  industry_type: z.enum(["Technology", "Finance", "Healthcare", "Education"]),
  email: z.string().email(),
  organization_linkedin_url: z.string(),
  location: z.string(),
  contact_number: z.string(),
  description: z.string(),
  creator: z.string(),
  logo_url: z.any(),
  isTrial: z.boolean(),
});
const Step1 = ({ nextStep }) => {
  const { decodedToken } = useGetUser();
  const {
    orgName,
    foundation_date,
    web_url,
    industry_type,
    email,
    organization_linkedin_url,
    location,
    contact_number,
    description,
    logo_url,
    creator,
    setStep1Data,
    setCreator,
    isTrial,
  } = useOrg();

  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      orgName: orgName,
      foundation_date: foundation_date,
      web_url: web_url,
      industry_type: industry_type,
      email: email,
      organization_linkedin_url: organization_linkedin_url,
      location: location,
      contact_number: contact_number,
      description: description,
      creator: creator === undefined ? setCreator(decodedToken) : creator,
      logo_url: logo_url,
      isTrial: isTrial,
    },
    resolver: zodResolver(organizationSchema),
  });
  const { errors } = formState;
  console.log(`🚀 ~ file: step-1.jsx:79 ~ errors:`, errors);
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-1.jsx:68 ~ data:`, data);
    setStep1Data(data);
    nextStep();
  };
  console.log(`🚀 ~ file: step-1.jsx:71 ~ errors:`, errors);
  console.log("getValues", getValues());
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <div className="space-y-1 w-full items-center flex flex-col ">
          <Controller
            control={control}
            name={"logo_url"}
            render={({ field }) => {
              return <ImageInput field={field} />;
            }}
          />
          <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={"logo_url"}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 px-4">
          <AuthInputFiled
            name="orgName"
            icon={CorporateFare}
            control={control}
            type="text"
            placeholder="Organisation Name"
            label="Organisation Name *"
            errors={errors}
            error={errors.name}
          />
          <AuthInputFiled
            name="foundation_date"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="Foundation Date"
            label="Foundation Date *"
            errors={errors}
            error={errors.foundation_date}
          />
          <AuthInputFiled
            name="web_url"
            icon={CorporateFare}
            control={control}
            type="text"
            placeholder="Web Url "
            label="Web Url  *"
            errors={errors}
            error={errors.web_url}
          />
          <AuthInputFiled
            name="organization_linkedin_url"
            icon={CorporateFare}
            control={control}
            type="text"
            placeholder="Linkding url "
            label="Linkding url  *"
            errors={errors}
            error={errors.organization_linkedin_url}
          />
          <AuthInputFiled
            name="industry_type"
            icon={FactoryOutlined}
            control={control}
            type="select"
            placeholder="Type of Industry "
            label="Type of Industry  *"
            errors={errors}
            error={errors.industry_type}
            options={[
              { value: "Technology", label: "Technology" },
              { value: "Finance", label: "Finance" },
              { value: "Healthcare", label: "Healthcare" },
              { value: "Education", label: "Education" },
            ]}
          />
          <AuthInputFiled
            name="email"
            icon={LocalPostOffice}
            control={control}
            type="email"
            placeholder="Organization Email "
            label="Organization Email  *"
            errors={errors}
            error={errors.email}
          />
          <AuthInputFiled
            name="contact_number"
            icon={FactoryOutlined}
            control={control}
            type="number"
            placeholder="Contact Number "
            label="Contact Number  *"
            errors={errors}
            error={errors.contact_number}
          />
          <AuthInputFiled
            name="description"
            icon={Description}
            control={control}
            type="text"
            placeholder="Organisational Description "
            label="Organisational Description  *"
            errors={errors}
            error={errors.description}
          />
          <AuthInputFiled
            name="location"
            icon={FactoryOutlined}
            control={control}
            type="not-select"
            placeholder="Location Addresss "
            label="Location Addresss  *"
            errors={errors}
            error={errors.location}
          />
          <div className=" mt-7">
            <AuthInputFiled
              name="isTrial"
              icon={CalendarMonthOutlined}
              control={control}
              type="checkbox"
              label="Do you want 7 day Trial  *"
              errors={errors}
              error={errors.location}
            />
          </div>
        </div>
        <Button type="submit" variant="contained" className="!w-max !mx-auto">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Step1;
