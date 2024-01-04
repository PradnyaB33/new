import React from "react";
import { Route, Routes } from "react-router-dom";

// Components
import AnimationComponent from "./components/emailverify/verification-animation";
import ForgotPassword from "./components/forgotpassword/forgotpassword";
import ResetPassword from "./components/resetpassword/resetpassword";
import TermsAndConditionsPage from "./components/termscondition/termsconditonpage";
import AddEmployee from "./pages/AddEmployee/addemployee";
import AddOrganisation from "./pages/AddOrganisation/AddOrganisation";
import Application from "./pages/Application/Application";
import Dashboard from "./pages/DashBoard/employee/Dashboard";
import DeleteEmployee from "./pages/DeleteEmployee/DeleteEmployee";
import CreateDepartment from "./pages/Departments/addDepartment";
import DepartmentList from "./pages/Departments/department-list";
import Designation from "./pages/Designation/Designation";
import EmployeeList from "./pages/EmployeeList/EmployeeList";
import Home from "./pages/Home/Home";
import AddProfile from "./pages/Home/components/addprofile";
import LeaveRequisition from "./pages/LeaveRequisition/LeaveRequisition";
import ShiftManagement from "./pages/SetupPage/ShiftManagement/shiftAllowance";
import Notification from "./pages/Notification/notification";
import OrgList from "./pages/OrgList/OrgList";
import SalaryCalculate from "./pages/SalaryCalculate/SalaryCalculate";
import SalaryManagement from "./pages/SalaryManagement/SalaryManagement";
import EmployeeCodeGenerator from "./pages/SetUpOrganization/EmployeeCodeGenerator/EmployeeCodeGenerator";
import EmployementTypes from "./pages/SetUpOrganization/EmployementType/EmployementTypes";
import EmployeeSalaryCalculate from "./pages/SetUpOrganization/EmoloyeeSalaryCalculate/EmployeeSalaryCalculate";
import LeaveTypes from "./pages/SetUpOrganization/LeaveComponents/LeaveTypes";
import OrganizationLocations from "./pages/SetUpOrganization/OrganizationLocations/OrganizationLocations";
import PublicHoliday from "./pages/SetUpOrganization/PublicHolidayPage/PublicHoliday";
import SalaryInput from "./pages/SetUpOrganization/SaleryInput/SalaryInput";
import Setup from "./pages/SetUpOrganization/Setup";
import DeleteDepartment from "./pages/SetupPage/DepartmentDeletion";
import EmailSetting from "./pages/SetupPage/EmailSetting";
import AddRoles from "./pages/SetupPage/Roles/AddRoles";
import Shifts from "./pages/SetupPage/Shifts";
import Inputfield from "./pages/SetupPage/inputfield";
import SignIn from "./pages/SignIn/SignIn";
import WeekendHoliday from "./pages/SetupPage/WeekendHoliday";
import Signup from "./pages/SignUp/NewSignUp";
import EditablePolyline from "./pages/Test/test2";
import TrackingMap from "./pages/Test/test3";
import TrackingMap3 from "./pages/Test/testYash";
import TrackingMap2 from "./pages/Test/testMap";
import TestNaresh from "./pages/Test/testNaresh";
import UserProfile from "./pages/UserProfile/UserProfile";
import WaitMain from "./pages/Waiting-comp/waiting-main";
import SingleDepartment from "./pages/single-department/single-department";
import SingleOrganisation from "./pages/single-orgnisation/single-organisation";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<EditablePolyline />} />
      {/* <Route path="/test" element={<EditablePolyline />} /> */}
      <Route path="/test3" element={<TestNaresh />} />
      <Route path="/test2" element={<TrackingMap />} />
      <Route path="/test5" element={<TrackingMap2 />} />
      <Route path="/test6" element={<TrackingMap3 />} />
      {/* Login Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/waiting" element={<WaitMain />} />
      <Route path="/verify/:token/" element={<AnimationComponent />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Login Routes */}
      {/* Dashboard Routes */}
      <Route path="/organisation/employee-dashboard" element={<Dashboard />} />

      <Route
        path="/organisation/:organisationId/super-admin"
        element={<Dashboard />}
      />
      {/* Dashboard Routes */}
      <Route path="/add-organisation" element={<AddOrganisation />} />
      <Route path="/organizationList" element={<OrgList />} />
      <Route
        path="/organisation/:organisationId/create-department"
        element={<CreateDepartment />}
      />
      <Route
        path="organisation/:organisationId/department-list"
        element={<DepartmentList />}
      />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/organisation/:id" element={<SingleOrganisation />} />
      <Route
        path="/organisation/:organisationId/employee-onboarding"
        element={<AddEmployee />}
      />
      <Route
        path="/organisation/:organisationId/employee-offboarding"
        element={<DeleteEmployee />}
      />
      <Route
        path="/organisation/:organisationId/employee-list"
        element={<EmployeeList />}
      />
      <Route path="/organisation/:id/add-profile" element={<AddProfile />} />
      <Route
        path="/organisation/:organisationId/setup/input-field"
        element={<Inputfield />}
      />
      <Route
        path="/organisation/:organisationId/salary-management"
        element={<SalaryManagement />}
      />
      <Route
        path="/organisation/:organisationId/salary-calculate/:userId"
        element={<SalaryCalculate />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-shifts"
        element={<Shifts />}
      />
      {/* <Route
        path="/organisation/:organisationId/setup/set-weekend-holiday"
        element={<WeekendHoliday />}
      /> */}
      <Route
        path="/organisation/:organisationId/setup/add-roles"
        element={<AddRoles />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-designation"
        element={<Designation />}
      />
      <Route path="/set-shifts/:id" element={<Shifts />} />
      <Route path="/add-inputfield/:id" element={<Inputfield />} />
      <Route path="/setup/add-roles/:id" element={<AddRoles />} />
      <Route
        path="/organisation/:organisationId/setup/leave-types"
        element={<LeaveTypes />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-public-holiday"
        element={<PublicHoliday />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-shifts"
        element={<Shifts />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-employement-types"
        element={<EmployementTypes />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-employee-salary-calculate"
        element={<EmployeeSalaryCalculate />}
      />
      <Route
        path="/organisation/:organisationId/setup/add-organization-locations"
        element={<OrganizationLocations />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-salary-input-selection"
        element={<SalaryInput />}
      />
      <Route path="/setup/:organisationId" element={<Setup />} />
      <Route path="/set-designation" element={<Designation />} />
      <Route path="/add-inputfield/:id" element={<Inputfield />} />
      <Route
        path="/setup/employee-code-genreation/:id"
        element={<EmployeeCodeGenerator />}
      />
      <Route path="/setup/:id/public-holidays" element={<PublicHoliday />} />
      <Route
        path="/organisation/:organisationId/setup/set-email"
        element={<EmailSetting />}
      />
      <Route path="/notification" element={<Notification />} />
      <Route path="/application" element={<Application />} />
      <Route path="/leave" element={<LeaveRequisition />} />
      <Route path="/shift-management" element={<ShiftManagement />} />
      <Route
        path="/terms-and-conditions"
        element={<TermsAndConditionsPage />}
      />
      <Route
        path="/organisation/:id/department/:departmentId"
        element={<SingleDepartment />}
      />
      {/* Removable component */}
      <Route
        path="/del-department-by-location"
        element={<DeleteDepartment />}
      />
    </Routes>
  );
};

export default App;
