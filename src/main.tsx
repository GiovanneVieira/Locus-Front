import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { router } from "./routes/routes"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}>
      </RouterProvider>
    </ThemeProvider>
  </StrictMode>
)
