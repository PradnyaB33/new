import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calculate,
  FactoryOutlined,
  RecyclingRounded,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import { packagesArray } from "./data";

// to define the package count schema
const packageCountSchema = z.object({
  count: z
    .string()
    .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
  cycleCount: z.string().refine((doc) => Number(doc) > 0, {
    message: "Cycle Count is greater than 0",
  }),
  coupan: z.string().optional(),
  paymentType: z.enum(["Phone_Pay", "RazorPay"]),
  packages: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
});

const Step3 = ({ nextStep }) => {
  // to define the state , hook and import the other function
  const {
    count,
    setStep3Data,
    cycleCount,
    paymentType,
    packages,
    packageInfo,
    setVerifyToken,
    coupan,
  } = useOrg();

  // use useForm
  const { control, handleSubmit, formState, watch } =
    useForm({
      defaultValues: {
        count,
        cycleCount,
        paymentType,
        packages,
        coupan,
      },
      resolver: zodResolver(packageCountSchema),
    });
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const { errors } = formState;

  // to define the onSubmit function
  const onSubmit = async (data) => {
    setVerifyToken(null);
    if (watch("coupan") !== undefined && watch("coupan") !== "") {
      const checkToken = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/verify/coupon`,
        {
          coupan: data?.coupan,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (!checkToken?.data?.status) {
        handleAlert(
          true,
          "error",
          checkToken?.data?.message || "Invalid Token"
        );
        return false;
      }

      if (checkToken?.data?.status) {
        setVerifyToken(checkToken?.data?.verfiyCoupan);
        handleAlert(
          true,
          "success",
          checkToken?.data?.message || "Coupan code is correct"
        );
      }
    }

    setStep3Data(data);
    nextStep();
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <AuthInputFiled
          name="count"
          icon={Calculate}
          control={control}
          type="number"
          placeholder="Member Count"
          label="Member Count *"
          errors={errors}
          error={errors.count}
        />
        <AuthInputFiled
          name="cycleCount"
          icon={RecyclingRounded}
          control={control}
          type="number"
          placeholder="Cycle count used for recycle your subscription"
          label="Cycle Count *"
          errors={errors}
          error={errors.cycleCount}
          descriptionText={
            "if you select 2 then you will be charged every 3 months subscription with 2 cycle it mean it will be 6 months subscription just amount will be charged one time."
          }
        />
        <AuthInputFiled
          name="paymentType"
          icon={FactoryOutlined}
          control={control}
          type="naresh-select"
          placeholder="Select your Merchant"
          label="Payment Gateway *"
          errors={errors}
          error={errors.paymentType}
          options={[
            { value: "Phone_Pay", label: "Phone_Pay" },
            { value: "RazorPay", label: "RazorPay" },
          ]}
          descriptionText={"Additional 2% charges on every transaction"}
        />

        {packageInfo?.packageName === "Enterprise Plan" && (
          <AuthInputFiled
            name="packages"
            icon={FactoryOutlined}
            control={control}
            type="select"
            isMulti={true}
            options={packagesArray}
            placeholder="Ex: Remote Task"
            label="Select Package Addition "
            errors={errors}
            error={errors.packages}
          />
        )}

        <div className="my-2">
          <AuthInputFiled
            name="coupan"
            icon={FactoryOutlined}
            control={control}
            type="text"
            placeholder="Ex: ABCD12345A"
            label="Enter Coupon code "
            errors={errors}
            error={errors.coupan}
            descriptionText={"You can request for coupan code to get discount"}
          />
        </div>
        <Button type="submit" variant="contained" className="!w-max !mx-auto">
          Confirm & Pay
        </Button>
      </form>
    </div>
  );
};

export default Step3;
