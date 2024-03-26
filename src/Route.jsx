import React from "react";
import { Route, Routes, useParams } from "react-router-dom";

// Components
import PaymentNotReceived from "./components/Payment/not-recieved";
import SetupSideNav from "./components/SideNav/SetupSideNav";
import TermsAndConditionsPage from "./components/TermsPrivacyCookies/termsconditonpage";
import Loader from "./components/app-loader/page";
import AnimationComponent from "./components/emailverify/verification-animation";
import ForgotPassword from "./components/forgotpassword/forgotpassword";
import ResetPassword from "./components/resetpassword/resetpassword";
import RequireAuth, { AuthProvider } from "./context/AuthProvider";
import useSubscription from "./hooks/Subscription/subscription";
import NewOranisationForm from "./pages/AddOrganisation/OrgFrom";
import Application from "./pages/Application/Application";
import Billing from "./pages/Billing/page";
import DashBoardHR from "./pages/DashBoard/DashBoardHR";
import Dashboard from "./pages/DashBoard/Dashboard";
import DashboardDH from "./pages/DashBoard/DashboardDH";
import DashboardManger from "./pages/DashBoard/DashboardManger";
import SuperAdmin from "./pages/DashBoard/SuperAdmin";
import DepartmentList from "./pages/Departments/DepartmentList";
import Designation from "./pages/Designation/Designation";
import EmployeeConfirmation from "./pages/Employee-Confirm/page";
import DeleteEmployee from "./pages/Employee/DeleteEmployee";
import Employee from "./pages/Employee/Employee";
import Form16 from "./pages/Form16/Form16";
import Home from "./pages/Home/Home";
import IncomeTax from "./pages/Income/IncomeTax";
import LeaveRequisition from "./pages/LeaveRequisition/LeaveRequisition";
import LoanManagement from "./pages/LoanManagement/LoanManagement";
import OrgList from "./pages/OrgList/OrgList";
import PaymentFailed from "./pages/Payment/page";
import RemoteManager from "./pages/Remote-Punch-Info/RemoteManager";
import EmployeeRemotePunch from "./pages/Remote-Punching-Employee/page";
import MissedPunch from "./pages/RemotePunchIn/MissedPunch";
import CalculateSalary from "./pages/SalaryCalculate/CalculateSalary";
import SalaryManagement from "./pages/SalaryManagement/SalaryManagement";
import EmployeeSalaryCalculateDay from "./pages/SetUpOrganization/EmoloyeeSalaryCalculate/EmployeeSalaryCalculate";
import EmployeeCodeGenerator from "./pages/SetUpOrganization/EmployeeCodeGenerator/EmployeeCodeGenerator";
import EmpLoanMgt from "./pages/SetUpOrganization/EmployeeLoanManagement/EmpLoanMgt";
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
import ShiftManagement from "./pages/SetupPage/ShiftManagement/shiftAllowance";
import Shifts from "./pages/SetupPage/Shifts";
import WeekendHoliday from "./pages/SetupPage/WeekendHoliday";
import Inputfield from "./pages/SetupPage/inputfield";
import SignIn from "./pages/SignIn/SignIn";
import Signup from "./pages/SignUp/NewSignUp";
import EmployeeTest from "./pages/Test/EmployeeTest";
import RemoteNotification from "./pages/Test/RemoteNotification";
import TestMap from "./pages/Test/testMap";
import TestYash from "./pages/Test/testYash";
import DepartmentTest from "./pages/Test2/DepartmentTest";
import EmployeeProfile from "./pages/UserProfile/UserProfile";
import ViewPayslip from "./pages/ViewPayslip/ViewPayslip";
import WaitMain from "./pages/Waiting-comp/waiting-main";
import AddDelegate from "./pages/add-delegate/AddDelegate";
import SingleDepartment from "./pages/single-department/single-department";
import SingleOrganisation from "./pages/single-orgnisation/single-organisation";
import NotFound from "./utils/Forbidden/NotFound";
//import UnAuthorized from "./utils/Forbidden/UnAuthorized";
import TDSTab1 from "./pages/Income/components/TDSTab1";
import DeclarationPage from "./pages/Income/components/accountantDeclarations/DeclarationPage";
//import UnAuthorized from "./utils/Forbidden/UnAuthorized";
// import AccountantNotification from "./pages/Notification/AccountantNotification";
import CookiesPolicy from "./components/TermsPrivacyCookies/CookiesPolicy";
import PrivacyPolicy from "./components/TermsPrivacyCookies/PrivacyPolicy";
import TabTermsPrivacyPolicy from "./components/TermsPrivacyCookies/TabTermsPrivacyPolicy";
import ParentNotification from "./pages/AllNotifications/page";
import LoanMgtApproval from "./pages/LoanMgtNotified/LoanMgtApproval";
import LoanMgtNotification from "./pages/LoanMgtNotified/LoanMgtNotification";
import RemoteSetup from "./pages/SetUpOrganization/Remote/RemoteSetup";
import AddRoles from "./pages/SetUpOrganization/Roles/AddRoles";
import Training from "./pages/SetUpOrganization/Traning/Training";
import RemoteEmployee from "./pages/Test/RemoteEmployee/page";
import CustomCalander from "./pages/custom/Calendar";
import LeaveNotification from "./pages/leave-notification/page";
import PunchNotification from "./pages/punch-notification/page";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "HR",
                "Manager",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Employee",
              ]}
            >
              <Home />
            </RequireAuth>
          }
        />
        {/* <Route
          path="/organisation/:organisationId/employeeTest"
          element={<EmployeeTest />}
        /> */}
        <Route
          path="/add-delegate/"
          element={
            <RequireAuth permission={["Super-Admin"]}>
              <AddDelegate />
            </RequireAuth>
          }
        />

        <Route path="/paymentfailed" element={<PaymentFailed />} />

        <Route path="/loading" element={<Loader />} />
        <Route path="/testOrg" element={<NewOranisationForm />} />
        <Route path="/remotePunching" element={<RemoteEmployee />} />
        {/* Login Routes */}
        <Route path="/test3" element={<TestYash />} />
        <Route
          path="/employee-remote-punching"
          element={<EmployeeRemotePunch />}
        />
        <Route path="/missedPunch" element={<MissedPunch />} />
        <Route path="/test5" element={<TestMap />} />
        {/* <Route path="/remote/emp" element={<RemoteEmployee />} /> */}
        {/* this component need to update */}
        <Route
          path="/remote/employee-confirmation"
          element={<EmployeeConfirmation />}
        />
        <Route path="/custom/calendar" element={<CustomCalander />} />
        <Route path="/remote/info/:Id" element={<RemoteManager />} />
        <Route path="/remote/notification" element={<RemoteNotification />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/billing"
          element={
            <RequireAuth permission={["Super-Admin"]}>
              <Billing />
            </RequireAuth>
          }
        />
        {/* <Route path="/choose-role" element={<RolePage />} /> */}
        <Route path="/sign-up" element={<Signup />} />
        {/* <Route path="/notification" element={<ParentNotification />} /> */}
        <Route path="/leave-notification" element={<LeaveNotification />} />
        <Route path="/punch-notification" element={<PunchNotification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/waiting"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
                7,
              ]}
            >
              <WaitMain />
            </RequireAuth>
          }
        />
        <Route path="/verify/:token/" element={<AnimationComponent />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Login Routes */}

        {/* //TODO Setup Sidebar */}
        <Route
          path="/organisation/:organisationId/setup"
          element={
            <RequireAuth permission={["Super-Admin"]}>
              <SetupSideNav />
            </RequireAuth>
          }
        />
        {/* //TODO Setup Sidenar */}

        {/* Dashboard Routes */}
        <Route
          path="/organisation/dashboard/employee-dashboard"
          element={
            <RequireAuth
              permission={[
                "Employee",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
              ]}
            >
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/dashboard/HR-dashboard"
          element={
            <RequireAuth permission={"HR"}>
              <DashBoardHR />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/dashboard/DH-dashboard"
          element={
            <RequireAuth
              permission={["Department-Head", "Delegate-Department-Head"]}
            >
              <DashboardDH />
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
            <RequireAuth permission={["Super-Admin"]}>
              <SuperAdmin />
            </RequireAuth>
          }
        />
        {/* Dashboard Routes */}
        <Route
          path="/add-organisation"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <NewOranisationForm />
            </RequireAuth>
          }
        />
        <Route
          path="/organizationList"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <OrgList />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/add-department"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
              ]}
            >
              <DepartmentTest />
            </RequireAuth>
          }
        />
        <Route
          path="organisation/:organisationId/department-list"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "HR",
              ]}
            >
              <DepartmentList />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:id"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <SingleOrganisation />
            </RequireAuth>
          }
        />
        <Route
          path="/employee-profile"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]}
            >
              <EmployeeProfile />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/employee-onboarding"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              {/* <EmployeeAdd /> */}
              <EmployeeTest />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/employee-offboarding"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <DeleteEmployee />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/employee-list"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Manager",
                "Department-Head",
                "Accoutant",
              ]}
            >
              <Employee />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/input-field"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Inputfield />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/salary-management"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <SalaryManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/loan-management"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]}
            >
              <LoanManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/salary-calculate/:userId"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <CalculateSalary />
            </RequireAuth>
          }
        />

        <Route
          path="/organisation/:organisationId/view-payslip"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]}
            >
              <ViewPayslip />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/form-16"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]}
            >
              <Form16 />
            </RequireAuth>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditionsPage />}
        />
        <Route
          path="/terms-policy-cookies"
          element={<TabTermsPrivacyPolicy />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route
          path="/organisation/:organisationId/setup/salary-computation-day"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <EmployeeSalaryCalculateDay />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/loan-management"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <EmpLoanMgt />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/set-shifts"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Shifts />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/weekly-off"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <WeekendHoliday />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/add-roles"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <RequireSubscription>
                <AddRoles />
              </RequireSubscription>
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/designation"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Designation />
            </RequireAuth>
          }
        />
        <Route
          path="/set-shifts/:id"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Shifts />
            </RequireAuth>
          }
        />
        <Route
          path="/add-inputfield/:id"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Inputfield />
            </RequireAuth>
          }
        />
        <Route
          path="/setup/add-roles/:id"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <AddRoles />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/leave-types"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <LeaveTypes />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/set-public-holiday"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <PublicHoliday />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/set-shifts"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Shifts />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/set-employement-types"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <EmployementTypes />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/subscription"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Subscription />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/employee-code"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <EmployeeCodeGenerator />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/add-organization-locations"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <OrganizationLocations />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/set-salary-input-selection"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <SalaryInput />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/remote-punching"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <RemoteSetup />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/training"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Training />
            </RequireAuth>
          }
        />
        <Route
          path="/setup/:organisationId"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Setup />
            </RequireAuth>
          }
        />
        <Route
          path="/set-designation"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Designation />
            </RequireAuth>
          }
        />
        <Route
          path="/add-inputfield/:id"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Inputfield />
            </RequireAuth>
          }
        />

        <Route
          path="/setup/:id/public-holidays"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <PublicHoliday />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/setup/email"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <EmailSetting />
            </RequireAuth>
          }
        />
        <Route
          path="/notification"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "Accountant",
                "Delegate-Accountant",
                "HR",
                "Manager",
                "Employee",
              ]}
            >
              <ParentNotification />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/dept-deletion"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
              ]}
            >
              <DepartmentDeletion />
            </RequireAuth>
          }
        />
        <Route path="/income-tax" element={<IncomeTax />} />
        <Route path="/income-tax/declarations" element={<TDSTab1 />} />
        <Route
          path="/income-tax/accountant-declarations"
          element={<DeclarationPage />}
        />
        <Route
          path="/income-tax/accountant-declarations/:id"
          element={<DeclarationPage />}
        />
        <Route path="/application" element={<Application />} />
        <Route
          path="/leave"
          element={
            <RequireAuth
              permission={[
                "Employee",
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "HR",
                "Accountant",
              ]}
            >
              <LeaveRequisition />
            </RequireAuth>
          }
        />
        <Route
          path="/shift-management"
          element={
            <RequireAuth permission={["Employee", "Super-Admin"]}>
              <ShiftManagement />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:id/department/:departmentId"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "HR",
              ]}
            >
              <SingleDepartment />
            </RequireAuth>
          }
        />
        {/* Removable component */}
        <Route
          path="/del-department-by-location"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Department-Head",
                "Delegate-Department-Head",
                "Department-Admin",
                "Delegate-Department-Admin",
                "HR",
              ]}
            >
              <DeleteDepartment />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/pendingLoan" element={<LoanMgtNotification />} />
        <Route path="/loan-approval/:loanId" element={<LoanMgtApproval />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

// function RequireAuth({ children, permission }) {
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const navigate = useNavigate("");
//   const user = getCurrentUser();
//   const role = useGetCurrentRole();
//   const isPermission = permission?.includes(role);

//   // Check if the current path includes either "sign-in" or "sign-up"
//   const isAuthPage =
//     window.location.pathname.includes("sign-in") ||
//     window.location.pathname.includes("sign-up");

//   if (!isAuthPage) {
//     if (!user) return <Navigate to={"/sign-in"} />;
//     if (user && isPermission) return children;
//     if (!isPermission) return navigate(-1);
//   }

//   return children;
// }

function RequireSubscription({ children }) {
  const { organisationId } = useParams();
  const { subscriptionDetails } = useSubscription(organisationId);

  if (
    subscriptionDetails?.subscription?.status ===
    ("pending" || "halted" || "paused")
  ) {
    return (
      <PaymentNotReceived link={subscriptionDetails?.subscription?.short_url} />
    );
  }

  return children;
}
