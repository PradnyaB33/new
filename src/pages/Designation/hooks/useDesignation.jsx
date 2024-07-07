import axios from "axios";
import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useGetUser from "../../../hooks/Token/useUser";

const useDesignation = () => {
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();

  const getDesignation = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
    );

    return response.data.designations;
  };
  const { data: designation } = useQuery({
    queryKey: [`designation-list-${organisationId}`],
    queryFn: getDesignation,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!organisationId,
  });

  const addDesignation = async ({ data, onClose }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/designation/create`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { mutate: addDesignationMutation } = useMutation({
    mutationFn: addDesignation,
    onSuccess: async (data, { onClose }) => {
      console.log("Designation added successfully", data);
      onClose();
      await queryClient.invalidateQueries([
        `designation-list-${organisationId}`,
      ]);
      handleAlert(
        true,
        "success",
        data?.message || "Designation added successfully"
      );
    },
    onError: (error) => {
      console.error("Error adding designation", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Error adding designation"
      );
    },
  });

  return { designation, addDesignationMutation };
};

export default useDesignation;
