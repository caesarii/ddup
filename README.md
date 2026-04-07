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

## /api 服务说明

项目使用 Vercel Serverless Functions 提供后端接口，目录位于根目录 `api/`。

当前接口：

- `POST /api/auth/login`：账号密码登录
- `GET /api/progress/:username`：读取用户课程进度
- `PUT /api/progress/:username`：保存用户课程进度
- `GET /api/health`：健康检查

数据持久化：

- 生产环境优先使用 `Vercel KV`
- 当未配置 KV 环境变量时，接口会降级为内存存储（仅适合本地调试，重启后会丢失）

Vercel 需要配置的环境变量：

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

说明：

- 前端统一通过 `src/components/api.js` 调用上述 HTTP 接口
- `vercel.json` 已配置 `filesystem` 优先，`/api/*` 不会被 SPA fallback 覆盖

## 本地联调 /api 的步骤

推荐使用 `vercel dev` 在本地同时启动前端与 `api/` 函数路由。

1. 安装依赖并登录 Vercel CLI（首次需要）：

```bash
npm install
npx vercel login
```

2. 关联当前项目（首次需要）：

```bash
npx vercel link
```

3. 拉取 Vercel 环境变量到本地（包含 KV）：

```bash
npx vercel env pull .env.local
```

4. 启动本地联调：

```bash
npx vercel dev
```

启动后可通过 `http://localhost:3000` 访问应用，并联调 `/api/*` 接口。

## 运行环境

- 桌面浏览器（推荐 Chrome / Edge 最新版）
- 小米平板（现代 Chromium 内核浏览器）