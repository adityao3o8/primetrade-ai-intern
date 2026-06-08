import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import VantaBackground from './components/VantaBackground';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={null}>
        <VantaBackground />
      </ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
