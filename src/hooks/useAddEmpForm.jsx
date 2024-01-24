import { create } from "zustand";

const useAddEmpForm = create((set) => ({
  deptname: "",
  mgrempid: "",
  employmentType: "",
  designation: "",
  worklocation: "",
  salarystructure: "",

  setDeptName: (deptname) => set({ deptname }),
  setMgrEmpId: (mgrempid) => set({ mgrempid }),
  setEmploymentType: (employmentType) => set({ employmentType }),
  setSalaryStructure: (salarystructure) => set({ salarystructure }),
  setWorkLocation: (worklocation) => set({ worklocation }),
  setDesignation: (designation) => set({ designation }),
}));

export default useAddEmpForm;
