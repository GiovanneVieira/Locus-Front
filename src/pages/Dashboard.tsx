import { Navigate } from "react-router"

// Tela legada — substituída pelo painel Admin.
export default function DashboardPage() {
  return <Navigate to="/admin" replace />
}