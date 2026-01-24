import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import './styles.css';
import commonStyles from './styles/common.module.css';



export default function App() {
  return (
     <AuthProvider>
      <BrowserRouter>
     <section className={commonStyles.mainContainer}>
        <NavBar />
        <main className={commonStyles.container}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        </section>
      </BrowserRouter>
    </AuthProvider>
  )
}