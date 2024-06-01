import useEmpQuery from "./useEmpQuery";

const useEmpOption = (organisationId) => {
  const {
    DepartmentListCall,
    DesignationCall,
    SalaryTempCall,
    EmpTypesCall,
    // InputFieldCall,
    ManagerListCall,
    ShiftCall,
    CostNumberCall,
    EmpRoleListCall,
    // AdditionalListCall,
    LocationListCall,
    EmpCodeCall,
  } = useEmpQuery(organisationId);

  console.log("id", organisationId);

  const DepartmentList = DepartmentListCall();
  const ManagerList = ManagerListCall();
  const empCode = EmpCodeCall();
  const empRolesList = EmpRoleListCall();
  const shiftList = ShiftCall();
  const costNumber = CostNumberCall();
  const locationList = LocationListCall();
  const SalaryTemp = SalaryTempCall();
  const DesignationList = DesignationCall();
  const empTypes = EmpTypesCall();

  const Departmentoptions = DepartmentList?.department?.map((item) => {
    return {
      value: item?._id,
      label: item?.departmentName,
    };
  });

  const Manageroptions = ManagerList?.manager?.map((item) => {
    console.log("item",item)
    return {
      value: item?._id,
      label: `${item?.managerId?.first_name} ${item?.managerId?.last_name}`,
    };
  });

  console.log(`🚀 ~ Manageroptions:`, Manageroptions);
  const EmpCodeoptions = empCode?.EmpCodeoptions?.map((item) => {
    return {
      value: item?._id,
      label: item?.getEmployeeCode,
    };
  });

  const RolesOptions =
    empRolesList?.roles &&
    Object.entries(empRolesList?.roles)
      .filter(([key, other], index) => other?.isActive)
      .map(([key, other], index) => {
        return {
          value: key, // Extract the _id property from the role object
          label: key, // Use the role name as the label
        };
      });
  // const RolesOptions =
  //   empRolesList?.roles &&
  //   Object.entries(empRolesList?.roles).map(([key, other], index) => {
  //     console.log(`🚀 ~ file: useEmpOption.jsx:54 ~ other:`, other);
  //     console.log(`🚀 ~ file: useEmpOption.jsx:54 ~ key:`, key);
  //     console.log(
  //       `🚀 ~ file: useEmpOption.jsx:57 ~ other?.isActive :`,
  //       other?.isActive
  //     );
  //     if (other?.isActive === true) {
  //       return {
  //         value: key, // Extract the _id property from the role object
  //         label: key, // Use the role name as the label
  //       };
  //     } else {
  //       return null;
  //     }
  //   });
  console.log(`🚀 ~ file: useEmpOption.jsx:52 ~ RolesOptions:`, RolesOptions);
  const Shiftoptions = shiftList?.shifts?.map((item) => {
    return {
      value: item?._id,
      label: item?.shiftName,
    };
  });

  const cosnotoptions = costNumber?.data?.departments?.map((item) => {
    return {
      value: item?._id,
      label: item?.dept_cost_center_id,
    };
  });

  const locationoption = locationList?.locationsData?.map((item) => {
    return {
      value: item?._id,
      label: item?.city,
    };
  });
  const salaryTemplateoption = SalaryTemp?.salaryTemplates?.map((item) => {
    return {
      value: item?._id,
      label: item?.name,
    };
  });

  const empTypesoption = empTypes?.empTypes?.map((item) => {
    return {
      value: item?._id,
      label: item?.title,
    };
  });

  const Designationoption = DesignationList?.designations?.map((item) => {
    return {
      value: item?._id,
      label: item?.designationName,
    };
  });

  return {
    Departmentoptions,
    Manageroptions,
    EmpCodeoptions,
    RolesOptions,
    Shiftoptions,
    cosnotoptions,
    locationoption,
    salaryTemplateoption,
    empTypesoption,
    Designationoption,
  };
};

export default useEmpOption;
