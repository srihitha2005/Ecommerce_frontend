import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Header from './components/common/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductListPage from './pages/customer/ProductListPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ProfilePage from './pages/customer/ProfilePage';
import SearchResultsPage from './pages/customer/SearchResultsPage';

// Merchant Pages
import MerchantDashboardPage from './pages/merchant/MerchantDashboardPage';
import ProductManagementPage from './pages/merchant/ProductManagementPage';
import AddProductPage from './pages/merchant/AddProductPage';
import EditProductPage from './pages/merchant/EditProductPage';
import InventoryPage from './pages/merchant/InventoryPage';
import MerchantOrdersPage from './pages/merchant/MerchantOrdersPage';
import MerchantProfilePage from './pages/merchant/MerchantProfilePage';
import MerchantLayout from './components/merchant/MerchantLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ChooseRolePage from './pages/auth/ChooseRolePage';

// Other
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router 
    /** * FUTURE FLAGS: Opting into React Router v7 behavior early.
     * 1. startTransition: Keeps UI responsive during heavy page transitions.
     * 2. relativeSplatPath: Fixes link logic when using wildcard (*) routes.
     * This prevents console warnings and future-proofs the app for the next major upgrade.
    */
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
       {/* /** WRAPPER HIERARCHY RECOLLECTION:
        * 1. Router: The "Spine" - provides navigation context to all sub-components.
        * 2. AuthProvider: The "Identity" - tells the app who the user is (Customer vs Merchant).
        * 3. CartProvider: The "Shared Basket" - keeps cart items safe while navigating between pages.
        * * Note: Auth is outside Cart because Cart needs Auth data to fetch user-specific items.
        */
        }
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                
                {/* Auth Routes */}
                <Route path="/choose-role" element={<ChooseRolePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Customer Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Merchant Protected Routes */}
                <Route
                  path="/merchant"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <MerchantLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Default redirect: Login -> /merchant -> /merchant/products */}
                  <Route index element={<Navigate to="/merchant/products" replace />} />
                  
                  <Route path="products" element={<ProductManagementPage />} />
                  <Route path="add-product" element={<AddProductPage />} />
                  <Route path="products/:productId/edit" element={<EditProductPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="orders" element={<MerchantOrdersPage />} />
                  <Route path="dashboard" element={<MerchantDashboardPage />} />
                  <Route path="profile" element={<MerchantProfilePage />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <footer className="bg-gray-800 text-white py-8 mt-12">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2026 ShopEase. All rights reserved.</p>
              </div>
            </footer>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;