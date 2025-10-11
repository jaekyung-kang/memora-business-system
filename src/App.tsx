import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { WiredPage } from './pages/WiredPage'
import { WiredNewPage } from './pages/WiredNewPage'
import { WirelessPage } from './pages/WirelessPage'
import { WirelessNewPage } from './pages/WirelessNewPage'
import { AdminPage } from './pages/AdminPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/wired" element={
            <ProtectedRoute>
              <WiredPage />
            </ProtectedRoute>
          } />
          <Route path="/wired/new" element={
            <ProtectedRoute>
              <WiredNewPage />
            </ProtectedRoute>
          } />
          <Route path="/wireless" element={
            <ProtectedRoute>
              <WirelessPage />
            </ProtectedRoute>
          } />
          <Route path="/wireless/new" element={
            <ProtectedRoute>
              <WirelessNewPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
