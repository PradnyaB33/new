import { ErrorMessage } from "@hookform/error-message/dist";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Business,
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
import { Controller, useForm } from "react-hook-form";
import { FaLinkedin } from "react-icons/fa";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useOrganisationMutation from "../../../hooks/QueryHook/Organisation/mutation";
import ImageInput from "../../AddOrganisation/components/image-input";
const organizationSchema = z.object({
  orgName: z.string(),
  foundation_date: z.string(),
  web_url: z.string(),
  industry_type: z.enum(["Technology", "Finance", "Healthcare", "Education"]),
  email: z.string().email(),
  organization_linkedin_url: z.string(),
  location: z.string(),
  contact_number: z
    .string()
    .max(10, { message: "contact number must be 10 digits" })
    .min(10, { message: "contact number must be 10 digits" }),
  description: z.string(),
  logo_url: z.any().refine(
    (file) => {
      if (typeof file === "string") {
        return true;
      }
      return !!file && file.size >= 5 * 1024 && file.size <= 50 * 1024;
    },
    { message: "Image size maximum 50kb and minimum 5kb" }
  ),
});
const EditOrganisation = ({ item, handleCloseConfirmation }) => {
  const { updateOrganizationMutation } = useOrganisationMutation();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      orgName: item?.orgName,
      foundation_date: item?.foundation_date,
      web_url: item?.web_url,
      industry_type: item?.industry_type,
      email: item?.email,
      organization_linkedin_url: item?.organization_linkedin_url,
      location: item?.location,
      contact_number: `${item?.contact_number}`,
      description: item?.description,
      creator: item?.decodedToken?.user?._id,
      logo_url: item?.logo_url,
      isTrial: item?.isTrial,
    },
    resolver: zodResolver(organizationSchema),
  });
  const onSubmit = async (data) => {
    console.log(`🚀 ~ file: edit-organization.jsx:45 ~ item:`, item);

    updateOrganizationMutation.mutate({
      id: item?._id,
      data,
      handleCloseConfirmation,
    });
  };
  const { errors } = formState;
  console.log(`🚀 ~ file: edit-organization.jsx:72 ~ errors:`, errors);

  return (
    <div className="flex flex-col gap-4 mt-3">
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
            errors={errors}
            error={errors.foundation_date}
          />
          <AuthInputFiled
            name="web_url"
            icon={Link}
            control={control}
            type="text"
            placeholder="Web Url "
            label="Web Url  *"
            errors={errors}
            error={errors.web_url}
          />
          <AuthInputFiled
            name="organization_linkedin_url"
            icon={FaLinkedin}
            control={control}
            type="text"
            placeholder="LinkedIn Url "
            label="LinkedIn Url  *"
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
            name="location"
            icon={LocationOn}
            control={control}
            type="not-select"
            placeholder="Location Address "
            label="Location Address  *"
            errors={errors}
            error={errors.location}
          />
        </div>
        <Button type="submit" variant="contained" className="!w-max !mx-auto">
          Next
        </Button>
      </form>
    </div>
  );
};

export default EditOrganisation;