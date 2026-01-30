import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ChooseRolePage from './pages/auth/ChooseRolePage';

// Other
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
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
                  path="/merchant/dashboard"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <MerchantDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/merchant/products"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <ProductManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/merchant/add-product"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <AddProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/merchant/products/:productId/edit"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <EditProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/merchant/inventory"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <InventoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/merchant/orders"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <MerchantOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/merchant/profile"
                  element={
                    <ProtectedRoute requiredRole="MERCHANT">
                      <MerchantProfilePage />
                    </ProtectedRoute>
                  }
                />
                
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