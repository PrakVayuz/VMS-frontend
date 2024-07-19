// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   const env = loadEnv(mode, process.cwd(), '');
//   return {
//     define: {
//       'process.env': env
//     },
//   plugins: [react()],
  // resolve: {
  //   alias: [{ find: "@", replacement: "/src" }],
  // },
// });

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env
    },
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: "/src" }],
    },
  }
})