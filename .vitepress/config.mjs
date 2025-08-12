import { defineConfig } from "vitepress";
import it_plantuml from "markdown-it-plantuml";

import { loadSidebarFolders } from "./utils/configLoader";
import obsidianCallout from "./utils/obsidianCallout";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "老s的芝士库",
  description: "A VitePress Site",
  head: [["link", { rel: "icon", href: "/logo.svg" }]],
  markdown: {
    // 启用软换行
    breaks: true,
    gfmAlerts: false,
    config: (md) => {
      md.use(it_plantuml, { openMarker: "```puml", closeMarker: "```" });
      md.use(obsidianCallout);
    },
  },
  vite: {
    server: {
      allowedHosts: true
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo.svg",
    outline: [1, 5],
    nav: [
      { text: "Home", link: "/" },
      { text: "全局变量", link: "/test/test" },
    ],

    sidebar: loadSidebarFolders(),

    socialLinks: [{ icon: "github", link: "https://github.com/Blontern/KnowledgeBase" }],
  },
});
