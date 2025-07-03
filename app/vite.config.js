import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';

dotenv.config();
const env = process.env

export default defineConfig({
  plugins: [react()],
  // vite config for environment variables
  define: {
    ...Object.keys(env).reduce((prev, key) => {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, "_");

      prev[`${sanitizedKey}`] = JSON.stringify(env[key]);

      return prev;
    }, {})
  },
});
