
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Business,
  EmojiEmotions,
  LocationOn,
  Money,
  LocationSearching,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../../components/BasicButton";

const organizationSchema = z.object({
  allowance: z.boolean(),
  allowanceQuantity: z.string().refine(
    (doc) => {
      return Number(doc) >= 0 && Number(doc) < 100000;
    },
    {
      message: "The Allowance Quantity must be between 0 and 1,00,000",
    }
  ),
  dualWorkflow: z.boolean(),
  geoFencing: z.boolean(),
  faceRecognition: z.boolean(),
  geoFencingFullskape: z.boolean(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional(),
  notifyWhatsApp: z.boolean().optional(),
  parentPhoneNumber: z.string().optional(),
});

const MiniForm = ({ data, mutate }) => {
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      allowance: data?.remotePunchingObject?.allowance || false,
      allowanceQuantity: data?.remotePunchingObject?.allowanceQuantity
        ? `${data?.remotePunchingObject?.allowanceQuantity}`
        : "0",
      dualWorkflow: data?.remotePunchingObject?.dualWorkflow || false,
      geoFencing: data?.remotePunchingObject?.geoFencing || false,
      faceRecognition: data?.remotePunchingObject?.faceRecognition || false,
      geoFencingFullskape: data?.fullskapeDetails?.geoFencingFullskape || false,
      parentName: data?.fullskapeDetails?.parentName || "",
      parentEmail: data?.fullskapeDetails?.parentEmail || "",
      notifyWhatsApp: data?.fullskapeDetails?.notifyWhatsApp || false,
      parentPhoneNumber: data?.fullskapeDetails?.parentPhoneNumber || "",
    },
    resolver: zodResolver(organizationSchema),
  });

  const { errors } = formState;

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      allowanceQuantity: Number(formData.allowanceQuantity),
    };
    mutate(payload); // Updates the data with the new form data
  };

  const isFullskapeEnabled = watch("geoFencingFullskape");
  const wantsWhatsAppNotification = watch("notifyWhatsApp");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-4 gap-4">
        <AuthInputFiled
          name="dualWorkflow"
          icon={Business}
          control={control}
          type="checkbox"
          placeholder="Dual Workflow"
          label="Dual Workflow"
          errors={errors}
          error={errors.dualWorkflow}
          descriptionText={
            "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
          }
        />
        <AuthInputFiled
          name="allowance"
          icon={PriceChangeOutlinedIcon}
          control={control}
          type="checkbox"
          placeholder="Enable Extra Allowance"
          label="Enable Extra Allowance"
          errors={errors}
          error={errors.allowance}
          descriptionText={
            "Enabling allowance will allow the employee to get extra amount."
          }
        />
        <AuthInputFiled
          name="geoFencing"
          icon={LocationOn}
          control={control}
          type="checkbox"
          placeholder="Geo Fencing"
          label="Geo Fencing"
          errors={errors}
          error={errors.geoFencing}
          descriptionText={
            "Enabling Geo Fencing will allow the employee to punch in only from the allowed location."
          }
        />
        <AuthInputFiled
          name="faceRecognition"
          icon={EmojiEmotions}
          control={control}
          type="checkbox"
          placeholder="Geo Fencing Face Recognition"
          label="Geo Fencing Face Recognition"
          errors={errors}
          error={errors.faceRecognition}
          descriptionText={
            "Enabling Face Recognition will allow the employee to geo fencing in only after face recognition."
          }
        />
        <AuthInputFiled
          name="geoFencingFullskape"
          icon={LocationSearching}
          control={control}
          type="checkbox"
          placeholder="Geo Fencing with Fullskape"
          label="Geo Fencing with Fullskape"
          errors={errors}
          error={errors.geoFencingFullskape}
          descriptionText={
            "Enabling Fullskape will allow the updates to the parents."
          }
        />
        {watch("allowance") && (
          <AuthInputFiled
            name="allowanceQuantity"
            icon={Money}
            control={control}
            type="number"
            placeholder="Allowance"
            label="Allowance *"
            errors={errors}
            error={errors.allowanceQuantity}
          />
        )}
        {isFullskapeEnabled && (
          <div className="additional-fields">
            <AuthInputFiled
              name="parentName"
              control={control}
              type="text"
              placeholder="Parent Name"
              label="Parent Name *"
              errors={errors}
              error={errors.parentName}
            />
            <AuthInputFiled
              name="parentEmail"
              control={control}
              type="email"
              placeholder="Parent Email"
              label="Parent Email *"
              errors={errors}
              error={errors.parentEmail}
            />
            <AuthInputFiled
              name="notifyWhatsApp"
              control={control}
              type="checkbox"
              placeholder="WhatsApp Notification"
              label="Receive Notification on WhatsApp"
              errors={errors}
              error={errors.notifyWhatsApp}
            />
            {wantsWhatsAppNotification && (
              <AuthInputFiled
                name="parentPhoneNumber"
                control={control}
                type="text"
                placeholder="Phone Number with Country Code"
                label="Phone Number (with Country Code)"
                errors={errors}
                error={errors.parentPhoneNumber}
              />
            )}
          </div>
        )}
      </div>
      <div className="w-full flex justify-end">
        <BasicButton type="submit" title="Apply For Changes" />
      </div>
    </form>
  );
};

export default MiniForm;
