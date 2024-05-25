import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../../hooks/Token/useUser";

const useManageSubscriptionMutation = () => {
  const { authToken, decodedToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const updateMemberCountWithAxios = async (data, handleClose) => {
    console.log(`🚀 ~ file: subscription-mutaiton.jsx ~ data:`, data);
    const result = await axios.patch(
      `${process.env.REACT_APP_API}/route/organization/${data?.organizationId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    result.data.handleClose = handleClose;
    return result.data;
  };
  const { mutate: updateMemberCount } = useMutation(
    updateMemberCountWithAxios,
    {
      onSuccess: async (data) => {
        console.log(`🚀 ~ file: subscription-mutaiton.jsx:25 ~ data:`, data);

        if (data?.status === "Pay") {
          const options = {
            key: data?.key,
            amount: Math.round(data?.paymentToComplete * 100),
            currency: "INR",
            name: "Aegis Plan for software", //your business name
            description: "Get Access to all premium keys",
            image: data?.organization?.image,
            order_id: data.order.id,
            callback_url: `${process.env.REACT_APP_API}/route/organization/member-count/verify/${data?.organization?._id}`,
            prefill: {
              name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
              email: decodedToken?.user?.email,
              contact: decodedToken?.user?.phone_number,
            },
            notes: {
              address:
                "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
            },
            // Oops! Something went wrong invalid amount (should be passed in interger paise . Minimum value is 100 paise ,i,e. ₹1)
            theme: {
              color: "#1976d2",
            },
            modal: {
              ondismiss: function () {
                // mutate2(data.organization._id);
                // console.log("Checkout form closed by the user");
              },
            },
          };

          const razor = new window.Razorpay(options);
          razor.open();
        }

        await queryClient?.invalidateQueries({ queryKey: ["orglist"] });
        data?.handleClose();
      },
      onError: (error) => {
        console.error(`🚀 ~ file: subscription-mutaiton.jsx ~ error:`, error);

        handleAlert(true, "error", error?.response?.data?.message);
      },
    }
  );

  const updatePlanWithAxios = async (data) => {
    console.log(`🚀 ~ file: subscription-mutaiton.jsx ~ data:`, data);
    const result = await axios.patch(
      `${process.env.REACT_APP_API}/route/organization/package/${data?.organizationId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    result.data.handleClose = data?.handleClose;
    return result.data;
  };

  const { mutate: updatePlan } = useMutation(updatePlanWithAxios, {
    onSuccess: async (data) => {
      if (data?.status === "Pay") {
        const options = {
          key: data?.key,
          currency: "INR",
          name: "Aegis Plan for software", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data.order.id,
          callback_url: `${process.env.REACT_APP_API}/route/organization/package-info/verify/${data?.organization?._id}`,
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
          },
          notes: {
            address:
              "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
          },
          // Oops! Something went wrong invalid amount (should be passed in interger paise . Minimum value is 100 paise ,i,e. ₹1)
          theme: {
            color: "#1976d2",
          },
          modal: {
            ondismiss: function () {
              // mutate2(data.organization._id);
              // console.log("Checkout form closed by the user");
            },
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }
      await queryClient?.invalidateQueries({ queryKey: ["orglist"] });
      data?.handleClose();
    },
    onError: (error) => {
      console.log(`🚀 ~ file: subscription-mutaiton.jsx ~ error:`, error);
    },
  });

  const createPrePaidPlanWithAxios = async (data) => {
    console.log(`🚀 ~ file: subscription-mutaiton.jsx:131 ~ data:`, data);
    const result = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/pre-paid/${data?.organizationId}`,
      data.data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    result.data.handleClose = data?.handleClose;
    return result.data;
  };

  const { mutate: createPrePaidPlan } = useMutation(
    createPrePaidPlanWithAxios,
    {
      onSuccess: async (data) => {
        if (data?.status === "Pay") {
          const options = {
            key: data?.key,
            currency: "INR",
            name: "Aegis Plan for software", //your business name
            description: "Get Access to all premium keys",
            image: data?.organization?.image,
            order_id: data.order.id,
            callback_url: `${process.env.REACT_APP_API}/route/organization/pre-paid/verify/${data?.organization?._id}/${data?.expirationDate}`,
            prefill: {
              name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
              email: decodedToken?.user?.email,
              contact: decodedToken?.user?.phone_number,
            },
            notes: {
              address:
                "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
            },
            // Oops! Something went wrong invalid amount (should be passed in interger paise . Minimum value is 100 paise ,i,e. ₹1)
            theme: {
              color: "#1976d2",
            },
            modal: {
              ondismiss: function () {
                // mutate2(data.organization._id);
                // console.log("Checkout form closed by the user");
              },
            },
          };

          const razor = new window.Razorpay(options);
          razor.open();
        }
        await queryClient?.invalidateQueries({ queryKey: ["orglist"] });
        data?.handleClose();
      },
      onError: (error) => {
        console.log(`🚀 ~ file: subscription-mutaiton.jsx ~ error:`, error);
      },
    }
  );

  const verifyPromoCode = async ({ promoCode, setValue }) => {
    console.log(
      `🚀 ~ file: subscription-mutaiton.jsx:203 ~ promoCode:`,
      promoCode
    );
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/promo-code/promo-code-verify/${promoCode}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(`🚀 ~ file: subscription-mutaiton.jsx:210 ~ result:`, result);
    return result.data;
  };

  const { mutate: verifyPromoCodeMutation } = useMutation(verifyPromoCode, {
    onSuccess: (data, { setValue }) => {
      console.log(`🚀 ~ file: subscription-mutaiton.jsx ~ data:`, data);
      handleAlert(true, "success", data?.message);
      setValue("discount", data?.promoCode?.discount);
    },
    onError: (error, { setValue }) => {
      console.log(
        `🚀 ~ file: subscription-mutaiton.jsx:219 ~ setValue:`,
        setValue
      );
      console.error(`🚀 ~ file: subscription-mutaiton.jsx ~ error:`, error);
      setValue("discount", 0);
      handleAlert(true, "error", error?.response?.data?.message);
    },
  });

  const getPackagePerDayCost = (packageInfo, days) => {
    switch (packageInfo) {
      case "Basic Plan":
        return 55 / days;
      case "Intermediate Plan":
        return 85 / days;
      case "Enterprise Plan":
        return 105 / days;
      default:
        return 0;
    }
  };

  const handleUpgradeFunction = async ({ data, organisation }) => {
    // console.log(
    //   `🚀 ~ file: subscription-mutaiton.jsx:245 ~ { data, organisation }:`,
    //   { data, organisation }
    // );
    let amount = 0;
    if (
      Number(data?.memberCount) !== Number(organisation?.memberCount) &&
      data?.packageInfo?.value !== organisation?.packageInfo
    ) {
      console.log("Both are different");
      amount = handleCountAndPackageFunction(data, organisation);
    } else if (
      Number(data?.memberCount) !== Number(organisation?.memberCount) &&
      data?.packageInfo?.value === organisation?.packageInfo
    ) {
      console.log("Member count is different");

      amount = handleMemberCountFunction(data, organisation);
    } else if (
      Number(data?.memberCount) === Number(organisation?.memberCount) &&
      data?.packageInfo?.value !== organisation?.packageInfo
    ) {
      console.log("Package is different");
      amount = handlePackageFunction(data, organisation);
    }
    return Math.round(Math.max(amount, 0));
  };

  const handleMemberCountFunction = (data, organisation) => {
    // Multiply member Count * Days to expire * Per day cost
    let oldPackage = organisation?.packageInfo;

    let oldMemberCount = organisation?.memberCount;
    let oldPaymentDate = moment(organisation?.subscriptionDetails?.paymentDate);
    let newMemberCount = data?.memberCount;

    let expirationDate = moment(
      organisation?.subscriptionDetails?.expirationDate
    );

    let perDayCost = getPackagePerDayCost(
      oldPackage,
      expirationDate.diff(oldPaymentDate, "days")
    );

    let remainingDays = expirationDate.diff(moment(), "days");

    let oldRemainingAmount = oldMemberCount * perDayCost * remainingDays;

    let newRemainingAmount = newMemberCount * perDayCost * remainingDays;

    let amount = newRemainingAmount - oldRemainingAmount;
    return amount;
  };

  const handlePackageFunction = (data, organisation) => {
    let oldPackage = organisation?.packageInfo;
    let newPackage = data?.packageInfo?.value;
    let totalDaysToExpire = moment(
      organisation?.subscriptionDetails?.expirationDate
    ).diff(moment(organisation?.subscriptionDetails?.paymentDate), "days");
    let oldPerDayCost = getPackagePerDayCost(oldPackage, totalDaysToExpire);
    let newPerDayCost = getPackagePerDayCost(newPackage, totalDaysToExpire);
    let remainingDays = moment(
      organisation?.subscriptionDetails?.expirationDate
    ).diff(moment(), "days");
    let oldRemainingAmount =
      organisation?.memberCount * remainingDays * oldPerDayCost;
    let newRemainingAmount =
      organisation?.memberCount * remainingDays * newPerDayCost;
    let amount = newRemainingAmount - oldRemainingAmount;
    return amount;
  };

  const handleCountAndPackageFunction = (data, organisation) => {
    let oldPackage = organisation?.packageInfo;

    let oldMemberCount = organisation?.memberCount;
    let newPackage = data?.packageInfo?.value;
    let newMemberCount = data?.memberCount;
    let totalDaysToExpire = moment(
      organisation?.subscriptionDetails?.expirationDate
    ).diff(moment(organisation?.subscriptionDetails?.paymentDate), "days");
    let oldPerDayCost = getPackagePerDayCost(oldPackage, totalDaysToExpire);
    let newPerDayCost = getPackagePerDayCost(newPackage, totalDaysToExpire);
    let remainingDays = moment(
      organisation?.subscriptionDetails?.expirationDate
    ).diff(moment(), "days");
    let oldRemainingAmount = oldMemberCount * remainingDays * oldPerDayCost;
    let newRemainingAmount = newMemberCount * remainingDays * newPerDayCost;
    let amount = newRemainingAmount - oldRemainingAmount;
    return amount;
  };
  return {
    updateMemberCount,
    updatePlan,
    createPrePaidPlan,
    verifyPromoCodeMutation,
    handleUpgradeFunction,
  };
};

export default useManageSubscriptionMutation;
