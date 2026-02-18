# RetroDither Converter - 复古抖动风格生成器开发计划

## Context 项目背景

用户希望开发一个轻量级网页工具，允许上传图片并通过调整参数（颜色、对比度、像素大小、抖动算法）生成复古数码风格的图片。这类工具在设计师、艺术家和复古风格爱好者中有广泛需求，可用于海报设计、社交媒体内容创作、游戏素材制作等场景。

**技术选型确认：**
- 框架：Vanilla JS + TypeScript（轻量、零框架开销）
- 抖动算法：Bayer (有序抖动) + None (无抖动)
- 调色板：自定义 2-4 色调色板

---

## 参考图片分析 (2024-02-17 新增)

基于用户提供的参考图片，分析出以下关键视觉特征：

### 视觉特征

1. **RGB 彩色噪点** - 整个画面覆盖着细密的彩色噪点，类似老式 CRT 显示器或胶片颗粒效果
   - 噪点是随机分布的红、绿、蓝色小点
   - 密度较高，覆盖整个画面
   - 与底层图像混合，营造复古感

2. **色调渐变映射** - 不是简单的硬性双色，而是保留灰度层次的色调映射
   - 从深色到浅色有自然的渐变过渡
   - 类似 Photoshop 的 "Colorize" 或 "Duotone" 效果
   - 暗部和亮部之间有丰富的中间调

3. **抖动效果** - 使用误差扩散类算法（Floyd-Steinberg 或 Atkinson）
   - 在明暗过渡区域有自然的抖动纹理
   - 不是规则的网格图案

4. **轻微像素化** - 有一定的像素化效果，但不是主要特征

### 当前实现缺失的功能

| 缺失功能 | 描述 | 优先级 |
|----------|------|--------|
| RGB 彩色噪点 | 目前只有灰度噪点，需要新增随机 RGB 彩色噪点 | 高 |
| 色调渐变映射 | 目前是硬性双色映射，需要支持保留灰度层次的 Tint/Colorize 模式 | 高 |
| 噪点类型选择 | 需要支持灰度噪点和 RGB 彩色噪点两种模式 | 中 |
| 噪点混合模式 | 控制噪点如何与底图混合（叠加、正片叠底等） | 中 |

---

## 1. 需求文档修订与补充

### 1.1 原文档问题分析

| 问题 | 建议修改 |
|------|----------|
| 缺少输出格式选项 | 增加 PNG/JPEG/WebP 格式选择 |
| 缺少图片尺寸限制说明 | 明确最大支持尺寸和性能预期 |
| 噪点功能定位模糊 | 明确为可选增强功能，支持灰度和 RGB 两种模式 |
| 缺少预设功能 | 增加常用风格预设（双色配色预设） |
| 缺少撤销/重置功能 | 增加参数重置按钮 |
| 缺少移动端适配说明 | 补充响应式设计需求 |
| **缺少色调映射模式** | **新增 Duotone / Tint 两种颜色映射模式** |
| **缺少 RGB 噪点** | **新增 RGB 彩色噪点选项** |

### 1.2 补充功能建议

#### 1.2.1 预设系统 (Presets)
- **功能描述：** 提供常用双色配色风格的一键应用
- **预设列表：**
  - Classic B&W (纯黑白)
  - Macintosh (黑 + 米白)
  - Amber Terminal (黑 + 琥珀色)
  - Green Phosphor (黑 + 荧光绿)
  - Blueprint (深蓝 + 白)
  - Neon Cyan (黑 + 荧光青)
  - **CRT Blue (深蓝渐变 + RGB噪点) - 参考图片风格**

#### 1.2.2 导出增强
- **格式选择：** PNG (推荐) / JPEG / WebP
- **尺寸选项：** 原始尺寸 / 2x / 4x / 自定义
- **透明背景：** 可选（仅 PNG）

#### 1.2.3 性能与限制
- **最大图片尺寸：** 4096 x 4096 像素
- **推荐图片尺寸：** < 2000 x 2000 像素（实时预览）
- **大图处理：** 显示进度条，后台处理

#### 1.2.4 颜色映射模式 (新增)
- **Duotone 模式：** 硬性双色映射，灰度值 > 阈值 → 亮色，否则 → 暗色
- **Tint 模式：** 保留灰度层次的色调映射，从暗色渐变到亮色

#### 1.2.5 噪点系统 (增强)
- **噪点类型：**
  - Grayscale (灰度噪点) - 随机灰度值
  - RGB (彩色噪点) - 随机 R/G/B 通道值，类似 CRT 效果
- **噪点强度：** 0-100%
- **噪点混合模式：** Normal / Overlay / Screen

### 1.3 修订后的参数范围

| 参数 | 范围 | 默认值 | 步进 |
|------|------|--------|------|
| Pixel Size | 1-32 px | 1 px | 1 |
| Brightness | -100 ~ +100 | 0 | 1 |
| Contrast | -100 ~ +200 | 20 | 1 |
| Matrix Size | 2x2, 4x4, 8x8 | 4x4 | - |
| Threshold | 0-255 | 128 | 1 |
| **Palette Colors** | 2-4 | 4 | - |
| **Noise Type** | Grayscale / RGB | Grayscale | - |
| Noise Amount | 0-100% | 0% | 1 |

---

## 2. 技术架构设计

### 2.1 技术栈选择

```
前端框架：Vanilla JS + TypeScript（零框架开销，轻量快速）
构建工具：Vite 5
样式方案：Tailwind CSS
图像处理：Canvas API + Web Worker
文件处理：FileSaver.js
部署平台：Vercel / Netlify / GitHub Pages
```

**选择理由：**
- Vanilla JS + TypeScript：无框架依赖，打包体积最小（~5KB vs React ~45KB）
- Vite：开发体验好，构建速度快，原生支持 TypeScript
- Tailwind CSS：快速样式开发，响应式支持好
- Web Worker：避免主线程阻塞，保证 UI 流畅

### 2.2 项目结构

```
retrodither-converter/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── PreviewCanvas.ts       # 预览画布
│   │   ├── ControlPanel.ts        # 控制面板
│   │   ├── ImageUploader.ts       # 图片上传
│   │   ├── ColorPicker.ts         # 颜色选择器
│   │   └── ExportButton.ts        # 导出按钮
│   ├── workers/
│   │   └── imageProcessor.worker.ts   # 图像处理 Worker
│   ├── algorithms/
│   │   ├── dither/
│   │   │   ├── bayer.ts               # Bayer 抖动
│   │   │   ├── floydSteinberg.ts      # Floyd-Steinberg
│   │   │   ├── atkinson.ts            # Atkinson
│   │   │   └── jarvis.ts              # Jarvis-Judice-Ninke
│   │   ├── pixelate.ts                # 像素化
│   │   ├── adjustments.ts             # 亮度/对比度
│   │   ├── colorMap.ts                # 颜色映射 (Duotone + Tint)
│   │   └── noise.ts                   # 噪点生成 (Grayscale + RGB)
│   ├── state/
│   │   └── store.ts                   # 简单状态管理
│   ├── types/
│   │   └── index.ts                   # 类型定义
│   ├── utils/
│   │   ├── canvas.ts                  # Canvas 工具函数
│   │   ├── color.ts                   # 颜色工具函数
│   │   └── debounce.ts                # 防抖函数
│   ├── constants/
│   │   ├── presets.ts                 # 预设配置
│   │   └── matrices.ts                # Bayer 矩阵
│   ├── main.ts                        # 入口文件
│   └── style.css                      # 样式文件
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── plan.md                            # 本规划文档
```

### 2.3 数据流设计

```
用户操作 → State Store → Debounce → Web Worker → Canvas 渲染
                ↑                           ↓
              参数更新 ←←←←←←←←←←←←←← 处理完成回调
```

### 2.4 核心算法实现要点

#### Bayer Dithering (Ordered)
```typescript
// 4x4 Bayer 矩阵 - 产生规则网格纹理
const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5]
];
// threshold = (matrix[y % size][x % size] + 0.5) / (size * size)
```

#### Floyd-Steinberg 误差扩散
```
当前像素误差分布（随机噪点效果）：
      X   7/16
3/16  5/16  1/16
```

#### Atkinson 误差扩散
```
只扩散 75% 误差（高对比度效果）：
      X   1/8  1/8
1/8  1/8  1/8
     1/8
```

#### Jarvis-Judice-Ninke 误差扩散
```
5x3 矩阵，最平滑的过渡效果：
          X   7/48  5/48
3/48  5/48  7/48  5/48  3/48
1/48  3/48  5/48  3/48  1/48
```

#### 颜色映射模式 (新增)

```typescript
// Duotone 模式 - 硬性双色
function duotoneMap(gray: number, threshold: number, dark: RGB, light: RGB): RGB {
  return gray > threshold ? light : dark;
}

// Tint 模式 - 渐变色调映射
function tintMap(gray: number, dark: RGB, light: RGB): RGB {
  const t = gray / 255; // 0-1 归一化
  return {
    r: dark.r + (light.r - dark.r) * t,
    g: dark.g + (light.g - dark.g) * t,
    b: dark.b + (light.b - dark.b) * t
  };
}
```

#### RGB 噪点 (新增)

```typescript
// RGB 彩色噪点 - 类似 CRT 效果
function addRgbNoise(imageData: ImageData, amount: number): ImageData {
  const strength = (amount / 100) * 50;
  for (let i = 0; i < data.length; i += 4) {
    // 每个通道独立添加随机噪点
    resultData[i] = clamp(data[i] + randomNoise(strength));     // R
    resultData[i+1] = clamp(data[i+1] + randomNoise(strength)); // G
    resultData[i+2] = clamp(data[i+2] + randomNoise(strength)); // B
  }
  return result;
}
```

---

## 3. 开发阶段规划

### Phase 1: 基础框架搭建 ✅ 已完成

**目标：** 完成项目初始化和基础 UI 框架

**任务清单：**
- [x] 初始化 Vite + TypeScript 项目
- [x] 配置 Tailwind CSS
- [x] 创建基础 HTML 布局（左右分栏）
- [x] 实现图片上传组件（拖拽 + 点击）
- [x] 实现基础 Canvas 预览组件
- [x] 创建简单状态管理 store

### Phase 2: 核心算法实现 ✅ 已完成

**目标：** 实现所有图像处理算法

**任务清单：**
- [x] 实现像素化算法 (pixelate.ts)
- [x] 实现亮度/对比度调整 (adjustments.ts)
- [x] 实现灰度转换
- [x] 实现 Bayer Dithering (bayer.ts)
- [x] 实现 Floyd-Steinberg Dithering (floydSteinberg.ts)
- [x] 实现 Atkinson Dithering (atkinson.ts)
- [x] 实现 Jarvis Dithering (jarvis.ts)
- [x] 实现颜色映射 (colorMap.ts) - 仅 Duotone
- [x] 实现灰度噪点叠加

### Phase 3: 控制面板开发 ✅ 已完成

**目标：** 完成所有参数控制 UI

**任务清单：**
- [x] 实现像素大小滑块
- [x] 实现亮度/对比度滑块
- [x] 实现算法选择下拉框（4种算法）
- [x] 实现矩阵尺寸选择（仅 Bayer）
- [x] 实现阈值滑块
- [x] 实现颜色选择器（暗部/亮部）
- [x] 实现噪点强度滑块
- [x] 实现参数重置按钮
- [x] 实现预设选择器

### Phase 4: Web Worker 集成 ✅ 已完成

**目标：** 优化性能，避免 UI 阻塞

**任务清单：**
- [x] 创建 Web Worker 处理器
- [x] 实现主线程与 Worker 通信
- [x] 添加处理进度反馈
- [x] 实现防抖优化（参数变化时 100ms）
- [x] 添加处理中状态指示（loading spinner）

### Phase 5: 高级功能 ✅ 已完成

**目标：** 完成对比、导出等功能

**任务清单：**
- [x] 实现原图对比功能（按住显示原图）
- [ ] 实现画布缩放功能（滚轮/双指）- 未实现
- [x] 实现图片导出（PNG/JPEG/WebP）
- [x] 实现导出尺寸选项（1x/2x/4x）
- [x] 实现最近邻插值放大

### Phase 6: 新增功能 ✅ 已完成 (2026-02-17)

**目标：** 实现参考图片中的视觉效果

**任务清单：**
- [x] 实现 Tint 色调渐变映射模式
- [x] 实现 RGB 彩色噪点
- [x] 添加噪点类型选择 UI（Grayscale / RGB）
- [x] 添加颜色映射模式选择 UI（Duotone / Tint）
- [x] 新增 CRT Blue 预设（参考图片风格）
- [x] 新增 CRT Green、VHS Purple、Film Grain 预设

**已修改文件：**
- `src/algorithms/colorMap.ts` - 添加 Tint 模式
- `src/algorithms/adjustments.ts` - 添加 RGB 噪点函数
- `src/types/index.ts` - 添加 ColorMode、NoiseType 类型
- `src/state/store.ts` - 添加 colorMode、noiseType 参数
- `src/workers/imageProcessor.worker.ts` - 集成新算法
- `src/main.ts` - 添加新 UI 控件和事件处理
- `index.html` - 添加颜色模式和噪点类型选择器
- `src/constants/presets.ts` - 添加 4 个新预设

---

## 8. 当前项目状态

**版本：** v1.8.2
**最后更新：** 2026-02-17
**构建状态：** ✅ 通过

### 已实现功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 图片上传 | ✅ | 支持拖拽和点击上传 |
| 像素化 | ✅ | 1-32px 可调，默认 1px |
| 亮度/对比度 | ✅ | -100 ~ +200 (扩展范围支持过曝效果) |
| Bayer 抖动 | ✅ | 2x2, 4x4, 8x8, 16x16, 32x32 矩阵 |
| None (无抖动) | ✅ | 直接映射到调色板 |
| 泛光效果 (Bloom) | ✅ | 可调强度、阈值、半径 |
| 自定义调色板 | ✅ | 2-4 色，颜色选择器 + HEX 显示 |
| Duotone 映射 | ✅ | 硬性双色 |
| 灰度噪点 | ✅ | 胶片颗粒效果 |
| RGB 噪点 | ✅ | CRT 彩色效果 |
| 预设系统 | ✅ | 6 个预设 (Retro Blue, Classic B&W, GameBoy Green, Amber Terminal, Sunset, Neon Cyan) |
| 原图对比 | ✅ | 按住显示，居中对齐 |
| 图片导出 | ✅ | PNG/JPEG/WebP, 1x/2x/4x |
| Web Worker | ✅ | 后台处理 |
| 响应式布局 | ✅ | 桌面/移动端，小屏幕适配优化 |
| UI 风格优化 | ✅ | 复古打字机字体、亮灰白配色 |
| 国际化 (i18n) | ✅ | 中文、英文、法语支持 |
| WYSIWYG | ✅ | 预览与下载完全一致 |
| itch.io 部署 | ✅ | 单文件构建 + zip 打包 |

### 待实现功能

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 画布缩放 | 低 | 滚轮/双指缩放 |
| 噪点混合模式 | 低 | Overlay/Screen/Multiply |
| 批量处理 | 低 | 多图片处理 |
| GIF 支持 | 低 | 动画处理 |

---

## 4. UI 设计规范

### 4.1 布局规范

```
桌面端 (>= 1024px):
┌─────────────────────────────────────────────────────┐
│  Header: RetroDither Converter                      │
├───────────────────────────────┬─────────────────────┤
│                               │  Upload Area        │
│                               ├─────────────────────┤
│      Preview Canvas           │  Pixel Size    [━━] │
│      (可缩放)                  │  Brightness   [━━] │
│                               │  Contrast     [━━] │
│                               │  Algorithm    [▼]  │
│                               │  Matrix Size  [▼]  │
│                               │  Threshold    [━━] │
│                               │  Color Mode   [▼]  │  ← 新增
│                               │  Dark Color   [■]  │
│                               │  Light Color  [□]  │
│                               │  Noise Type   [▼]  │  ← 新增
│                               │  Noise        [━━] │
│                               ├─────────────────────┤
│  [Compare] 按住对比原图        │  [Reset] [Download] │
└───────────────────────────────┴─────────────────────┘
```

### 4.2 配色方案

```css
/* 深色主题 - 亮灰白配色 */
--bg-primary: #0f0f0f;
--bg-secondary: #1a1a1a;
--bg-tertiary: #252525;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
--accent: #e0e0e0;
--accent-hover: #ffffff;
```

### 4.3 字体规范

- 标题：Courier New (复古打字机风格)
- 正文：系统默认字体，font-weight: 300 (细体)
- 按钮：font-weight: 400

### 4.4 图标设计

Favicon: 黑色矩形 + 斜线穿过
- 矩形居中，60x60
- 斜线从左下到右上，偏移 1/3
- 斜线在矩形外部分约占总长度 2/5

### 4.3 交互规范

- 滑块：拖动时实时预览（防抖 100ms）
- 颜色选择：点击打开拾色器
- 对比按钮：按住显示原图，松开恢复
- 缩放：鼠标滚轮 / 双指捏合
- 上传：拖拽或点击选择

---

## 5. 验证方案

### 5.1 功能验证

1. **图片上传测试**
   - 测试 JPG/PNG/WebP 格式
   - 测试不同尺寸图片（100px ~ 4096px）
   - 测试拖拽和点击上传
   - 验证超过最大尺寸时提示文案随语言切换（i18n）

2. **算法效果测试**
   - 对比 Bayer 和 Floyd-Steinberg 效果
   - 验证不同矩阵尺寸的纹理差异
   - 验证颜色映射准确性
   - **验证 Tint 模式渐变效果**
   - **验证 RGB 噪点的彩色效果**

3. **导出测试**
   - 验证导出图片质量
   - 验证不同格式导出
   - 验证放大后边缘锐利度

4. **交互与稳定性测试（2026-02-18 补充）**
   - 快速拖动滑块/频繁切换参数时：不出现“旧结果覆盖新结果”
   - 预设切换时：未配置 Bloom 的预设不会写入 `undefined` 导致参数异常

### 5.2 性能验证

| 图片尺寸 | 预期处理时间 |
|----------|--------------|
| 500x500 | < 50ms |
| 1000x1000 | < 200ms |
| 2000x2000 | < 500ms |
| 4000x4000 | < 2000ms |

**补充说明（2026-02-18）：**
- 参数变化时的处理应尽量复用已缩放后的基准图像数据，避免每次重绘/重取像素造成卡顿
- Bloom 的模糊实现需要避免 O(radius * width * height) 的朴素实现，优先采用滑动窗口优化

### 5.3 兼容性验证

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 移动端 Chrome/Safari

---

## 6. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 大图处理卡顿 | 用户体验差 | Web Worker + 分块处理 |
| 移动端性能不足 | 无法使用 | 限制最大尺寸 + 降采样预览 |
| 颜色选择器兼容性 | 功能缺失 | 使用原生 input[type=color] + 自定义 UI |
| Worker 通信开销 | 延迟增加 | 使用 Transferable Objects |
| Worker 回包乱序/过期结果覆盖 | 预览闪烁、参数无效感 | requestId 丢弃过期结果 + 合并请求（in-flight 仅保留最后一次） |
| 频繁参数变化重缩放/重取像素 | 交互拖拽卡顿、CPU 占用高 | 缓存缩放后的基准 ImageData，仅在容器尺寸变化时重建（ResizeObserver） |

---

## 7. 后续扩展方向（可选）

- 批量处理多张图片
- 动画 GIF 支持
- 历史记录/撤销功能
- 分享到社交媒体
- 多色调色板支持（4/8/16色）
- 更多噪点混合模式（Overlay, Screen, Multiply）

---

## 8. 发布前检查清单（2026-02-18 补充）

- 透明 PNG 输入：输出应保留 alpha（透明背景不被强制填充为不透明）
- 移动端：对比按钮支持触控按住（pointer events）
- 单文件构建：`dist/index.html` 包含本次更新逻辑（缓存基准 ImageData、ResizeObserver、滑动窗口 box blur）
