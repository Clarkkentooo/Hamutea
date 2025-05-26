import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClientProvider } from '@context/ClientContext';

// Layout Components
import ClientLayout from '@layouts/ClientLayout';

// Pages
import Home from '@pages/client/Home';
import Menu from '@pages/client/Menu';
import Payment from '@pages/client/Payment';
import PaymentSuccess from '@pages/client/PaymentSuccess';
import OrderHistory from '@pages/client/OrderHistory';
import OrderTracking from '@pages/client/OrderTracking';
import SignIn from '@pages/auth/SignIn';
import SignUp from '@pages/auth/SignUp';
import NotFound from '@pages/NotFound';

function App() {
  return (
    <ClientProvider>
      <Router>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="payment" element={<Payment />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="order-tracking/:orderId" element={<OrderTracking />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ClientProvider>
  );
}

export default App;