import { createBrowserRouter } from "react-router"

import Destinations from "@/pages/Destinations"
import Home from "@/pages/Home"
import MilesPage from "@/pages/Miles"
import PlanningPage from "@/pages/Planning"
import RadarPage from "@/pages/Radar"
import AuthPage from "@/components/auth/AuthPage"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/destinos",
    Component: Destinations,
  },
  {
    path: "/radar",
    Component: RadarPage,
  },
  {
    path: "/milhas",
    Component: MilesPage,
  },
  {
    path: "/planejamento",
    Component: PlanningPage,
  },
  {
    path: ":context/auth",
    Component: AuthPage
  },
  {
    path: "/auth",
    Component: AuthPage
  }
])
