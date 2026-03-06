# Event App

一个基于 Vue 3 + TypeScript 开发的事件浏览应用，集成 Ticketmaster API 获取事件数据，并支持打包为 Android 应用。

## 功能特性

- 事件列表展示：浏览来自 Ticketmaster API 的事件数据
- 事件详情：查看事件的详细信息，包括日期、场馆、分类等
- 分页功能：支持事件列表的分页浏览
- 响应式设计：适配不同屏幕尺寸
- Android 应用：可打包为 Android 原生应用

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **路由管理**：Vue Router
- **网络请求**：Axios
- **API 集成**：Ticketmaster API
- **跨平台**：Capacitor
- **版本控制**：Git

## 安装与运行

### 1. 克隆仓库

```bash
git clone https://github.com/Future223/event-app.git
cd event-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

### 5. 打包为 Android 应用

```bash
# 确保已构建生产版本
npm run build

# 同步 Web 构建产物到 Android 项目
npx cap sync android

# 在 Android Studio 中打开项目
npx cap open android
```

## 项目结构

```
├── src/
│   ├── components/      # 组件目录
│   ├── views/           # 页面视图
│   │   ├── HomePage.vue     # 事件列表页
│   │   └── EventDetailPage.vue  # 事件详情页
│   ├── services/        # 服务层
│   │   └── api.ts       # API 调用逻辑
│   ├── types/           # TypeScript 类型定义
│   │   └── event.ts     # 事件类型定义
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── router.ts        # 路由配置
├── android/             # Android 项目目录
├── dist/                # 构建输出目录
├── package.json         # 项目配置和依赖
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── capacitor.config.ts  # Capacitor 配置
```

## API 配置

项目使用 Ticketmaster API 获取事件数据，API 密钥已内置在 `src/services/api.ts` 文件中。

## 注意事项

- 确保网络连接正常，以便获取 Ticketmaster API 数据
- 打包 Android 应用时需要安装 Android Studio 和相关依赖
- 若遇到 Git 推送认证问题，请在本地终端手动执行 `git push -u origin main` 并输入 GitHub 账号密码或个人访问令牌

## 许可证

MIT License