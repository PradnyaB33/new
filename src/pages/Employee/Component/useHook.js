import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import { useQuery } from "react-query";

const useHook = () => {
  const authToken = useAuthToken();
  const organisationId = "65a7b30a2dde15339e25db3e";

  //get designation
  const getDesignation = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`,
      config
    );
    return data.data;
  };
  const { data: getDesignationData } = useQuery({
    queryKey: ["designation"],
    queryFn: getDesignation,
  });

  //pull location
  const getLocation = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
      config
    );
    return data.data;
  };

  const { data: getLocationData } = useQuery({
    queryKey: ["location"],
    queryFn: getLocation,
  });

  //pull emp type
  const getEmployementType = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
      config
    );
    return data.data;
  };

  const { data: getEmployementTypeData } = useQuery({
    queryKey: ["employementType"],
    queryFn: getEmployementType,
  });

  //   pull salary input
  const getSalaryInput = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`,
      config
    );
    return data.data;
  };

  const { data: getSalaryInputData } = useQuery({
    queryKey: ["salaryinput"],
    queryFn: getSalaryInput,
  });

  //   pull department
  const getDepartment = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
      config
    );
    return data.data;
  };
  const { data: getDepartmentData } = useQuery({
    queryKey: ["department"],
    queryFn: getDepartment,
  });

  //   pull profile data
  const getProfile = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/profile/role/${organisationId}`,
      config
    );
    const getProfileData = Object.entries(data.data.roles ?? {})
      .filter(([role, obj]) => obj.isActive === true)
      .map(([role, obj]) => ({
        roleName: role,
        isApprover: obj.isApprover,
        isActive: obj.isActive,
      }));

    return getProfileData;
  };

  const { data: getProfileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // pull input field
  const getInputField = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };
    let data = await axios.get(
      `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`,
      config
    );
    return data.data.inputField.inputDetail;
  };

  const { data: getInputFieldData } = useQuery({
    queryKey: ["inputfield"],
    queryFn: getInputField,
  });
  return {
    getDesignationData,
    getLocationData,
    getEmployementTypeData,
    getSalaryInputData,
    getDepartmentData,
    getProfileData,
    getInputFieldData,
  };
};

export default useHook;
