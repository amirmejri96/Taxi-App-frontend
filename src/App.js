import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TransportDashboard from './pages/TransportDashboard';
import Profile from './components/user/Profile';
import RequestList from './components/user/RequestList';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/user"
              element={
                <PrivateRoute roles={['user']}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/transport"
              element={
                <PrivateRoute roles={['transport']}>
                  <TransportDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/profile"
              element={
                <PrivateRoute roles={['user', 'admin', 'transport']}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/requests"
              element={
                <PrivateRoute roles={['user']}>
                  <RequestList />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<div><h1>À propos</h1></div>} />
            <Route path="/contact" element={<div><h1>Contact</h1></div>} />
            <Route path="/terms" element={<div><h1>Conditions</h1></div>} />
            <Route path="/privacy" element={<div><h1>Confidentialité</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;