import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SearchProjects from "./components/features/SearchProjects";
import SecurePayments from "./components/features/SecurePayments";
import FindTalent from "./components/features/FindTalent";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOtp from "./pages/Auth/VerifyOtp";
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
import ProfileSettings from "./pages/ProfileSettings";
import Orders from "./pages/Orders";
import Earnings from "./pages/Earnings";
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
        path: "/profile/:username",
        element: <ProfileView />,
      },
      {
        path: "/settings/profile",
        element: <ProfileSettings />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/earnings",
        element: <Earnings />,
      },
      {
        path: "/help-center",
        element: <HelpCenterPage />,
      }
    ],
  },
]);
