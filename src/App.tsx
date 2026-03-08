import { LogoDownload } from './pages/LogoDownload';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { EditTransaction } from './pages/EditTransaction';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Logo } from './components/common/Logo';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/logos" element={<LogoDownload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
  path="/transaction/edit/:id"
  element={
    <ProtectedRoute>
      <EditTransaction />
    </ProtectedRoute>
  }
/>

        
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={
            <div style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '2rem'
            }}>
              <Logo size={80} showText={true} />
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 700, 
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-primary)'
                }}>
                  Welcome to Thrive
                </h1>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2rem'
                }}>
                  Where your money thrives 🌱
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <a href="/login" className="btn btn-primary">
                    Sign In
                  </a>
                  <a href="/signup" className="btn btn-outline">
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;