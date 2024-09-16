import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Login from './pages/Login';
import RefrshHandler from './RefrshHandler';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Payment from './pages/PaymentPage';
import Dashboard from './pages/Dashboard';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profilePage" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
        <Route path="/payment" element={<PrivateRoute element={<Payment />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/products/:productId" element={<PrivateRoute element={<ProductDetails />} />} />
      </Routes>
    </div>
  );
}

export default App;
