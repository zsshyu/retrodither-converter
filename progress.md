# RetroDither Converter - 开发日志

## 项目概述

- **项目名称：** RetroDither Converter (复古抖动风格生成器)
- **技术栈：** Vanilla JS + TypeScript + Vite + Tailwind CSS
- **仓库路径：** `D:/Code/Projects/wave-core/retrodither-converter`

---

## 开发日志

### 2026-02-17 (Day 1)

#### 时间线

| 时间 | 事件 |
|------|------|
| 上午 | 项目初始化，完成基础框架搭建 |
| 下午 | 实现核心抖动算法和 UI 控件 |
| 晚间 | 根据参考图片分析，新增 Tint 模式和 RGB 噪点功能 |
| 深夜 | UI 风格重设计，对比度扩展，响应式优化 |

#### 完成的任务

**Phase 1: 基础框架搭建**
- [x] 初始化 Vite + TypeScript 项目
- [x] 配置 Tailwind CSS
- [x] 创建基础 HTML 布局（左右分栏响应式）
- [x] 实现图片上传组件（拖拽 + 点击）
- [x] 实现 Canvas 预览组件
- [x] 创建状态管理 store

**Phase 2: 核心算法实现**
- [x] 像素化算法 (`pixelate.ts`)
- [x] 亮度/对比度调整 (`adjustments.ts`)
- [x] 灰度转换
- [x] Bayer 有序抖动 (`bayer.ts`) - 支持 2x2, 4x4, 8x8 矩阵
- [x] Floyd-Steinberg 误差扩散 (`floydSteinberg.ts`)
- [x] Atkinson 抖动 (`atkinson.ts`)
- [x] Jarvis-Judice-Ninke 抖动 (`jarvis.ts`)
- [x] 颜色映射 (`colorMap.ts`)

**Phase 3: 控制面板开发**
- [x] 像素大小滑块 (1-32px)
- [x] 亮度/对比度滑块 (-100 ~ +100)
- [x] 算法选择下拉框
- [x] 矩阵尺寸选择 (仅 Bayer)
- [x] 阈值滑块 (0-255)
- [x] 颜色选择器（暗部/亮部）
- [x] 噪点强度滑块 (0-100%)
- [x] 参数重置按钮
- [x] 预设选择器 (8 个基础预设)

**Phase 4: Web Worker 集成**
- [x] 创建 `imageProcessor.worker.ts`
- [x] 实现主线程与 Worker 通信
- [x] 防抖优化 (100ms)
- [x] Loading 状态指示

**Phase 5: 高级功能**
- [x] 原图对比功能（按住显示）
- [x] 图片导出 (PNG/JPEG/WebP)
- [x] 导出尺寸选项 (1x/2x/4x)
- [x] 最近邻插值放大

**Phase 6: 新增功能 (基于参考图片分析)**
- [x] Tint 色调渐变映射模式
- [x] RGB 彩色噪点 (CRT 效果)
- [x] 颜色模式选择 UI (Duotone/Tint)
- [x] 噪点类型选择 UI (Grayscale/RGB)
- [x] 新增 4 个预设: CRT Blue, CRT Green, VHS Purple, Film Grain

**Phase 7: UI 风格重设计与优化 (v1.2.0)**
- [x] 对比度范围扩展至 -100 ~ +200 (支持过曝超现实效果)
- [x] 配色方案：绿色 (#00ff88) → 亮灰白 (#e0e0e0)
- [x] 标题字体：Courier New 复古打字机风格
- [x] 全局字体线宽降低 (font-weight: 300)
- [x] 自定义 Favicon：黑色矩形 + 斜线穿过设计
- [x] 响应式布局优化：小屏幕下预览区域最小高度保证

**Phase 8: 国际化支持 (v1.3.0)**
- [x] 创建 i18n 模块 (`src/i18n/index.ts`)
- [x] 支持中文、英文、法语三种语言
- [x] 语言切换器 UI (header 右上角)
- [x] 语言偏好持久化 (localStorage)
- [x] 浏览器语言自动检测
- [x] 所有 UI 文本国际化

**Phase 9: WYSIWYG 优化 (v1.4.0)**
- [x] 实现所见即所得：预览与下载完全一致
- [x] 图片缩放到预览区域实际尺寸后处理
- [x] 移除 Tint 色调渐变模式
- [x] 移除 VHS Purple 和 Film Grain 预设
- [x] 修复原图对比功能居中显示问题
- [x] 添加 *.zip 到 .gitignore

#### 文件变更记录

**新建文件：**
```
retrodither-converter/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── plan.md
├── progress.md (本文件)
└── src/
    ├── main.ts
    ├── style.css
    ├── types/index.ts
    ├── state/store.ts
    ├── constants/presets.ts
    ├── constants/matrices.ts
    ├── utils/debounce.ts
    ├── utils/canvas.ts
    ├── utils/color.ts
    ├── algorithms/pixelate.ts
    ├── algorithms/adjustments.ts
    ├── algorithms/colorMap.ts
    ├── algorithms/dither/bayer.ts
    ├── algorithms/dither/floydSteinberg.ts
    ├── algorithms/dither/atkinson.ts
    ├── algorithms/dither/jarvis.ts
    └── workers/imageProcessor.worker.ts
```

**修改文件 (Phase 6 新增功能)：**
| 文件 | 修改内容 |
|------|----------|
| `src/types/index.ts` | 添加 `ColorMode`, `NoiseType` 类型，更新 `DitherParams` 和 `Preset` 接口 |
| `src/state/store.ts` | 添加 `colorMode`, `noiseType` 默认参数 |
| `src/algorithms/colorMap.ts` | 新增 `mapToTint()` 函数，重构 `mapToColors()` 支持模式切换 |
| `src/algorithms/adjustments.ts` | 新增 `addRgbNoise()` 函数，重构 `addNoise()` 支持类型切换 |
| `src/workers/imageProcessor.worker.ts` | 集成 Tint 模式处理流程，调整噪点应用时机 |
| `src/constants/presets.ts` | 新增 4 个预设，扩展预设结构支持 colorMode/noiseType |
| `index.html` | 添加颜色模式和噪点类型选择器 |
| `src/main.ts` | 添加新控件事件处理，实现 Tint 模式下隐藏抖动相关控件 |

**修改文件 (Phase 7 UI 重设计)：**
| 文件 | 修改内容 |
|------|----------|
| `tailwind.config.js` | accent 颜色改为亮灰白，添加 mono-title 字体 |
| `src/style.css` | 滑块样式更新，全局字体线宽降低 |
| `index.html` | 标题字体、Favicon、响应式布局优化 |
| `src/algorithms/adjustments.ts` | 对比度范围扩展支持 |

**修改文件 (Phase 8 国际化)：**
| 文件 | 修改内容 |
|------|----------|
| `src/i18n/index.ts` | 新建，包含翻译文本和语言切换逻辑 |
| `index.html` | 添加语言选择器，为所有可翻译元素添加 ID |
| `src/main.ts` | 导入 i18n 模块，实现 `applyLanguage()` 函数 |

#### 构建状态

```
✓ TypeScript 编译通过
✓ Vite 构建成功
✓ 输出文件:
  - dist/assets/imageProcessor.worker-C2pZm-lQ.js (5.32 kB)
  - dist/index.html (9.75 kB, gzip: 2.52 kB)
  - dist/assets/index-DGjv0P6K.css (10.57 kB, gzip: 2.88 kB)
  - dist/assets/index-Bn5Loojg.js (9.01 kB, gzip: 2.95 kB)
```

#### 技术决策

1. **Tint 模式跳过抖动** - 在 Tint 模式下直接进行颜色映射，保留完整灰度层次，不应用抖动算法
2. **RGB 噪点独立通道** - 每个颜色通道独立添加随机噪点，产生类似 CRT 的彩色噪点效果
3. **噪点应用时机** - Duotone 模式下灰度噪点在抖动前应用，RGB 噪点在颜色映射后应用；Tint 模式下噪点统一在颜色映射后应用

---

## 更新路线图

### v1.0.0 (2026-02-17) ✅
- 基础抖动功能
- 4 种抖动算法
- Duotone 颜色映射
- 8 个基础预设
- 图片导出

### v1.1.0 (2026-02-17) ✅
- Tint 色调渐变映射
- RGB 彩色噪点
- 4 个新预设 (CRT/VHS 风格)
- UI 优化 (Tint 模式隐藏抖动控件)

### v1.2.0 (2026-02-17) ✅
- 对比度范围扩展至 -100 ~ +200 (支持过曝效果)
- UI 风格重设计：亮灰白配色替代绿色
- 标题使用 Courier New 复古打字机字体
- 全局字体线宽降低 (font-weight: 300)
- 自定义 Favicon：黑色矩形 + 斜线穿过
- 响应式布局优化：小屏幕适配

### v1.3.0 (2026-02-17) ✅
- 国际化支持 (i18n)：中文、英文、法语
- 语言切换器 UI
- 语言偏好持久化 (localStorage)
- 浏览器语言自动检测

### v1.4.0 (2026-02-17) ✅
- WYSIWYG 所见即所得：预览与下载完全一致
- 图片自动缩放到预览区域尺寸后处理
- 移除 Tint 模式，简化为纯 Duotone
- 修复原图对比功能居中显示
- 减少预设数量至 10 个

### v1.5.0 (计划中)
- [ ] 画布缩放功能
- [ ] 噪点混合模式 (Overlay/Screen)
- [ ] 更多预设

### v2.0.0 (未来)
- [ ] 批量处理
- [ ] GIF 动画支持
- [ ] 历史记录/撤销
- [ ] 多色调色板 (4/8/16 色)

---

## 问题与解决方案

| 问题 | 解决方案 |
|------|----------|
| 大图处理卡顿 | 使用 Web Worker 后台处理 |
| 参数调整频繁触发处理 | 添加 100ms 防抖 |
| 对比度不够极端 | 扩展范围至 +200，支持过曝效果 |
| 小屏幕下预览区被控制面板遮挡 | 添加最小高度限制，控制面板限制最大高度 |
| 预览与下载效果不一致 | 图片缩放到预览区域尺寸后处理，实现 WYSIWYG |
| 原图对比功能位置错误 | 使用相对定位 wrapper 包裹两个 canvas，确保重叠居中 |
| 小屏幕下预览区被控制面板遮挡 | 添加最小高度限制，控制面板限制最大高度 |

---

## 备注

- 开发服务器: `npm run dev` (默认 http://localhost:5173)
- 生产构建: `npm run build`
- 预览构建: `npm run preview`
