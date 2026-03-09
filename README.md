# 扫雷游戏 (Minesweeper)

一个使用 React + TypeScript + Vite 构建的经典扫雷游戏。

## 🎮 游戏截图

### 游戏界面
![游戏界面](./screenshots/game-interface.png)

### 游戏胜利
![游戏胜利](./screenshots/game-win.png)

## 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **Vite 7** - 构建工具
- **Zustand** - 状态管理
- **Lucide React** - 图标库
- **CSS Modules** - 样式隔离

## 功能特性

- 三种预设难度：简单、中等、困难
- 支持自定义难度设置
- 首次点击安全机制（第一次点击不会踩雷）
- 计时器功能
- 旗帜标记功能
- 双击展开（Chord）功能：当已揭开格子周围的旗帜数量等于数字时，双击可自动展开周围未揭开的格子
- 游戏胜利/失败提示

## 如何运行项目

### 环境要求

- Node.js 18.0 或更高版本
- npm 9.0 或更高版本

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器：

```bash
npm run dev
```

启动后，在浏览器中打开 http://localhost:5173 即可开始游戏。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
mines/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 组件目录
│   │   ├── Cell.tsx       # 格子组件
│   │   ├── Grid.tsx       # 游戏网格组件
│   │   ├── Header.tsx     # 头部组件（计时器、旗帜计数）
│   │   ├── DifficultySelector.tsx  # 难度选择器
│   │   └── GameOverModal.tsx       # 游戏结束弹窗
│   ├── store/
│   │   └── useGameStore.ts  # Zustand 状态管理
│   ├── styles/
│   │   └── variables.css    # CSS 变量定义
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
├── screenshots/            # 游戏截图
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目配置
```

## 🎯 游戏玩法

1. **揭开格子**：左键点击格子揭开它
2. **标记旗帜**：右键点击格子放置/移除旗帜
3. **双击展开**：当一个数字格子周围的旗帜数量等于该数字时，双击可自动展开周围未揭开的格子
4. **获胜条件**：揭开所有非地雷格子
5. **失败条件**：点击到地雷格子

## 📊 难度设置

| 难度 | 行数 | 列数 | 地雷数 |
|------|------|------|--------|
| 简单 | 8 | 8 | 10 |
| 中等 | 16 | 16 | 40 |
| 困难 | 16 | 30 | 99 |
| 自定义 | 自定义 | 自定义 | 自定义 |

## 📝 许可证

MIT