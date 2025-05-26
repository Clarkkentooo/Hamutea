import { createBrowserRouter } from "react-router-dom";

//context
import { ClientProvider } from "./context/ClientContext";

//layouts
import AdminLayout from "./components/layouts/AdminLayout";
import ClientLayout from "./components/layouts/ClientLayout";
import AuthLayout from "./components/layouts/AuthLayout";

//auth
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";

//admin
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Transactions from "./pages/admin/Transactions";
import AdminMenu from "./pages/admin/Menu";

//client
import Account from "./pages/client/Account";
import Menu from "./pages/client/Menu";
import Rewards from "./pages/client/Rewards";
import Processing from "./pages/client/Processing";
import ContactUs from "./pages/client/ContactUs";

// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";

// Protected Route
import ProtectedRoute from "./components/common/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "*",
        element: <ErrorBoundary />,
    },

    //auth
    {
        path: "/sign-in",
        element: <AuthLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <SignIn />,
            }
        ]
    },
    {
        path: "/sign-up",
        element: <AuthLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <SignUp />,
            }
        ]
    },

    //admin
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "transactions",
                element: <Transactions />,
            },
            {
                path: "menu",
                element: <AdminMenu />,
            }
        ],
    },

    //client
    {
        path: "/",
        element: (
            <ClientProvider>
                <ClientLayout />
            </ClientProvider>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Menu />,
            },
            {
                path: "menu",
                element: <Menu />,
            },
            {
                path: "account",
                element: (
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                ),
            },
            {
                path: "rewards",
                element: <Rewards />,
            },
            {
                path: "processing",
                element: <Processing />,
            },
            {
                path: "contact-us",
                element: <ContactUs />,
            }
        ]
    }
])

export default router;