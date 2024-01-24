import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, InputLabel, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import { z } from "zod";
import useHook from "./Component/useHook";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";

const AddEmployee = () => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const {
    getDesignationData,
    getLocationData,
    getEmployementTypeData,
    getSalaryInputData,
    getDepartmentData,
    getInputFieldData,
    getProfileData,
    getManagerData,
    addEmployeeMutate,
  } = useHook();

  const AddEmployeeSchema = z
    .object({
      first_name: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z]+$/),

      last_name: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z]+$/),
      phone_number: z
        .string()
        .min(10, { message: "Phone Number must be 10 digit" })
        .regex(/^[0-9]+$/),
      email: z.string().email(),

      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      confirmPassword: z.string(),
      bank_account_no: z.string(),
      empId: z.string(),
      companyemail: z.string().email(),
      citizenship: z.string(),
      date_of_birth: z.string(),
      joining_date: z.string(),
      address: z.string(),
      designation: z.string(),
      deptname: z.string(),
      salarystructure: z.string(),
      worklocation: z.string(),
      employmentType: z.string(),
      mgrempid: z.string(),
      profile: z.string(),
      gender: z.string(),
      "Shifts allocation": z.string(),
      "Department cost center no": z.string(),
      "Middle Name": z.string(),
      "Martial status": z.string(),
      "Primary nationality": z.string(),
      Education: z.string(),
      "Permanent Address": z.string(),
      "Adhar Card Number": z.string(),
      "Pan Card Number": z.string(),
      "Relative Information": z.string(),
      "Emergency contact": z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(AddEmployeeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
      bank_account_no: "",
      empId: "",
      companyemail: "",
      citizenship: "",
      address: "",
      date_of_birth: "",
      joining_date: "",
      designation: "",
      deptname: "",
      worklocation: "",
      salarystructure: "",
      employmentType: "",
      mgrempid: "",
      profile: "Employee",
      gender: "male",
    },
  });
  const onSubmit = async () => {
    console.log("Form submitted"); // Add this line
    const formData = getValues();
    console.log(formData);
    addEmployeeMutate(formData);
  };

  return (
    <>
      <div className="content-center  flex justify-center my-0 p-0">
        <div className="w-[700px] shadow-lg rounded-lg border py-3 px-8">
          <div className="flex items-center justify-center ">Add Employee</div>
          <form className="w-full  flex-1" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="first_name"
                control={control}
                type="text"
                placeholder="jhon"
                label="First Name *"
                errors={errors}
                error={errors.first_name}
              />

              <AuthInputFiled
                name="last_name"
                control={control}
                type="text"
                placeholder="smith"
                label="Last Name *"
                errors={errors}
                error={errors.last_name}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="phone_number"
                control={control}
                label={"Phone Number *"}
                type={"number"}
                errors={errors}
                error={errors.phone}
                placeholder={"123456789"}
              />
              <AuthInputFiled
                name="email"
                control={control}
                type="email"
                placeholder="test@gmai..."
                label="Email Address *"
                errors={errors}
                error={errors.email}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="password"
                control={control}
                type="password"
                placeholder="****"
                label="Password *"
                errors={errors}
                error={errors.password}
              />

              <AuthInputFiled
                name="confirmPassword"
                control={control}
                type="password"
                placeholder="****"
                label="Confirm Password *"
                errors={errors}
                error={errors.confirmPassword}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="bank_account_no"
                control={control}
                type="number"
                placeholder="1234"
                label="Bank Account No *"
                errors={errors}
                error={errors.bank_account_no}
              />

              <AuthInputFiled
                name="empId"
                control={control}
                type="text"
                placeholder="E1"
                label="Emp Id *"
                errors={errors}
                error={errors.empId}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="companyemail"
                control={control}
                type="email"
                placeholder="test@gmai..."
                label="Company Email Address *"
                errors={errors}
                error={errors.companyemail}
              />

              <AuthInputFiled
                name="citizenship"
                control={control}
                type="text"
                placeholder="indian"
                label="Citizenships"
                errors={errors}
                error={errors.citizenship}
              />
            </div>
            <AuthInputFiled
              name="address"
              control={control}
              type="text"
              placeholder="Pune"
              label="Address"
              errors={errors}
              error={errors.address}
            />
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="date_of_birth"
                control={control}
                type="date"
                placeholder="01/01/00..."
                label="Date of Birth *"
                errors={errors}
                error={errors.date_of_birth}
              />
              <AuthInputFiled
                name="joining_date"
                control={control}
                type="date"
                placeholder="01/01/00..."
                label="Joining Date *"
                errors={errors}
                error={errors.joining_date}
              />
            </div>

            <div className="flex items-center gap-2 mb-6">
              <FormControl className="w-80">
                <InputLabel id="demo-simple-select-label">
                  Select Department
                </InputLabel>
                <Controller
                  control={control}
                  name={"deptname"}
                  render={({ field }) => (
                    <Select {...field}>
                      {getDepartmentData && getDepartmentData?.department ? (
                        getDepartmentData?.department?.map((department) => (
                          <MenuItem key={department._id} value={department._id}>
                            {department?.departmentName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disable>
                          No departments available
                        </MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl className="w-80">
                <InputLabel id="demo-simple-select-label">
                  Select Designation
                </InputLabel>
                <Controller
                  control={control}
                  name={"designation"}
                  render={({ field }) => (
                    <Select {...field}>
                      {getDesignationData &&
                      getDesignationData?.designations ? (
                        getDesignationData?.designations?.map((designation) => (
                          <MenuItem
                            key={designation._id}
                            value={designation._id}
                          >
                            {designation?.designationName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No Designation available</MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <FormControl className="w-80">
                <InputLabel id="demo-simple-select-label">
                  Select WorK Location
                </InputLabel>
                <Controller
                  control={control}
                  name={"worklocation"}
                  render={({ field }) => (
                    <Select {...field}>
                      {getLocationData && getLocationData?.locationsData ? (
                        getLocationData?.locationsData?.map((location) => (
                          <MenuItem key={location._id} value={location._id}>
                            {location?.city}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No location available</MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl className="w-80">
                <InputLabel id="demo-simple-select-label">
                  Select Employement Type
                </InputLabel>
                <Controller
                  control={control}
                  name={"employmentType"}
                  render={({ field }) => (
                    <Select {...field}>
                      {getEmployementTypeData &&
                      getEmployementTypeData?.empTypes ? (
                        getEmployementTypeData?.empTypes?.map((empType) => (
                          <MenuItem key={empType._id} value={empType._id}>
                            {empType?.title}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem>No employement type available</MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <FormControl className="w-80">
                <InputLabel id="demo-simple-select-label">
                  Select Salary Template
                </InputLabel>
                <Controller
                  control={control}
                  name={"salarystructure"}
                  render={({ field }) => (
                    <Select {...field}>
                      {getSalaryInputData &&
                      getSalaryInputData?.salaryTemplates ? (
                        getSalaryInputData?.salaryTemplates.map(
                          (salaryTemplate) => (
                            <MenuItem
                              key={salaryTemplate._id}
                              value={salaryTemplate._id}
                            >
                              {salaryTemplate?.name}
                            </MenuItem>
                          )
                        )
                      ) : (
                        <MenuItem value="">
                          No salary template available
                        </MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl className="w-80">
                <InputLabel id="demo-simple-select-label">
                  Select Profile
                </InputLabel>
                <Controller
                  control={control}
                  name={"profile"}
                  render={({ field }) => (
                    <Select {...field}>
                      {getProfileData && getProfileData?.length > 0 ? (
                        getProfileData?.map((profile) => (
                          <MenuItem
                            key={profile.roleName}
                            value={profile.roleName}
                          >
                            {profile?.roleName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">
                          No salary template available
                        </MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
            <FormControl className="!w-full mb-6">
              <InputLabel id="demo-simple-select-label">
                Select Manager Name
              </InputLabel>
              <Controller
                control={control}
                name={"mgrempid"}
                render={({ field }) => (
                  <Select {...field}>
                    {getManagerData && getManagerData.length > 0 ? (
                      getManagerData.map((manager) =>
                        manager.managerId ? (
                          <MenuItem
                            key={manager._id}
                            value={manager.managerId._id}
                          >
                            {`${manager.managerId.first_name} ${manager.managerId.last_name}`}
                          </MenuItem>
                        ) : null
                      )
                    ) : (
                      <MenuItem value="" disabled>
                        No managers available
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
            </FormControl>
            <div className="mb-6">
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender </FormLabel>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <label className="inline-flex items-center">
                        <FormControlLabel
                          value="male"
                          control={<Radio className="text-blue-500" />}
                          label={<span className="ml-2 text-black">Male</span>}
                        />
                      </label>

                      <label className="inline-flex items-center">
                        <FormControlLabel
                          value="female"
                          control={<Radio className="text-blue-500" />}
                          label={
                            <span className="ml-2 text-black">Female</span>
                          }
                        />
                      </label>

                      <label className="inline-flex items-center">
                        <FormControlLabel
                          value="transgender"
                          control={<Radio className="text-blue-500" />}
                          label={
                            <span className="ml-2 text-black">Transgender</span>
                          }
                        />
                      </label>
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </div>
            <div className="flex flex-wrap gap-2">
              {getInputFieldData &&
                getInputFieldData?.length > 0 &&
                getInputFieldData?.map((item) => (
                  <Controller
                    key={item?._id}
                    control={control}
                    name={item?.label}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        key={item?._id}
                        size="small"
                        type={item?.inputType}
                        label={item?.label}
                        fullWidth
                        margin="normal"
                        sx={{
                          flexBasis: "45%",
                          marginBottom: "16px",
                          marginRight: "15px",
                        }}
                      />
                    )}
                  />
                ))}
            </div>
            <button
              type="submit"
              className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;
