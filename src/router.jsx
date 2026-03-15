import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Entrada from './pages/Entrada.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Encontros from './pages/Encontros.jsx'
import EncontroDetalhe from './pages/EncontroDetalhe.jsx'
import Membros from './pages/Membros.jsx'
import AppShell from './components/layout/AppShell.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/c/:slug',
    element: <Entrada />,
  },
  {
    path: '/c/:slug',
    element: <AppShell />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'encontros',
        element: <Encontros />,
      },
      {
        path: 'encontros/:id',
        element: <EncontroDetalhe />,
      },
      {
        path: 'membros',
        element: <Membros />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
])
