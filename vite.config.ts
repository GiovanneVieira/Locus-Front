import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const duffelToken = env.VITE_DUFFEL_API_TOKEN
  const duffelVersion = env.VITE_DUFFEL_VERSION || "v2"

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: duffelToken
        ? {
            "/api/duffel": {
              target: "https://api.duffel.com",
              changeOrigin: true,
              secure: true,
              rewrite: (requestPath) => requestPath.replace(/^\/api\/duffel/, ""),
              headers: {
                Authorization: `Bearer ${duffelToken}`,
                "Duffel-Version": duffelVersion,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            },
          }
        : undefined,
    },
  }
})
