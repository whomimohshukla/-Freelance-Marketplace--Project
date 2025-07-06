import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import RoleRoute from "./router/RoleRoute";
import SettingsLayout from "./pages/Settings/SettingsLayout";
import NotificationsSettings from "./pages/Settings/NotificationsSettings";
import BillingSettings from "./pages/Settings/BillingSettings";
import TwoFactorSettings from "./pages/Settings/TwoFactorSettings";
import SocialAccountsSettings from "./pages/Settings/SocialAccountsSettings";
import App from "./App";
import SearchProjects from "./components/features/SearchProjects";
import SecurePayments from "./components/features/SecurePayments";
import FindTalent from "./components/features/FindTalent";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import BecomeFreelancer from "./pages/BecomeFreelancer";
import GuideComponent from "./components/features/Guide";
import HelpCenter from "./components/features/HelpCenter";
import Documentation from "./components/features/Documentation";
import ContactUs from "./components/features/ContactUs";
import VideoCall from "./components/features/VideoCall";
import Pricing from "./components/features/Pricing";
import Messaging from "./components/features/Messaging";
import CreateProfile from "./pages/CreateProfile";
import TermsAndServices from "./pages/TermsAndServices";
import Community from "./pages/Community";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import ProfileView from "./pages/ProfileView";
import ProfileSettings from './pages/Settings/ProfileSettings';
import PortfolioSettings from "./pages/Settings/PortfolioSettings";
import SkillsSettings from "./pages/Settings/SkillsSettings";
import CompanySettings from "./pages/Settings/CompanySettings";
import BusinessDetailsSettings from "./pages/Settings/BusinessDetailsSettings";
import ChangePassword from "./pages/Settings/ChangePassword";
import DeleteAccount from "./pages/Settings/DeleteAccount";
import Orders from "./pages/Orders";
import Earnings from "./pages/Earnings";
import ProposalsPage from "./pages/Dashboard/Proposals";
import HelpCenterPage from "./pages/HelpCenterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "features/search",
        element: <SearchProjects />,
      },
      {
        path: "features/video-call",
        element: <VideoCall />,
      },
      {
        path: "features/payments",
        element: <SecurePayments />,
      },
      {
        path: "features/find-talent",
        element: <FindTalent />,
      },
      {
        path: "/become-freelancer",
        element: <BecomeFreelancer />,
      },
      {
        path: "/resources/guides",
        element: <GuideComponent />,
      },
      {
        path: "/resources/guides/:guideId",
        element: <GuideComponent />,
      },
      {
        path: "/resources/help",
        element: <HelpCenter />,
      },
      {
        path: "/documentation",
        element: <Documentation />,
      },
      {
        path: "/documentation/:docId",
        element: <Documentation />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/create-profile",
        element: <CreateProfile />,
      },
      {
        path: "/features/messaging",
        element: <Messaging />,
      },
      {
        path: "/terms-and-services",
        element: <TermsAndServices />,
      },
      {
        path: "/community",
        element: <Community />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-of-service",
        element: <TermsOfService />,
      },
      {
        path: "/cookie-policy",
        element: <CookiePolicy />,
      },
      {
        path: "/profile/:userId",
        element: <ProfileView />,
      },
      {
        path: "/help-center",
        element: <HelpCenterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
          path: "settings",
          element: <SettingsLayout />,
          children: [
            { index: true, element: <Navigate to="/settings/profile" replace /> },
            { path: "profile", element: <ProfileSettings /> },
            { path: "portfolio", element: <PortfolioSettings /> },
            { path: "skills", element: <SkillsSettings /> },
            { path: "work-experience", element: <ProfileSettings /> /* WorkExperienceSettings TODO*/ },
            { path: "education", element: <ProfileSettings /> /* EducationSettings TODO */ },
            { path: "certifications", element: <ProfileSettings /> /* CertificationsSettings TODO */ },
            { path: "availability", element: <ProfileSettings /> /* AvailabilitySettings TODO */ },
            { path: "company", element: <CompanySettings /> },
            { path: "business-details", element: <BusinessDetailsSettings /> },
            { path: "change-password", element: <ChangePassword /> },
            { path: "2fa", element: <TwoFactorSettings /> },
            { path: "social", element: <SocialAccountsSettings /> },
            { path: "notifications", element: <NotificationsSettings /> },
            { path: "billing", element: <BillingSettings /> },
            { path: "delete-account", element: <DeleteAccount /> },
          ],
        },
          {
            element: <RoleRoute allowed={['freelancer']} />,
            children: [
              { path: "orders", element: <Orders /> },
              { path: "earnings", element: <Earnings /> },
              { path: "dashboard/proposals", element: <ProposalsPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
