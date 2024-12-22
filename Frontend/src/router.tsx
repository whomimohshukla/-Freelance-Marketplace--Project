import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SearchProjects from './components/features/SearchProjects';
// import Messaging from './components/features/Messaging';
import SecurePayments from './components/features/SecurePayments';
import FindTalent from './components/features/FindTalent';
import Home from './pages/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'features/search',
        element: <SearchProjects />,
      },
      // {
      //   path: 'features/messaging',
      //   element: <Messaging />,
      // },
      {
        path: 'features/payments',
        element: <SecurePayments />,
      },
      {
        path: 'features/find-talent',
        element: <FindTalent />,
      },
    ],
  },
]);
