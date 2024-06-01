import useEmpQuery from "./useEmpQuery";

const useEmpOption = (organisationId) => {
  const {
    DepartmentListCall,
    DesignationCall,
    SalaryTempCall,
    EmpTypesCall,
    ManagerListCall,
    ShiftCall,
    CostNumberCall,
    EmpRoleListCall,
    LocationListCall,
    EmpCodeCall,
  } = useEmpQuery(organisationId);
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
    return {
      value: item?._id,
      label: `${item?.managerId?.first_name} ${item?.managerId?.last_name}`,
    };
  });

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
          value: key, 
          label: key, 
        };
      });
  

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
