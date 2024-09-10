import { zodResolver } from "@hookform/resolvers/zod";
import {
  Business,
  CalendarMonthOutlined,
  Description,
  FactoryOutlined,
  Link,
  LocalPostOfficeOutlined,
  LocationOn,
  Phone,
  TodayOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { FaLinkedin } from "react-icons/fa";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useGetUser from "../../../hooks/Token/useUser";

// to define the schema for organization validation
const organizationSchema = z.object({
  orgName: z
    .string()
    .max(32, { message: "Name must be at least 32 characters" }),
  foundation_date: z.string().refine(
    (date) => {
      const currentDate = new Date().toISOString().split("T")[0];
      return date <= currentDate;
    },
    { message: "Foundation date must be less than or equal to current date" }
  ),
  web_url: z.string(),
  industry_type: z.enum(["Technology", "Finance", "Healthcare", "Education"]),
  email: z.string().email(),
  organization_linkedin_url: z.string(),
  location: z
    .any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    })
    .refine(
      (val) => {
        return (
          val.address !== ("" || undefined) &&
          val.position.lat !== 0 &&
          val.position.lng !== 0
        );
      },
      { message: "Location is required" }
    ),
  contact_number: z
    .string()
    .max(10, { message: "contact number must be 10 digits" })
    .min(10, { message: "contact number must be 10 digits" }),
  description: z.string(),
  creator: z.string(),

  isTrial: z.boolean(),
});
const Step1 = ({ nextStep }) => {
  // to state, hook , import other funciton
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
    setStep1Data,
    isTrial,
  } = useOrg();

  // use useForm
  const { control, formState, handleSubmit, watch } = useForm({
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
      creator: decodedToken?.user?._id,
      isTrial: isTrial,
    },
    resolver: zodResolver(organizationSchema),
  });
  const { errors } = formState;

  //  define the onSubmit function
  const onSubmit = async (data) => {
    await setStep1Data(data);
    nextStep();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <div className="grid md:grid-cols-2 md:gap-4 gap-0 px-4 grid-cols-1">
          <AuthInputFiled
            name="orgName"
            icon={Business}
            control={control}
            type="text"
            placeholder="Organisation Name"
            label="Organisation Name *"
            errors={errors}
            error={errors.orgName}
          />
          <AuthInputFiled
            name="foundation_date"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="Foundation Date"
            label="Foundation Date *"
            max={new Date().toISOString().split("T")[0]}
            errors={errors}
            error={errors.foundation_date}
          />
          <AuthInputFiled
            name="web_url"
            icon={Link}
            control={control}
            type="text"
            placeholder="Web URL "
            label="Web URL  *"
            errors={errors}
            error={errors.web_url}
          />
          <AuthInputFiled
            name="organization_linkedin_url"
            icon={FaLinkedin}
            control={control}
            type="text"
            placeholder="LinkedIn URL "
            label="LinkedIn URL  *"
            errors={errors}
            error={errors.organization_linkedin_url}
          />
          <AuthInputFiled
            name="industry_type"
            icon={FactoryOutlined}
            control={control}
            type="naresh-select"
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
            icon={LocalPostOfficeOutlined}
            control={control}
            type="email"
            placeholder="Organisation Email "
            label="Organisation Email  *"
            errors={errors}
            error={errors.email}
          />
          <AuthInputFiled
            name="contact_number"
            icon={Phone}
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
            className="w-full"
            name="location"
            icon={LocationOn}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.location}
            value={watch("location")}
          />
          <div className=" mt-7">
            <AuthInputFiled
              name="isTrial"
              icon={CalendarMonthOutlined}
              control={control}
              type="checkbox"
              label="Do you want 7 day Trial"
              errors={errors}
              error={errors.location}
            />
          </div>
        </div>
        <Button type="submit" variant="contained" className="!w-max !mx-auto">
          Next
        </Button>
      </form>
    </div>
  );
};

export default Step1;
