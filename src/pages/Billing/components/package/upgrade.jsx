import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined, Numbers } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import useManageSubscriptionMutation from "./subscription-mutaiton";

const UpgradePackage = ({ handleClose, open, organisation }) => {
  const [amount, setAmount] = React.useState(0);
  const { verifyPromoCodeMutation, handleUpgradeFunction } =
    useManageSubscriptionMutation();

  const packageSchema = z.object({
    employeeToAdd: z
      .string()
      .min(0)
      .refine(
        (value) => {
          // spaces not aloud
          value = value.replace(/\s/g, "");
          // check if value is not empty
          return (
            value.length > 0 && !isNaN(Number(value)) && Number(value) >= 0
          );
        },
        { message: "Employee to add should be a greater than 0" }
      ),

    packageInfo: z.object({
      value: z.string(),
      label: z.string(),
      isDisabled: z.boolean().optional(),
    }),
    promoCode: z.string().optional(),
    paymentType: z.enum(["Phone_Pay", "RazorPay"]),
    discount: z.number().optional(),
  });

  const { control, formState, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      employeeToAdd: `0` || "",
      packageInfo: {
        value: organisation?.packageInfo,
        label: organisation?.packageInfo,
        isDisabled: false,
      },
      paymentType: "RazorPay",
      discount: 0,
    },
    resolver: zodResolver(packageSchema),
  });
  const { errors, dirtyFields } = formState;

  async function onSubmit(data) {
    data.totalAmount = amount;
    handleUpgradeFunction(data, organisation);
  }

  // const checkCallback = useCallback(() => {
  //   // on package change update the per day value
  //   let perDayValue = 0;
  //   if (watch("packageInfo").value === "Basic Plan") {
  //     perDayValue =
  //       Number(process.env.REACT_APP_BASIC_PACKAGE_COST_DAY) /
  //       moment().daysInMonth();
  //   } else if (watch("packageInfo").value === "Intermediate Plan") {
  //     perDayValue =
  //       Number(process.env.REACT_APP_INTERMEDIATE_PACKAGE_COST_DAY) /
  //       moment().daysInMonth();
  //   } else {
  //     perDayValue =
  //       Number(process.env.REACT_APP_ENTERPRIZE_PACKAGE_COST_DAY) /
  //       moment().daysInMonth();
  //   }
  //   return (
  //     perDayValue *
  //     moment(organisation?.subscriptionDetails?.expirationDate).diff(
  //       moment(),
  //       "days"
  //     )
  //   );
  // }, [
  //   watch("packageInfo"),
  //   watch("memberCount"),
  //   watch("promoCode"),
  //   watch("paymentType"),
  //   watch,
  // ]);
  const packageInfo = watch("packageInfo").value;
  const employeeToAdd = Number(watch("employeeToAdd"));
  console.log(`🚀 ~ file: upgrade.jsx:97 ~ employeeToAdd:`, employeeToAdd);
  const expirationDate = organisation?.subscriptionDetails?.expirationDate;

  useEffect(() => {
    let perDayValue = 0;
    let remainingDays = moment(expirationDate).diff(moment(), "days");

    if (packageInfo === "Basic Plan") {
      perDayValue = 0.611;
    } else if (packageInfo === "Intermediate Plan") {
      perDayValue = 0.944;
    } else {
      perDayValue = 1.277;
    }
    setAmount(Math.round(perDayValue * employeeToAdd * remainingDays));
  }, [employeeToAdd, packageInfo, expirationDate]);

  const checkDisability = () => {
    if (Object.keys(dirtyFields).length <= 1) {
      if (Object.keys(dirtyFields).includes("promoCode")) {
        return true;
      } else {
        if (Object.keys(dirtyFields).length === 0) {
          return true;
        }
        return false;
      }
    } else {
      return false;
    }
  };
  return (
    <ReusableModal
      heading={"Upgrade subscription"}
      open={open}
      onClose={handleClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-auto h-full gap-4 flex-col flex"
      >
        <div className="flex flex-col">
          <AuthInputFiled
            name="employeeToAdd"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Employee To Add "
            label="Employee To Add *"
            errors={errors}
            error={errors.employeeToAdd}
          />
          <AuthInputFiled
            name="packageInfo"
            icon={Numbers}
            control={control}
            type="select"
            placeholder="Package Name "
            label="Package Name *"
            errors={errors}
            error={errors.packageInfo}
            options={[
              { value: "Intermediate Plan", label: "Intermediate Plan" },
              {
                value: "Basic Plan",
                label: "Basic Plan",
                isDisabled:
                  organisation?.packageInfo === "Intermediate Plan"
                    ? true
                    : false,
              },
            ]}
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
            descriptionText={"Additional 2% charges on razorpay transaction"}
          />
          <AuthInputFiled
            name="promoCode"
            icon={Numbers}
            control={control}
            type="input-action"
            placeholder="#summer2021"
            label="Promo Code"
            errors={errors}
            readOnly={watch("discount") > 0}
            error={errors.promoCode}
            descriptionText={
              watch("discount")
                ? `You will get ${watch(
                    "discount"
                  )}% discount on your total amount.`
                : ""
            }
            onInputActionClick={(value) => {
              verifyPromoCodeMutation({ promoCode: value, setValue });
            }}
            onInputActionClear={() => {
              setValue("discount", 0);
              setValue("promoCode", "");
            }}
          />
        </div>
        <div className="gap-4 flex w-full">
          <Button
            variant="contained"
            disabled={amount === 0}
            type="submit"
            className="!w-full"
          >
            Pay {amount} Rs
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default UpgradePackage;
// const getPrice = (plan, daysToEnd = 90) => {
//   if (plan === "Basic Plan") {
//     return Math.round(0.611 * daysToEnd);
//   } else if (plan === "Intermediate Plan") {
//     return Math.round(0.944 * daysToEnd);
//   } else {
//     return 115;
//   }
// };
// const getPlanPrice = (plan) => {
//   if (plan === "Basic Plan") {
//     return Math.round(0.611 * 90);
//   } else if (plan === "Intermediate Plan") {
//     return Math.round(0.944 * 90);
//   } else {
//     return Math.round(115 * 90);
//   }
// };
