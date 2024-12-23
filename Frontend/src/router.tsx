import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SearchProjects from "./components/features/SearchProjects";
import SecurePayments from "./components/features/SecurePayments";
import FindTalent from "./components/features/FindTalent";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import BecomeFreelancer from "./pages/BecomeFreelancer";
import GuideComponent from "./components/features/Guide";
import HelpCenter from "./components/features/HelpCenter";
import Documentation from "./components/features/Documentation";
import ContactUs from "./components/features/ContactUs";
import VideoCall from "./components/features/VideoCall";
import Pricing from "./components/features/Pricing";
import Messaging from "./components/features/Messaging";

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
        path:"/features/messaging",
        element:<Messaging />
      }
    ],
  },
]);
