import { createHashRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Entrada from './pages/Entrada.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Encontros from './pages/Encontros.jsx'
import EncontroDetalhe from './pages/EncontroDetalhe.jsx'
import EncontroPrint from './pages/EncontroPrint.jsx'
import GarrafaDetalhe from './pages/GarrafaDetalhe.jsx'
import Membros from './pages/Membros.jsx'
import AppShell from './components/layout/AppShell.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

export const router = createHashRouter([
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
          path: 'encontros/:encontroId/garrafas/:garrafaId',
          element: <GarrafaDetalhe />,
        },
        {
          path: 'membros',
          element: <Membros />,
        },
      ],
    },
    {
      path: '/c/:slug/encontros/:id/imprimir',
      element: <EncontroPrint />,
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
