import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SearchProjects from './components/features/SearchProjects';
import Messaging from './components/features/Messaging';
import SecurePayments from './components/features/SecurePayments';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'features/search',
        element: <SearchProjects />,
      },
      {
        path: 'features/messaging',
        element: <Messaging />,
      },
      {
        path: 'features/payments',
        element: <SecurePayments />,
      },
    ],
  },
]);