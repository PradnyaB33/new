import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../../hooks/Token/useAuth";

const useDeleteLeave = ({ id }) => {
  console.log(`🚀 ~ id:`, id);
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();

  const deleteLeaveMutation = useMutation(
    async (data) => {
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave/delete/${id}`,

        {
          deleteReason: data?.deleteReason,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: (data, variable) => {
        variable?.onClose();
        handleAlert(true, "success", "Leave deleted successfully");
      },
      onError: (error) => {
        console.log(error);
        handleAlert(true, "error", "Failed to delete leave");
      },
    }
  );

  return { deleteLeaveMutation };
};

export default useDeleteLeave;
