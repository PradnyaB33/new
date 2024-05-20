import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useDelegateSuperAdmin = () => {
  const { authToken, decodedToken } = useGetUser();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const createDelegate = async (data) => {
    console.log(`🚀 ~ file: mutation.jsx:13 ~ data:`, data);
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/employee/delegate`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(`🚀 ~ file: mutation.jsx:23 ~ response:`, response);
    return response.data;
  };

  const addDelegateMutation = useMutation({
    mutationFn: createDelegate,
    onSuccess: async (data) => {
      console.log(data);
      handleAlert(true, "success", "Delegate super admin updated successfully");
      await queryClient.invalidateQueries({
        queryKey: [`delegate-super-admin-${decodedToken?.user?._id}`],
      });
    },
    onError: (data) => {
      console.error(`🚀 ~ file: mutation.jsx:37 ~ data:`, data);
      handleAlert(
        true,
        "error",
        data?.response?.data?.message || "Something went wrong"
      );
    },
  });

  const deleteDelegate = async ({ id, reset }) => {
    console.log(`🚀 ~ file: mutation.jsx:13 ~ id:`, id);
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/employee/delegate?employeeId=${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(`🚀 ~ file: mutation.jsx:23 ~ response:`, response);
    return response.data;
  };
  const deleteDelegateMutation = useMutation({
    mutationFn: deleteDelegate,
    onSuccess: async (data, variables) => {
      console.log(`🚀 ~ file: mutation.jsx:62 ~ variables:`, variables);
      console.log(data);
      handleAlert(true, "success", "Delegate super admin deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: [`delegate-super-admin-${decodedToken?.user?._id}`],
      });
    },
    onError: (data, variables, context) => {
      console.log(`🚀 ~ file: mutation.jsx:70 ~ context:`, context);
      console.log(`🚀 ~ file: mutation.jsx:70 ~ variables:`, variables);
      console.log(data);
    },
  });

  return {
    addDelegateMutation,
    deleteDelegateMutation,
  };
};

export default useDelegateSuperAdmin;
