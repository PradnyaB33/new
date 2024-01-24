import { ErrorMessage } from "@hookform/error-message/dist";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CorporateFare,
  Description,
  FactoryOutlined,
  Favorite,
  LocalPostOffice,
  TodayOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useGetUser from "../../../hooks/Token/useUser";

const organizationSchema = z.object({
  name: z.string(),
  foundation_date: z.string(),
  web_url: z.string(),
  industry_type: z.enum(["Technology", "Finance", "Healthcare", "Education"]),
  email: z.string().email(),
  organization_linkedin_url: z.string(),
  organization_tagline: z.string(),
  location: z.string(),
  contact_number: z.string(),
  description: z.string(),
  creator: z.string(),
  logo_url: z
    .object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Please upload a valid image file.",
    }),
});
const Step1 = () => {
  const { authToken, decodedToken } = useGetUser();
  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      name: undefined,
      foundation_date: undefined,
      web_url: undefined,
      industry_type: "",
      email: undefined,
      organization_linkedin_url: undefined,
      organization_tagline: undefined,
      location: undefined,
      contact_number: undefined,
      description: undefined,
      creator: decodedToken?.user?._id,
      logo_url: undefined,
    },
    resolver: zodResolver(organizationSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-1.jsx:59 ~ data:`, data);
  };
  console.log(`🚀 ~ file: step-1.jsx:62 ~ getValues:`, getValues());
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1 w-full">
          <label
            htmlFor={"logo_url"}
            className={`${
              errors.logo_url || errors["logo_url"] ? "text-red-500" : ""
            } font-semibold text-gray-500 text-md`}
          >
            "sdflkas;f"
          </label>
          <Controller
            control={control}
            name={"logo_url"}
            render={({ field }) => (
              <>
                <div
                  className={` flex rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px] items-center`}
                >
                  <Favorite className="text-gray-700" />
                  <input
                    type={"file"}
                    placeholder={"placeholder"}
                    className={`
                      border-none bg-white w-full outline-none px-2`}
                    {...field}
                    formNoValidate
                  />
                </div>
              </>
            )}
          />
          <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={"name"}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 px-4">
          <AuthInputFiled
            name="name"
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
            name="location"
            icon={FactoryOutlined}
            control={control}
            type="not-select"
            placeholder="Location Addresss "
            label="Location Addresss  *"
            errors={errors}
            error={errors.location}
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
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Step1;
