import axios from "axios";
import { useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";

const useVerifyUser = () => {
  const param = useParams();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const verifyEmailUrl = async () => {
    const url = `${process.env.REACT_APP_API}/route/employee/verify/${param.token}`;
    const { data } = await axios.get(url);
    console.log(data);
  };
  const { data, isLoading } = useQuery(`verification`, verifyEmailUrl, {
    onSuccess: (data) => {
      handleAlert(
        true,
        "success",
        "You are verified successfully now you can proceed to login"
      );
      navigate("/sign-in");
    },
    onError: (error) => {
      console.log(`🚀 ~ file: hook.jsx:17 ~ error:`, error);
      handleAlert(
        true,
        "error",
        `${error?.response?.data?.message} please raise request again` ||
          "Failed to sign in. Please try again."
      );
      navigate("/sign-in");
    },
  });
  return { data, isLoading };
};

export default useVerifyUser;
