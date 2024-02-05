import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Components
import SetupSideNav from "./components/SideNav/SetupSideNav";
import AnimationComponent from "./components/emailverify/verification-animation";
import ForgotPassword from "./components/forgotpassword/forgotpassword";
import ResetPassword from "./components/resetpassword/resetpassword";
import TermsAndConditionsPage from "./components/termscondition/termsconditonpage";
import UserProfile from "./hooks/UserData/useUser";
import NewOranisationForm from "./pages/AddOrganisation/NewOrgForm";
import Application from "./pages/Application/Application";
import DashBoardHR from "./pages/DashBoard/DashBoardHR";
import Dashboard from "./pages/DashBoard/Dashboard";
import DashboardManger from "./pages/DashBoard/DashboardManger";
import SuperAdmin from "./pages/DashBoard/SuperAdmin";
import AddDepartments from "./pages/Departments/AddDepartments";
import DepartmentList from "./pages/Departments/DepartmentList";
import Designation from "./pages/Designation/Designation";
import DeleteEmployee from "./pages/Employee/DeleteEmployee";
import EmployeeList from "./pages/Employee/EmployeeList";
import EmployeeAdd from "./pages/Employee/addemploye";
import Home from "./pages/Home/Home";
import LeaveRequisition from "./pages/LeaveRequisition/LeaveRequisition";
import Notification from "./pages/Notification/notification";
import OrgList from "./pages/OrgList/OrgList";
import PaymentFailed from "./pages/Payment/page";
import SalaryCalculate from "./pages/SalaryCalculate/SalaryCalculate";
import SalaryManagement from "./pages/SalaryManagement/SalaryManagement";
import EmployeeSalaryCalculateDay from "./pages/SetUpOrganization/EmoloyeeSalaryCalculate/EmployeeSalaryCalculate";
import EmployeeCodeGenerator from "./pages/SetUpOrganization/EmployeeCodeGenerator/EmployeeCodeGenerator";
import EmployementTypes from "./pages/SetUpOrganization/EmployementType/EmployementTypes";
import LeaveTypes from "./pages/SetUpOrganization/LeaveComponents/LeaveTypes";
import OrganizationLocations from "./pages/SetUpOrganization/OrganizationLocations/OrganizationLocations";
import PublicHoliday from "./pages/SetUpOrganization/PublicHolidayPage/PublicHoliday";
import SalaryInput from "./pages/SetUpOrganization/SaleryInput/SalaryInput";
import Setup from "./pages/SetUpOrganization/Setup";
import Subscription from "./pages/SetUpOrganization/Subscription/Subscription";
import {
  default as DeleteDepartment,
  default as DepartmentDeletion,
} from "./pages/SetupPage/DepartmentDeletion";
import EmailSetting from "./pages/SetupPage/EmailSetting";
import AddRoles from "./pages/SetupPage/Roles/AddRoles";
import ShiftManagement from "./pages/SetupPage/ShiftManagement/shiftAllowance";
import Shifts from "./pages/SetupPage/Shifts";
import WeekendHoliday from "./pages/SetupPage/WeekendHoliday";
import Inputfield from "./pages/SetupPage/inputfield";
import RolePage from "./pages/SignIn/RolePage";
import SignIn from "./pages/SignIn/SignIn";
import Signup from "./pages/SignUp/NewSignUp";
import EmployeeTest from "./pages/Test/EmployeeTest";
import EditablePolyline from "./pages/Test/test2";
import TrackingMap from "./pages/Test/test3";
import TrackingMap2 from "./pages/Test/testMap";
import TestNaresh from "./pages/Test/testNaresh";
import TrackingMap3 from "./pages/Test/testYash";
import EmployeeProfile from "./pages/UserProfile/UserProfile";
import ViewPayslip from "./pages/ViewPayslip/ViewPayslip";
import WaitMain from "./pages/Waiting-comp/waiting-main";
import SingleDepartment from "./pages/single-department/single-department";
import SingleOrganisation from "./pages/single-orgnisation/single-organisation";
import NotFound from "./utils/Forbidden/NotFound";
import UnAuthorized from "./utils/Forbidden/UnAuthorized";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth permission={"Super-Admin"}>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="/organisation/employeeTest" element={<EmployeeTest />} />
      <Route path="/paymentfailed" element={<PaymentFailed />} />

      <Route path="/test" element={<EditablePolyline />} />
      <Route path="/testOrg" element={<NewOranisationForm />} />
      {/* <Route path="/test" element={<EditablePolyline />} /> */}
      <Route path="/test3" element={<TestNaresh />} />
      <Route path="/test2" element={<TrackingMap />} />
      <Route path="/test5" element={<TrackingMap2 />} />
      <Route path="/test6" element={<TrackingMap3 />} />
      {/* Login Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/choose-role" element={<RolePage />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/waiting" element={<WaitMain />} />
      <Route path="/verify/:token/" element={<AnimationComponent />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Login Routes */}

      {/* //TODO Setup Sidebar */}
      <Route
        path="/organisation/:organisationId/setup"
        element={
          <RequireAuth permission={"Super-Admin"}>
            <SetupSideNav />
          </RequireAuth>
        }
      />
      {/* //TODO Setup Sidenar */}

      {/* Dashboard Routes */}
      <Route
        path="/organisation/dashboard/employee-dashboard"
        element={
          <RequireAuth permission={"Employee"}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/organisation/:organisationId/dashboard/HR-dashboard"
        element={
          <RequireAuth permission={"Hr"}>
            <DashBoardHR />
          </RequireAuth>
        }
      />

      <Route
        path="/organisation/:organisationId/dashboard/manager-dashboard"
        element={
          <RequireAuth permission={"Manager"}>
            <DashboardManger />
          </RequireAuth>
        }
      />
      <Route
        path="/organisation/:organisationId/dashboard/super-admin"
        element={
          <RequireAuth permission={"Super-Admin"}>
            <SuperAdmin />
          </RequireAuth>
        }
      />
      {/* Dashboard Routes */}
      <Route path="/add-organisation" element={<NewOranisationForm />} />
      <Route
        path="/organizationList"
        element={
          <RequireAuth permission={"Super-Admin"}>
            <OrgList />
          </RequireAuth>
        }
      />
      <Route
        path="/organisation/:organisationId/add-department"
        element={<AddDepartments />}
      />
      <Route
        path="organisation/:organisationId/department-list"
        element={<DepartmentList />}
      />
      <Route path="/organisation/:id" element={<SingleOrganisation />} />
      <Route path="/employee-profile" element={<EmployeeProfile />} />
      <Route
        path="/organisation/:organisationId/employee-onboarding"
        element={<EmployeeAdd />}
      />
      <Route
        path="/organisation/:organisationId/employee-offboarding"
        element={<DeleteEmployee />}
      />
      <Route
        path="/organisation/:organisationId/employee-list"
        element={<EmployeeList />}
      />
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
      <Route path="/organisation/view-payslip" element={<ViewPayslip />} />
      <Route
        path="/terms-and-conditions"
        element={<TermsAndConditionsPage />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-employee-salary-calculate-day"
        element={<EmployeeSalaryCalculateDay />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-shifts"
        element={<Shifts />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-weekend-holiday"
        element={<WeekendHoliday />}
      />
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
        path="/organisation/:organisationId/setup/subscription"
        element={<Subscription />}
      />
      <Route
        path="/organisation/:organisationId/setup/set-employee-code-generator"
        element={<EmployeeCodeGenerator />}
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

      <Route path="/setup/:id/public-holidays" element={<PublicHoliday />} />
      <Route
        path="/organisation/:organisationId/setup/set-email"
        element={<EmailSetting />}
      />
      <Route path="/notification" element={<Notification />} />
      <Route
        path="/organisation/:organisationId/dept-deletion"
        element={<DepartmentDeletion />}
      />
      <Route path="/application" element={<Application />} />
      <Route path="/leave" element={<LeaveRequisition />} />
      <Route path="/shift-management" element={<ShiftManagement />} />
      <Route
        path="/organisation/:id/department/:departmentId"
        element={<SingleDepartment />}
      />
      {/* Removable component */}
      <Route
        path="/del-department-by-location"
        element={<DeleteDepartment />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

function RequireAuth({ children, permission }) {
  const { getCurrentUser, getCurrentRole } = UserProfile();

  const user = getCurrentUser();
  const role = getCurrentRole();
  const isPermission = role === permission;

  if (user && !role) {
    return <Navigate to={"/choose-role"} />;
  }

  if (role || !window.location.pathname.includes("sign-in", "sign-up")) {
    if (!role) return <Navigate to={"/sign-in"} />;
    if (user && isPermission) return children;
    return <UnAuthorized />;
  }

  return user && isPermission ? children : <Navigate to={"/"} />;
}

//   : user?.profile?.length < 2 ? (
//   <Navigate to={"/organisation/employee-dashboard"} />
// ) : user?.profile?.includes("Hr") ? (
//   <Navigate to={"/organisation/HR-dashboard"} />
// ) : (
//   <Navigate to={"/organisation/employee-dashboard"} />
// );
