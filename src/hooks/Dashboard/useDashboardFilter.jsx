import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

export default function useDashboardFilter(organisationId) {
  const authToken = useAuthToken();
  // States for filter select filed and chhange data
  const [department, setDepartment] = useState("");
  const [manager, setManager] = useState("");
  const [locations, setLocations] = useState("");
  const [data, setData] = useState([]);
  const [date, setDate] = useState(2024);
  console.log(`🚀 ~ file: useDashboardFilter.jsx:14 ~ setDate:`, setDate);
  const [salaryData, setSalaryData] = useState([]);

  // Card Data
  const { data: absentEmployee } = useQuery(
    ["absents", organisationId],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/getAbsent/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (error) {}
    }
  );

  // Department data
  const getAPIData = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: Department, isLoading: departmentLoading } = useQuery(
    ["departments-data", organisationId],
    () =>
      getAPIData(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`
      )
  );

  const { data: location, isLoading: locationLoading } = useQuery(
    ["organization-locations", organisationId],
    () =>
      getAPIData(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`
      )
  );

  //  Manager data
  const getManagerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-manager/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response?.data?.manager;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: Managers, isLoading: managerLoading } = useQuery(
    ["all-manager", organisationId],
    getManagerData
  );

  // Options
  const Departmentoptions = Department?.department?.map((item) => {
    return {
      value: item?._id,
      label: item?.departmentName,
    };
  });

  const managerOptions = Managers?.map((item) => {
    return {
      value: item?.managerId?._id,
      label: `${item?.managerId?.first_name} ${item?.managerId?.last_name}`,
    };
  });

  const locationOptions = location?.locationsData?.map((item, id) => {
    return {
      value: item._id,
      label: item.shortName,
    };
  });

  // Styles
  const customStyles = {
    control: (base) => ({
      ...base,
      border: 0,
      background: "#f9fafb",
      boxShadow: "none",
      hover: {
        cursor: "pointer !important",
      },
    }),
    menu: (base) => ({
      ...base,
      width: "max-content",
      minWidth: "100%",
      right: 0,
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#000",
      };
    },
  };

  // Dashboard attendence Filterd data
  async function getAttendenceData(endPoint) {
    try {
      const { data } = await axios.get(`${endPoint}`, {
        headers: {
          Authorization: authToken,
        },
      });
      const currentYear = new Date().getFullYear();
      const filterData = data.filter((item) => item.year === currentYear);

      return filterData;
    } catch (error) {
      console.log(error);
    }
  }

  const { isLoading: oraganizationLoading } = useQuery(
    ["organization-attenedence", organisationId],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getOrganizationAttendece/${organisationId}/${date}`
      ),
    {
      onSuccess: (organizationAttendenceData) => {
        setData(organizationAttendenceData);
      },
      enabled: !department && !locations,
      staleTime: 0,
    }
  );

  useQuery(
    ["department-attenedence", department],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getDepartmentAttendece/${department}`
      ),
    {
      onSuccess: (attendenceData) => setData(attendenceData),
      enabled: !!department,
    }
  );

  useQuery(
    ["manager-attenedence", manager],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getManagerEmployeeAttendence/${manager}`
      ),
    {
      onSuccess: (attendenceData) => setData(attendenceData),
      enabled: !!manager,
    }
  );

  useQuery(
    ["location-attenedence", locations],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getLocationAttendece/${locations}`
      ),
    {
      onSuccess: (attendenceData) => setData(attendenceData),
      enabled: !!locations,
    }
  );

  //! Salary Area Graph Data For filter data
  // Dashboard Filterd data
  async function getSalaryData(endPoint) {
    try {
      const { data } = await axios.get(`${endPoint}`, {
        headers: {
          Authorization: authToken,
        },
      });
      // const currentYear = new Date().getFullYear();
      // const filterData = data.filter((item) => item.year === currentYear);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  useQuery(
    ["Org-Salary-overview", organisationId],
    () =>
      getSalaryData(
        `${process.env.REACT_APP_API}/route/employeeSalary/organizationSalaryOverview/${organisationId}`
      ),
    {
      onSuccess: (organizationAttendenceData) => {
        setSalaryData(organizationAttendenceData);
      },
      enabled: !department && !locations,
      staleTime: 0,
    }
  );

  useQuery(
    ["department-salary", department],
    () =>
      getSalaryData(
        `${process.env.REACT_APP_API}/route/employeeSalary/departmentSalaryOverview/${department}`
      ),
    {
      onSuccess: (organizationAttendenceData) => {
        setSalaryData(organizationAttendenceData);
      },
      enabled: !!department,
    }
  );

  useQuery(
    ["manager-salary", manager],
    () =>
      getSalaryData(
        `${process.env.REACT_APP_API}/route/employeeSalary/managerSalaryOverview/${manager}`
      ),
    {
      onSuccess: (organizationAttendenceData) => {
        setSalaryData(organizationAttendenceData);
      },
      enabled: !!manager,
    }
  );

  useQuery(
    ["location-salary", locations],
    () =>
      getSalaryData(
        `${process.env.REACT_APP_API}/route/employeeSalary/locationSalaryOverview/${locations}`
      ),
    {
      onSuccess: (organizationAttendenceData) => {
        setSalaryData(organizationAttendenceData);
      },
      enabled: !!locations,
    }
  );

  return {
    // data for select fileds and super admin cards
    Department,
    Managers,
    location,

    // loading
    departmentLoading,
    locationLoading,
    managerLoading,

    // options
    locationOptions,
    managerOptions,
    Departmentoptions,
    oraganizationLoading,

    getAttendenceData,

    // Style
    customStyles,

    // States
    data,
    date,
    setData,
    locations,
    setLocations,
    manager,
    setManager,
    department,
    setDepartment,

    // TODO
    salaryData,

    // CardsData
    absentEmployee,
  };
}
