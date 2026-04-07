# ddup

这是一个儿童学习类 PWA 工具，面向桌面浏览器与平板设备（如小米平板）。

## 技术栈

- Vue 3
- Vite
- vite-plugin-pwa
- Vercel（部署）

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:5173`

## 构建与预览

```bash
npm run build
npm run preview
```

如果需要局域网访问预览版本，可使用：

```bash
npm run serve
```

## PWA 说明

- 已启用 Service Worker 自动注册与自动更新
- 已配置 Web App Manifest（独立窗口显示、主题色等）
- 生产构建后会在 `dist/` 目录生成 `sw.js` 与 `manifest.webmanifest`

## 部署（Vercel）

项目已包含 `vercel.json`，可直接在 Vercel 导入仓库并部署。

## 运行环境

- 桌面浏览器（推荐 Chrome / Edge 最新版）
- 小米平板（现代 Chromium 内核浏览器）