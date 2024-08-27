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
import TDSTab1 from "./pages/Income/components/TDSTab1";
import DeclarationPage from "./pages/Income/components/accountantDeclarations/DeclarationPage";
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
import Shifts from "./pages/SetupPage/Shift/Page";
import ShiftManagement from "./pages/SetupPage/ShiftManagement/shiftAllowance";
import WeekendHoliday from "./pages/SetupPage/WeekendHoliday";
import Inputfield from "./pages/SetupPage/inputfield";
import SignIn from "./pages/SignIn/SignIn";
import Signup from "./pages/SignUp/NewSignUp";
import EmployeeTest from "./pages/Test/EmployeeTest";
import RemoteNotification from "./pages/Test/RemoteNotification";
import TestMap from "./pages/Test/testMap";
import TestYash from "./pages/Test/testYash";
import DepartmentTest from "./pages/Test2/DepartmentTest";
import HrTrainings from "./pages/Training/page";
import EmployeeProfile from "./pages/UserProfile/UserProfile";
import ViewPayslip from "./pages/ViewPayslip/ViewPayslip";
import WaitMain from "./pages/Waiting-comp/waiting-main";
import AddDelegate from "./pages/add-delegate/AddDelegate";
import SingleDepartment from "./pages/single-department/single-department";
import SingleOrganisation from "./pages/single-orgnisation/single-organisation";
import NotFound from "./utils/Forbidden/NotFound";
// import AccountantNotification from "./pages/Notification/AccountantNotification";
import OrgChart from "./Test/OrgChart";
import CookiesPolicy from "./components/TermsPrivacyCookies/CookiesPolicy";
import PrivacyPolicy from "./components/TermsPrivacyCookies/PrivacyPolicy";
import TabTermsPrivacyPolicy from "./components/TermsPrivacyCookies/TabTermsPrivacyPolicy";
import useSubscriptionGet from "./hooks/QueryHook/Subscription/hook";
import AdvanceSalary from "./pages/AdvanceSalary/AdvanceSalary";
import AdvanceSalaryApproval from "./pages/AdvanceSalaryNotification/AdvanceSalaryApproval";
import AdvanceSalaryNotification from "./pages/AdvanceSalaryNotification/AdvanceSalaryNotification";
import AdvanceSalaryNotificationToEmp from "./pages/AdvanceSalaryNotification/AdvanceSalaryNotificationToEmp";
import ParentNotification from "./pages/AllNotifications/page";
import Communication from "./pages/Communication/Communication";
import DocManage from "./pages/DocumentManagement/DocManage";
import DocManageAuth from "./pages/DocumentManagement/DocManageAuth";
import OrgDocManage from "./pages/DocumentManagement/OrgDocManage";
import EmpExcelOnboard from "./pages/EmpExcelOnboard/EmpExcelOnboard";
import RendarPunchSyncFile from "./pages/PunchDataSync/RendarPunchSyncFile";
import EmployeeNotification from "./pages/Employee-Notification/page";
import EditEmployee from "./pages/Employee/EditEmployee";
import EmployeeSurvey from "./pages/EmployeeSurvey/EmployeeSurvey";
import CreateNewSurvey from "./pages/EmployeeSurvey/components/CreateNewSurvey";
import EmployeeSurveyForm from "./pages/EmployeeSurvey/components/EmployeeSurveyForm";
import SurveyDetails from "./pages/EmployeeSurvey/components/SurveyDetails";
import Form16NotificationToEmp from "./pages/Form16NotificationToEmp/Form16NotificationToEmp";
import GeoFencing from "./pages/Geo-Fence/page";
import IncomeTaxNotification from "./pages/Income/IncomeTaxNotification";
import TDSCalculation from "./pages/Income/components/Calculations/TDSCalculation";
import LetterSetup from "./pages/LetterTypes/LetterSetup";
import LoanMgtApproval from "./pages/LoanMgtNotified/LoanMgtApproval";
import LoanMgtNotification from "./pages/LoanMgtNotified/LoanMgtNotification";
import LoanNotificationToEmp from "./pages/LoanMgtNotified/LoanNotificationToEmp";
import MissPunchInOut from "./pages/MissPunch/MissPunchInOut";
import MissPunchJustify from "./pages/MissPunch/MissPunchJustify";
import MissedPunchNotification from "./pages/MissedPunchNotification/MissedPunchNotification";
import MissedPunchNotificationToEmp from "./pages/MissedPunchNotification/MissedPunchNotificationToEmp";
import MyTraining from "./pages/My-Training/page";
import AssignOrg from "./pages/OrgList/AssignOrg";
import PayslipNotification from "./pages/PayslipNotification/PayslipNotification";
import CreateJobPosition from "./pages/Recruitment/CreateJobPosition";
import EditJobPosition from "./pages/Recruitment/EditJobPosition";
import ViewJobPosition from "./pages/Recruitment/ViewJobPosition";
import ReportingMis from "./pages/ReportingMis/page";
import ResetNewPassword from "./pages/ResetNewPassword/ResetNewPassword";
import SelfLeaveNotification from "./pages/SelfLeaveNotification/page";
import SelfShiftNotification from "./pages/SelfShiftNotification/page";
import EmpCommunication from "./pages/SetUpOrganization/EmpCommunication/EmpCommunication";
import PerformanceSetup from "./pages/SetUpOrganization/Performance/PerformanceSetup";
import RemoteSetup from "./pages/SetUpOrganization/Remote/RemoteSetup";
import AddRoles from "./pages/SetUpOrganization/Roles/AddRoles";
import Training from "./pages/SetUpOrganization/Traning/Training";
import SetupShift from "./pages/SetupPage/ShiftManagement/SetupShift";
import RemoteEmployee from "./pages/Test/RemoteEmployee/page";
import ViewAttendacneBiomatric from "./pages/ViewAttendanceBiomatric/ViewAttendacneBiomatric";
import ViewCalculateAttendance from "./pages/ViewCalculateAttendance/ViewCalculateAttendance";
import CustomCalander from "./pages/custom/Calendar";
import DocNotification from "./pages/doc-notification/DocNotification";
import EmpNotification from "./pages/emp-notifications/EmpNotification";
import LeaveNotification from "./pages/leave-notification/page";
import Performance from "./pages/peformance/Performance";
import PunchNotification from "./pages/punch-notification/page";
import ShiftNotification from "./pages/shift-notification/page";
import JobPositionNotificaitonToMgr from "./pages/Recruitment/Notification/JobPositonNotificatinToMgr";
import JobNotificationToEmp from "./pages/Recruitment/Notification/JobNotificationToEmp";
import OpenJobPosition from "./pages/Recruitment/OpenRoleJobPosition";
import DepartmentNotification from "./pages/DeptNotification/DepartmentNotification";
import DepartmentNotificationToEmp from "./pages/DeptNotification/DepartmentNotificationToEmp";
import OvertimeSetup from "./pages/OvertimeSetup/OvertimeSetup";
import GeoFencingEmployeeSide from "./pages/Geo-Fence/components/GeoFencingEmployeeSide";
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
        <Route
          path="/organisation/:organisationId/performance"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Employee",
                "Manager",
                "HR",
              ]}
            >
              <Performance />
            </RequireAuth>
          }
        />

        {/* OvertimeSetup */}
        <Route
          path="/organisation/:organisationId/setup/overtime-setup"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "Employee",
                "Manager",
                "HR",
              ]}
            >
              <OvertimeSetup />
            </RequireAuth>
          }
        />

      
        
        
        <Route
          path="/organisation/:organisationId/add-delegate/"
          element={
            <RequireAuth permission={["Super-Admin"]}>
              <AddDelegate />
            </RequireAuth>
          }
        />

        <Route path="/paymentfailed" element={<PaymentFailed />} />
        <Route
          path="/self/emp-main-notification"
          element={<EmpNotification />}
        />

        <Route path="/loading" element={<Loader />} />
        <Route path="/my-training" element={<MyTraining />} />
        <Route path="/testOrg" element={<NewOranisationForm />} />
        <Route path="/remotePunching" element={<RemoteEmployee />} />
        <Route
          path="/organisation/:organisationId/remotePunching"
          element={<RemoteEmployee />}
        />
        <Route
          path="/organisation/:organisationId/remotePunching/geo-fencing"
          element={<GeoFencing />}
        />
        <Route
          path="/organisation/:organisationId/geo-fencing"
          element={
            <RequireAuth
              permission={[
                "Employee",
              ]}
            >
              <GeoFencingEmployeeSide />
            </RequireAuth>
          }
        />
        {/* Login Routes */}
        <Route path="/test3" element={<TestYash />} />
        <Route
          path="/employee-remote-punching"
          element={<EmployeeRemotePunch />}
        />
        <Route
          path="/organisation/:organisationId/employee-remote-punching"
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
        <Route
          path="/organisation/:organisationId/setup/letter-types"
          element={<LetterSetup />}
        />
        <Route path="/remote/info/:Id" element={<RemoteManager />} />
        <Route path="/remote/notification" element={<RemoteNotification />} />
        <Route path="/doc-notification" element={<DocNotification />} />
        <Route path="/emp/docs" element={<DocManage />} />
        <Route
          path="/organisation/:organisationId/emp/docs"
          element={<DocManage />}
        />
        <Route path="/org/docs" element={<OrgDocManage />} />
        <Route path="/org/docs/auth" element={<DocManageAuth />} />
        <Route
          path="/organisation/:organisationId/org/docs/auth"
          element={<DocManageAuth />}
        />
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
        <Route
          path="/self/leave-notification"
          element={<SelfLeaveNotification />}
        />
        <Route
          path="/leave-notification/:employeeId"
          element={<LeaveNotification />}
        />
        <Route path="/punch-notification" element={<PunchNotification />} />
        {/* <Route
          path="self/shift-notification"
          element={<EmpShiftNotification />}
        /> */}
        <Route
          path="/punch-notification/:employeeId"
          element={<PunchNotification />}
        />
        <Route path="/shift-notification" element={<ShiftNotification />} />
        <Route
          path="/shift-notification/:employeeId"
          element={<ShiftNotification />}
        />
        <Route
          path="/self/shift-notification"
          element={<SelfShiftNotification />}
        />
        <Route
          path="/missedPunch-notification"
          element={<MissedPunchNotification />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetNewPassword />} />

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
          path="/organisation/:id/dashboard/employee-dashboard"
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
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
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
          path="/assingOrganizationToSelf"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <AssignOrg />
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
                "HR",
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
          path="/organisation/:organisationId/create-communication"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <Communication />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/create-job-position"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Manager",
              ]}
            >
              <CreateJobPosition />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/view-job-position"
          element={
            <RequireAuth
              permission={[
                "Super-Admin",
                "Delegate-Super-Admin",
                "HR",
                "Department-Head",
                "Delegate-Department-Head",
                "Manager",
              ]}
            >
              <ViewJobPosition />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/open-job-position"
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
              <OpenJobPosition />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/edit-job-position/:jobPositionId"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <EditJobPosition />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/edit-employee/:employeeId"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <EditEmployee />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/emo-info-punch-status"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <RendarPunchSyncFile />
            </RequireAuth>
          }
        />

        <Route
          path="/organisation/:organisationId/view-calculate-data"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <ViewCalculateAttendance />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/view-calculate-data"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <ViewCalculateAttendance />
            </RequireAuth>
          }
        />

        <Route
          path="/organisation/:organisationId/view-attendance-biomatric"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <ViewAttendacneBiomatric />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/missed-justify"
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
              <MissPunchJustify />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/missed-punch-in-out"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <MissPunchInOut />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/missed-punch-in-out"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <MissPunchInOut />
            </RequireAuth>
          }
        />
        <Route
          path="/missed-justify"
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
              <MissPunchJustify />
            </RequireAuth>
          }
        />

        {/* LiveSyncData */}
        {/* <Route
          path="/organisation/:organisationId/liveSyncData"
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
             <LiveSyncData/>
            </RequireAuth>
          }
        /> */}
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
          path="/organisation/:organisationId/add-loan"
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
          path="/organisation/:organisationId/advance-salary"
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
              <AdvanceSalary />
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
          path="/organisation/:organisationId/employee-onboarding-excel"
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
              <EmpExcelOnboard />
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
          path="/organisation/:organisationId/setup/shift-allowance"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <SetupShift />
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
        {/* <Route
          path="/set-shifts/:id"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <Shift s />
            </RequireAuth>
          }
        /> */}
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
          path="/organisation/:organisationId/setup/email-communicaiton"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <EmpCommunication />
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
          path="/organisation/:organizationId/organisation-hierarchy"
          element={<OrgChart />}
        />

        <Route
          path="/organisation/:organisationId/mis-report"
          element={
            <RequireAuth
              permission={["Super-Admin", "Delegate-Super-Admin", "HR"]}
            >
              <ReportingMis />
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
          path="/organisation/:organisationId/setup/performance-management"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <PerformanceSetup />
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
          path="/organisation/:organisationId/notification"
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
          path="/self-notification"
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
              <EmployeeNotification />
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
        <Route
          path="/organisation/:organisationId/income-tax"
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
              <IncomeTax />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/income-tax/declarations"
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
              <TDSTab1 />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/income-tax/calculation"
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
              <TDSCalculation />
            </RequireAuth>
          }
        />
        <Route
          path="/notification/income-tax"
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
              <DeclarationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/notification/income-tax-details"
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
              {" "}
              <IncomeTaxNotification />
            </RequireAuth>
          }
        />
        <Route
          path="/notification/income-tax/:id"
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
              <DeclarationPage />
            </RequireAuth>
          }
        />
        <Route path="/application" element={<Application />} />
        <Route
          path="/organisation/:organisationId/manage-training"
          element={
            <RequireAuth
              permission={[
                "HR",
                "Super-Admin",
                "Department-Head",
                "Delegate-Super-Admin",
              ]}
            >
              <HrTrainings />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/leave"
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
                "Manager",
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
        <Route path="/loan-notification" element={<LoanMgtNotification />} />
        <Route path="/loan-approval/:loanId" element={<LoanMgtApproval />} />
        <Route
          path="/loan-notification-to-emp"
          element={<LoanNotificationToEmp />}
        />
        <Route
          path="/job-position-to-mgr"
          element={<JobPositionNotificaitonToMgr />}
        />
        <Route path="/job-position-to-emp" element={<JobNotificationToEmp />} />
        <Route
          path="/missed-punch-notification-to-emp"
          element={<MissedPunchNotificationToEmp />}
        />
        <Route
          path="/payslip-notification-to-emp"
          element={<PayslipNotification />}
        />
        <Route
          path="/form16-notification-to-emp"
          element={<Form16NotificationToEmp />}
        />
        <Route
          path="/advance-salary-notification"
          element={<AdvanceSalaryNotification />}
        />
        <Route
          path="/advance-salary-approval/:advanceSalaryId"
          element={<AdvanceSalaryApproval />}
        />
        <Route
          path="/advance-salary-notification-to-emp"
          element={<AdvanceSalaryNotificationToEmp />}
        />
        <Route
          path="/department-notification-approval"
          element={<DepartmentNotification />}
        />
        <Route
          path="/department-notification-to-emp"
          element={<DepartmentNotificationToEmp />}
        />
        <Route
          path="/organisation/:organisationId/employee-survey"
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
              <EmployeeSurvey />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/employee-survey/:employeeId"
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
              <EmployeeSurvey />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/create-new-survey"
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
              <CreateNewSurvey isEditable={true} />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/create-new-survey/:id"
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
              <CreateNewSurvey isEditable={true} />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/update-survey/:id"
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
              <CreateNewSurvey isEditable={true} />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/view-survey/:id"
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
              <CreateNewSurvey isEditable={false} />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/survey-form"
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
              <EmployeeSurveyForm />
            </RequireAuth>
          }
        />
        {/* OvertimeSetup */}
        <Route
          path="/organisation/:organisationId/setup/overtime-setup"
          element={
            <RequireAuth permission={["Super-Admin", "Delegate-Super-Admin"]}>
              <OvertimeSetup />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/survey-form/:surveyId/:responseId"
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
              <EmployeeSurveyForm />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/survey-form/:surveyId"
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
              <EmployeeSurveyForm />
            </RequireAuth>
          }
        />
        <Route
          path="/organisation/:organisationId/survey-details/:surveyId"
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
              <SurveyDetails />
            </RequireAuth>
          }
        />
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
  const { data } = useSubscriptionGet({ organisationId });

  if (data?.subscription?.status === ("pending" || "halted" || "paused")) {
    return <PaymentNotReceived link={data?.subscription?.short_url} />;
  }

  return children;
}
