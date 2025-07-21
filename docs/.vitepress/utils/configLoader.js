// vitepress sidebar
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export function loadSidebarFolders(dirpath) {
  const sidebarConfig = {};

  try {
    // 读取目录下的所有文件和文件夹
    const items = fs.readdirSync(dirpath, { withFileTypes: true });

    // 遍历所有项目，只处理文件夹
    items.forEach((item) => {
      if (item.isDirectory()) {
        const folderName = item.name;
        const tocPath = path.join(dirpath, folderName, "_toc_.yaml");

        // 检查是否存在 _toc_.yaml 文件
        if (fs.existsSync(tocPath)) {
          try {
            // 读取并解析 YAML 文件
            const fileContent = fs.readFileSync(tocPath, "utf8");
            const tocData = yaml.load(fileContent);

            // 将解析后的数据添加到配置对象
            sidebarConfig[`/${folderName}`] = tocData;
          } catch (e) {
            console.error(
              `Error parsing _toc_.yaml in ${folderName}:`,
              e.message
            );
          }
        }
      }
    });

    return sidebarConfig;
  } catch (e) {
    console.error("Error loading sidebar directory:", e.message);
    return {};
  }
}
