import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../../hooks/Token/useUser";

const useManageSubscriptionMutation = () => {
  const { authToken, decodedToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);

  const handleForm = async (data) => {
    console.log(`🚀 ~ file: subscription-mutaiton.jsx:48 ~ data:`, data);
    const result = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/organization-upgrade/${data?.organisationId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(`🚀 ~ file: subscription-mutaiton.jsx:57 ~ result:`, result);
    return result.data;
  };
  const { mutate } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      console.log(`🚀 ~ file: step-4.jsx:87 ~ data:`, data);
      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else {
        // throw new Error("Payment type not found");
        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Upgrading Plan with AEGIS", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data.order.id, //This
          callback_url: data?.callbackURI,
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
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
      }
    },
    onError: async (data) => {
      console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);

      handleAlert(
        true,
        "error",
        data?.response?.data?.message ?? "Please fill all mandatory field"
      );
    },
  });
  const renewHandleForm = async (data) => {
    console.log(`🚀 ~ file: subscription-mutaiton.jsx:48 ~ data:`, data);
    const result = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/organization-renew/${data?.organisationId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(`🚀 ~ file: subscription-mutaiton.jsx:57 ~ result:`, result);
    return result.data;
  };
  const { mutate: renewMutate } = useMutation({
    mutationFn: renewHandleForm,
    onSuccess: async (data) => {
      console.log(`🚀 ~ file: step-4.jsx:87 ~ data:`, data);
      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else {
        // throw new Error("Payment type not found");
        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Upgrading Plan with AEGIS", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data.order.id, //This
          callback_url: data?.callbackURI,
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
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
      }
    },
    onError: async (data) => {
      console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);

      handleAlert(
        true,
        "error",
        data?.response?.data?.message ?? "Please fill all mandatory field"
      );
    },
  });

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

  return {
    verifyPromoCodeMutation,
    mutate,
    renewMutate,
  };
};

export default useManageSubscriptionMutation;
