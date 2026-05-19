import { createBrowserRouter } from "react-router"

import AppShell from "@/components/AppShell"
import AuthPage from "@/components/auth/AuthPage"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AddressDetailsPage from "@/pages/AddressDetails"
import AddressesPage from "@/pages/Addresses"
import AdminPage from "@/pages/Admin"
import BecomeHostPage from "@/pages/BecomeHost"
import DashboardPage from "@/pages/Dashboard"
import Destinations from "@/pages/Destinations"
import HeuristicsPage from "@/pages/Heuristics"
import Home from "@/pages/Home"
import MilesPage from "@/pages/Miles"
import MyAddressesPage from "@/pages/MyAddresses"
import NewAddressPage from "@/pages/NewAddress"
import NotFoundPage from "@/pages/NotFound"
import PlanningPage from "@/pages/Planning"
import ProfilePage from "@/pages/Profile"
import RadarPage from "@/pages/Radar"
import EditAddressPage from "@/pages/EditAddressPage"

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", Component: Home },
      { path: "/destinos", Component: Destinations },
      { path: "/radar", Component: RadarPage },
      { path: "/milhas", Component: MilesPage },
      { path: "/planejamento", Component: PlanningPage },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute requireRoles={["ROLE_ADMIN"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/perfil",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tornar-anfitriao",
        element: (
          <ProtectedRoute>
            <BecomeHostPage />
          </ProtectedRoute>
        ),
      },
      { path: "/enderecos", Component: AddressesPage },
      {
        path: "/enderecos/meus",
        element: (
          <ProtectedRoute>
            <MyAddressesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/enderecos/novo",
        element: (
          <ProtectedRoute requireHost>
            <NewAddressPage />
          </ProtectedRoute>
        ),
      },
      { path: "/enderecos/:id", Component: AddressDetailsPage },
      {
        path: "/enderecos/:id/editar",
        element: (
          <ProtectedRoute requireHost>
            <EditAddressPage />
          </ProtectedRoute>
        ),
      },
      { path: "/heuristicas", element: (
        <ProtectedRoute requireRoles={["ROLE_ADMIN"]}>
          <HeuristicsPage />
        </ProtectedRoute>
      ) },
      { path: ":context/auth", Component: AuthPage },
      { path: "/auth", Component: AuthPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
])
