import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function loadSidebarFolders(directories = ["docs", "test"]) {
  const sidebarConfig = {};
  
  directories.forEach(dir => {
    try {
      // 检查目录是否存在
      if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
        console.warn(`Directory not found: ${dir}`);
        return;
      }

      // 读取目录内容
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        if (item.isDirectory()) {
          const folderPath = path.join(dir, item.name);
          const tocPath = path.join(folderPath, "_toc_.yaml");
          
          if (fs.existsSync(tocPath)) {
            try {
              const fileContent = fs.readFileSync(tocPath, "utf8");
              const tocData = yaml.load(fileContent);
              
              // 生成规范的路径key (使用正斜杠)
              const configKey = `/${folderPath.replace(/\\/g, '/')}`;
              sidebarConfig[configKey] = tocData;
            } catch (e) {
              console.error(`Error parsing _toc_.yaml in ${folderPath}:`, e.message);
            }
          }
        }
      });
    } catch (e) {
      console.error(`Error processing directory ${dir}:`, e.message);
    }
  });

  return sidebarConfig;
}