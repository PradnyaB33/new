import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../Token/useUser";

const useDelegateSuperAdmin = () => {
  const { authToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);

  const createDelegate = async (data) => {
    console.log(`🚀 ~ file: mutation.jsx:13 ~ data:`, data);
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/employee/create/delegate`,
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
    onSuccess: (data) => {
      console.log(data);
      // queryClient.invalidateQueries({
      //   queryKey: [`subscription-${data.organisation._id}`],
      // });
      handleAlert({});
    },
    onError: (data) => {
      console.log(data);
    },
  });
  return {
    addDelegateMutation,
  };
};

export default useDelegateSuperAdmin;
