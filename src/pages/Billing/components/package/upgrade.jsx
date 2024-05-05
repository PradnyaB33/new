import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined, Numbers } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import useManageSubscriptionMutation from "./subscription-mutaiton";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  width: 400,
  height: 500,
  overflow: "hidden",
};
const UpgradePackage = ({ handleClose, open, organisation }) => {
  const today = moment();
  const expirationDate = moment(
    organisation?.subscriptionDetails?.expirationDate
  );
  const paymentDate = moment(organisation?.subscriptionDetails?.paymentDate);
  const subscriptionDays = expirationDate.diff(paymentDate, "days");
  const totalUsedDay = paymentDate.diff(today, "days");
  const { verifyPromoCodeMutation } = useManageSubscriptionMutation();

  const packageSchema = z.object({
    memberCount: z
      .string()
      .refine((doc) => Number(doc) >= organisation?.memberCount, {
        message:
          "You can't decrease your member count while subscription is active but you can increase it.",
      }),
    packageInfo: z.object({
      value: z.string(),
      label: z.string(),
    }),
    promoCode: z.string().optional(),
    paymentType: z.enum(["Phone_Pay", "RazorPay"]),
    discount: z.number().optional(),
  });

  const { control, formState, handleSubmit, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        memberCount: `${organisation?.memberCount}` || "",
        packageInfo: {
          value: organisation?.packageInfo,
          label: organisation?.packageInfo,
        },
        paymentType: "RazorPay",
        discount: 0,
      },
      resolver: zodResolver(packageSchema),
    });
  console.log(`🚀 ~ file: upgrade.jsx:64 ~ getValues:`, getValues());

  const { errors, dirtyFields } = formState;
  const pack = watch("packageInfo").value;
  const memberCountWatch = watch("memberCount");
  const discountWatch = watch("discount");
  const getTotalPrice = React.useMemo(() => {
    const minusUnUsedDays = subscriptionDays - totalUsedDay;
    const perDayPrice =
      getPlanPrice(organisation?.packageInfo) / subscriptionDays;
    let totalPrice =
      memberCountWatch * getPrice(pack, expirationDate.diff(today, "days"));

    return Math.round(
      totalPrice -
        perDayPrice * minusUnUsedDays +
        totalPrice * 0.02 -
        (totalPrice * discountWatch) / 100
    );
  }, [
    memberCountWatch,
    pack,
    discountWatch,
    expirationDate,
    organisation?.packageInfo,
    subscriptionDays,
    today,
    totalUsedDay,
  ]);

  function onSubmit(data) {
    data.totalAmount = getTotalPrice;
    handleUpgradeFunction(data, organisation);
  }
  console.log(
    `🚀 ~ file: upgrade.jsx:209 ~ Object.keys(dirtyFields):`,
    Object.keys(dirtyFields)
  );
  return (
    <Modal
      keepMounted={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md flex flex-col relative"
      >
        <h1 className="p-4 text-xl font-semibold font-sans sticky top-0 bg-white z-10 shadow-inner border-b">
          Upgrade subscription
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-auto h-full"
          noValidate
        >
          <div className="flex flex-col gap-4 p-4 ">
            <AuthInputFiled
              name="memberCount"
              icon={Numbers}
              control={control}
              type="number"
              placeholder="Member Count "
              label="Member Count *"
              errors={errors}
              error={errors.memberCount}
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
          <div className="p-4 text-xl font-semibold font-sans sticky bottom-[-2px] bg-white z-10 shadow-inner border-b flex justify-between">
            <Button variant="outlined" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={
                Object.keys(dirtyFields)?.length > 1
                  ? Object.keys(dirtyFields)?.length === 1
                    ? Object.keys(dirtyFields).includes("promoCode")
                    : false
                  : true
              }
              type="submit"
            >
              Pay {getTotalPrice} Rs
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default UpgradePackage;
const getPrice = (plan, daysToEnd = 90) => {
  if (plan === "Basic Plan") {
    return Math.round(0.611 * daysToEnd);
  } else if (plan === "Intermediate Plan") {
    return Math.round(0.944 * daysToEnd);
  } else {
    return 115;
  }
};
const getPlanPrice = (plan) => {
  if (plan === "Basic Plan") {
    return Math.round(0.611 * 90);
  } else if (plan === "Intermediate Plan") {
    return Math.round(0.944 * 90);
  } else {
    return Math.round(115 * 90);
  }
};

const handleUpgradeFunction = (data, organisation) => {
  console.log(`🚀 ~ file: upgrade.jsx:219 ~ organisation:`, organisation);
  console.log(`🚀 ~ file: upgrade.jsx:219 ~ data:`, data);
  if (
    Number(data?.memberCount) !== organisation?.memberCount &&
    data?.packageInfo?.value !== organisation?.packageInfo
  ) {
    console.log("Both are different");
  } else if (
    Number(data?.memberCount) !== organisation?.memberCount &&
    data?.packageInfo?.value === organisation?.packageInfo
  ) {
    console.log("Member count is different");
  } else if (
    Number(data?.memberCount) === organisation?.memberCount &&
    data?.packageInfo?.value !== organisation?.packageInfo
  ) {
    console.log("Package is different");
  }
};
