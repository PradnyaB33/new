import axios from "axios";
import { useMutation } from "react-query";
import useGetUser from "../../../../hooks/Token/useUser";

const useManageSubscriptionMutation = () => {
  const { authToken, decodedToken } = useGetUser();
  const updateMemberCountWithAxios = async (data) => {
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
    return result.data;
  };
  const { mutate: updateMemberCount } = useMutation(
    updateMemberCountWithAxios,
    {
      onSuccess: (data) => {
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
    return result.data;
  };

  const { mutate: updatePlan } = useMutation(updatePlanWithAxios, {
    onSuccess: (data) => {
      if (data?.status === "Pay") {
        const options = {
          key: data?.key,
          amount: Math.round(data?.paymentToComplete * 100),
          currency: "INR",
          name: "Aegis Plan for software", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data.order.id,
          callback_url: `${process.env.REACT_APP_API}/route/organization/package/verify/${data?.organization?._id}`,
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
        // razor.open();
      }
    },
    onError: (error) => {
      console.log(`🚀 ~ file: subscription-mutaiton.jsx ~ error:`, error);
    },
  });

  return { updateMemberCount, updatePlan };
};

export default useManageSubscriptionMutation;
