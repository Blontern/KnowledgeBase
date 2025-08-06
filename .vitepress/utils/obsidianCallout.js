/* addons
 * 作者: Blontern
 * 插件名: obsidianCallout
 * 原插件: Vitepress/gitHubAlertsPlugin
 * 【使用方法】
 * import obsidianCallout from 'obsidianCallout';
 * export default defineConfig({
 *   markdown: {
 *     gfmAlerts: false,
 *     config: (md) =>{
 *       md.use(obsidianCallout);
 *     }
 *   }
 * });
 */
const markerRE =
  /^\[!(NOTE|ABSTRACT|INFO|QUESTION|TIP|DANGER|BUG|EXAMPLE|QUOTE|SUCCESS|FAILURE|WARNING)\]([^\n\r]*)/i;

// 图标配置对象
const calloutIcons = {
  note: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>`,
  abstract: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-clipboard-list"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-info"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
  question: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>`,
  tip: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>`,
  bug: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-bug"><path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path><path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path><path d="M6 13H2"></path><path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path><path d="M22 13h-4"></path><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path></svg>`,
  example: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  quote: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-quote"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check"><path d="M20 6 9 17l-5-5"></path></svg>`,
  failure: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`,
};

const obsidianCallout = (md, options) => {
  const titleMark = {
    note: options?.noteLabel || "NOTE",
    abstract: options?.abstractLabel || "ABSTRACT",
    info: options?.infoLabel || "INFO",
    question: options?.questionLabel || "QUESTION",
    tip: options?.tipLabel || "TIP",
    danger: options?.dangerLabel || "DANGER",
    bug: options?.bugLabel || "BUG",
    example: options?.exampleLabel || "EXAMPLE",
    quote: options?.quoteLabel || "QUOTE",
    success: options?.successLabel || "SUCCESS",
    failure: options?.failureLabel || "FAILURE",
    warning: options?.warningLabel || "WARNING",
  };

  // 处理块引用转换
  md.core.ruler.after("block", "github-alerts", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "blockquote_open") {
        const startIndex = i;
        const openToken = tokens[startIndex];

        // 查找匹配的关闭标签
        let endIndex = i + 1;
        while (
          endIndex < tokens.length &&
          (tokens[endIndex].type !== "blockquote_close" ||
            tokens[endIndex].level !== openToken.level)
        ) {
          endIndex++;
        }
        if (endIndex === tokens.length) continue;

        const closeToken = tokens[endIndex];
        const firstContentToken = tokens
          .slice(startIndex, endIndex + 1)
          .find((token) => token.type === "inline");

        if (!firstContentToken) continue;

        const match = firstContentToken.content.match(markerRE);
        if (!match) continue;

        // 提取类型和标题
        const type = match[1].toLowerCase();
        const title = match[2].trim() || titleMark[type] || capitalize(type);
        firstContentToken.content = firstContentToken.content
          .slice(match[0].length)
          .trimStart();

        // 转换标记类型
        openToken.type = "obsidian_callout_open";
        openToken.tag = "div";
        openToken.meta = { title, type };
        closeToken.type = "obsidian_callout_close";
        closeToken.tag = "div";

        // 插入内容容器
        const contentOpen = new state.Token(
          "obsidian_callout_content_open",
          "div",
          1
        );
        contentOpen.block = true;
        tokens.splice(endIndex, 0, contentOpen);
        endIndex++;

        const contentClose = new state.Token(
          "obsidian_callout_content_close",
          "div",
          -1
        );
        contentClose.block = true;
        tokens.splice(endIndex, 0, contentClose);
        endIndex++;

        i = endIndex; // 跳过已处理部分
      }
    }
  });

  // 渲染规则
  md.renderer.rules.obsidian_callout_open = function (tokens, idx) {
    const { title, type } = tokens[idx].meta;
    const iconSvg = calloutIcons[type] || "";

    return `<div class="callout ${type}">
      <div class="callout-title">
        <div class="callout-icon">${iconSvg}</div>
        <div class="callout-title-text">${title}</div>
      </div>`;
  };

  md.renderer.rules.obsidian_callout_content_open = () =>
    '<div class="callout-content">\n';

  md.renderer.rules.obsidian_callout_content_close = () => "</div>\n";

  md.renderer.rules.obsidian_callout_close = () => "</div>\n";
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default obsidianCallout;
