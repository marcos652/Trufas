import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreFront } from './pages/StoreFront';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { TruffleList } from './pages/admin/TruffleList';
import { TruffleForm } from './pages/admin/TruffleForm';
import { OrderList } from './pages/admin/OrderList';
import { AdminLayout } from './layouts/AdminLayout';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
          {/* Vitrine pública */}
          <Route path="/" element={<StoreFront />} />

          {/* Admin - Login (sem layout) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin - rotas protegidas */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/truffles"
            element={
              <AdminLayout>
                <TruffleList />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/truffles/new"
            element={
              <AdminLayout>
                <TruffleForm />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/truffles/:id/edit"
            element={
              <AdminLayout>
                <TruffleForm />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <OrderList />
              </AdminLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
