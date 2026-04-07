# ddup


## 开发与调试

### 1) 纯前端开发（Vite）

适合页面样式、交互、组件开发，不依赖本地 `/api` 函数联调。

```bash
npm install
npm run dev
```

- 默认地址：`http://localhost:5173`
- 由 Vite Dev Server 提供热更新（HMR）

### 2) 前后端联调（Vercel 本地运行）

适合需要调试 `api/` 路由与 Vercel Functions 的场景。

1. 首次登录并关联项目：

```bash
npx vercel login
npx vercel link
```

2. 启动本地联调：

```bash
npx vercel dev
```

- 默认地址：`http://localhost:3000`
- 会同时处理静态资源与 `/api/` 开头路由

## 构建与预览（生产构建）

```bash
npm run build
npm run preview
```

如果需要局域网访问预览版本：

```bash
npm run serve
```

## PWA 说明

- 已启用 Service Worker 自动注册与自动更新
- 已配置 Web App Manifest（独立窗口显示、主题色等）
- 生产构建后会在 `dist/` 目录生成 `sw.js` 与 `manifest.webmanifest`

## 部署（Vercel）

项目已包含 `vercel.json`，Vercel 会使用以下流程部署：

- 执行 `npm run build`（即 `vite build`）
- 输出目录为 `dist/`
- `api/` 目录下文件作为 Serverless Functions 运行

直接在 Vercel 导入仓库并部署即可。

## /api 服务说明

项目使用 Vercel Serverless Functions 提供后端接口，目录位于根目录 `api/`。

当前接口：

- `POST /api/auth/login`：账号密码登录
- `GET /api/progress/:username`：读取用户课程进度
- `PUT /api/progress/:username`：保存用户课程进度
- `PATCH /api/progress/:username`：部分更新用户课程进度
- `GET /api/health`：健康检查

登录数据说明：

- `api/data/users.json` 使用 `passwordHash` 存储密码哈希（不再使用明文密码）
- 当前哈希算法：`sha256(username + ":" + password)`

数据持久化：

- 用户账号数据保存在 `api/data/users.json`
- 用户课程进度保存在 `api/data/userCourseProgress.json`
- 课程目录保存在 `api/data/courseCatalog.json`
- 接口会直接读写上述 JSON 文件（本地开发与部署逻辑一致）

说明：

- 前端统一通过 `src/components/api.js` 调用上述 HTTP 接口
- `vercel.json` 已配置 `filesystem` 优先，`/api/` 开头路由不会被 SPA fallback 覆盖

## 常见问题

### Vercel 构建时安装依赖失败（EHOSTUNREACH）

如果遇到依赖安装阶段访问私有 registry 失败，请确认仓库根目录存在：

```bash
.npmrc
```

并包含：

```bash
registry=https://registry.npmjs.org/
```

同时建议提交最新 `package-lock.json`，避免锁文件中残留内网源地址。

## 运行环境

- 桌面浏览器（推荐 Chrome / Edge 最新版）
- 小米平板（现代 Chromium 内核浏览器）


https://console.neon.tech/app/projects/plain-feather-90665178