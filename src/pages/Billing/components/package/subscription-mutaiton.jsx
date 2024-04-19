import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useGetUser from "../../../../hooks/Token/useUser";

const useManageSubscriptionMutation = () => {
  const { authToken, decodedToken } = useGetUser();
  const queryClient = useQueryClient();
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
        console.log(`🚀 ~ file: subscription-mutaiton.jsx ~ error:`, error);
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

  return { updateMemberCount, updatePlan, createPrePaidPlan };
};

export default useManageSubscriptionMutation;
