import { createBrowserRouter } from 'react-router-dom';

// Layouts
import ClientLayout from './components/layouts/ClientLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Client Pages
import Menu from './pages/client/Menu';
import Rewards from './pages/client/Rewards';
import Account from './pages/client/Account';
import ContactUs from './pages/client/ContactUs';
import Payment from './pages/client/Payment';
import PaymentSuccess from './pages/client/PaymentSuccess';
import PaymentResult from './pages/PaymentResult';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import OrderList from './pages/admin/OrderList';
import OrderDetail from './pages/admin/OrderDetail';
import TransactionList from './pages/admin/TransactionList';
import TransactionDetail from './pages/admin/TransactionDetail';
import UserList from './pages/admin/UserList';

// Auth Pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AuthCallback from './pages/auth/AuthCallback';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailSuccess from './pages/auth/VerifyEmailSuccess';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Menu />,
      },
      {
        path: 'menu',
        element: <Menu />,
      },
      {
        path: 'rewards',
        element: <Rewards />,
      },
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
      {
        path: 'contact-us',
        element: <ContactUs />,
      },
      {
        path: 'payment',
        element: <Payment />,
      },
      {
        path: 'payment-success',
        element: <PaymentSuccess />,
      },
      {
        path: 'payment-failed',
        element: <PaymentResult />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'products',
        element: <ProductList />,
      },
      {
        path: 'products/new',
        element: <ProductForm />,
      },
      {
        path: 'products/:id',
        element: <ProductForm />,
      },
      {
        path: 'orders',
        element: <OrderList />,
      },
      {
        path: 'orders/:id',
        element: <OrderDetail />,
      },
      {
        path: 'transactions',
        element: <TransactionList />,
      },
      {
        path: 'transactions/:id',
        element: <TransactionDetail />,
      },
      {
        path: 'users',
        element: <UserList />,
      },
    ],
  },
  {
    path: '/sign-in',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <SignIn />,
      }
    ],
  },
  {
    path: '/sign-up',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <SignUp />,
      }
    ],
  },
  {
    path: '/auth-callback',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <AuthCallback />,
      }
    ],
  },
  {
    path: '/verify-email',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <VerifyEmail />,
      }
    ],
  },
  {
    path: '/verify-email-success',
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <VerifyEmailSuccess />,
      }
    ],
  },
  {
    path: '*',
    element: <ErrorBoundary />
  }
]);

export default router;