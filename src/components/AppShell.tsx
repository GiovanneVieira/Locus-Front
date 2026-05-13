import { Outlet } from "react-router"

import { KeyboardShortcuts } from "@/components/KeyboardShortcuts"
import useNavigationShortcuts from "@/hooks/useNavigationShortcuts"
import useSearchShortcut from "@/hooks/useSearchShortcut"

/**
 * Shell raiz da aplicação.
 *
 * Hospeda os atalhos globais e o overlay de atalhos. Não renderiza
 * Header/Footer aqui — cada página decide isso, porque algumas (ex.: NotFound,
 * Auth) podem querer layouts diferentes.
 */
export default function AppShell() {
  useNavigationShortcuts()
  useSearchShortcut()

  return (
    <>
      <Outlet />
      <KeyboardShortcuts />
    </>
  )
}
