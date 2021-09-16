import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  build: { manifest: true },
  base: process.env === "production" ? "/static/" : "/",
  root: "./react-app",
  plugins: [
    reactRefresh(),
    viteCompression(),
    VitePWA({
      workbox: {
        inlineWorkboxRuntime: true,
        navigateFallbackDenylist: [/^\/admin/, /^\/api/],
        modifyURLPrefix: {
          assets: "static/assets"
        }
      }
    })
  ]
});
