import { defineConfig } from "vite";

// Served from https://ntufar.github.io/astrolove/ (a project page, not a
// user/org page), so assets must be referenced under the /astrolove/ base
// rather than site root.
export default defineConfig({
  base: "/astrolove/",
});
