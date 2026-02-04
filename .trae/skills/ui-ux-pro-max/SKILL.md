---
name: "ui-ux-pro-max"
description: "提供 UI/UX 设计系统建议与交付检查清单。用户要做界面优化、组件美化、布局/动效/可访问性整改时调用。"
---

# UI/UX Pro Max（设计智能）

来源：https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

## 何时调用

在用户提出以下诉求时调用本技能：

- 优化界面观感、统一风格、提升“专业感”
- 新增页面/组件但缺少设计方向（配色、字体、布局、信息层级）
- 需要 UI 回归审查（间距、对齐、动效、交互反馈、可访问性、性能）
- 需要把产品定位（行业/人群/气质）落到可执行的 UI 规则与组件实现

## 输出目标（每次必须产出）

1. 设计系统建议（Pattern / Style / Colors / Typography / Effects）
2. 页面结构建议（Landing/后台/表单/详情页的 section 与信息层级）
3. 风险与反模式（需要避免的组合与实现方式）
4. 交付前检查清单（可访问性/交互/性能/响应式）
5. 可落地实现策略（基于你当前栈给出组件与 Tailwind/shadcn 的实现方向）

## 你需要先问清/提取的输入（不问也要做合理假设）

- 产品类型：个人主页 / 简历生成 / 管理后台 / 留言互动
- 行业气质：专业、极简、科技感、温暖、作品集、招聘导向等
- 目标人群：HR / 同行 / 客户 / 朋友
- 主题偏好：浅色/深色、是否要强动效
- 技术栈：默认按 `React + Tailwind + shadcn/ui + Lucide + Framer Motion` 给建议

## 工作流（强制）

### Step 1：生成“设计系统”

请按下面格式输出（ASCII 或 Markdown 都可）：

- **Pattern（页面结构）**：Hero/价值主张/作品/技能/社交证明/联系/FAQ 等组合，CTA 放置策略
- **Style（风格关键词）**：3–6 个关键词 + 适用/不适用场景
- **Colors（配色系统）**：Primary/Secondary/CTA/Background/Text/Border + 使用规则（按钮、链接、提示、tag）
- **Typography（字体层级）**：标题/正文/辅助文字的字号、字重、行高、最大行宽建议
- **Effects（质感与动效）**：阴影、圆角、边框、过渡时长（150–300ms）、hover/focus 反馈

### Step 2：按页面逐个落地

对每个要改的页面/模块输出：

- 信息层级与布局（栅格、留白、分区）
- 组件样式统一（按钮、卡片、表单、列表、弹窗）
- 动效规则（只用 transform/opacity；尊重 reduced-motion）
- 可访问性（对比度、焦点态、键盘导航、触控目标）

### Step 3：交付前检查（必须逐条对照）

以下是最低交付门槛（从项目源技能整理的高频问题）：

- 不用 emoji 当图标，统一使用 SVG/Lucide
- 所有可点击元素具备 hover/active/focus 状态，并且有 cursor-pointer
- 微交互过渡时长 150–300ms，避免循环动画干扰阅读
- 文本对比度：浅色模式至少 4.5:1（正文），重要信息更高
- 焦点态可见（键盘 Tab 导航可用），icon-only 按钮有 aria-label
- 尊重 prefers-reduced-motion（减少动画）
- 响应式检查：375 / 768 / 1024 / 1440 断点
- 异步内容避免布局跳动（为图片/列表预留空间，必要时 skeleton）

## 可选：如果你希望把原仓库脚本也装进来（用于离线检索）

原仓库提供可搜索的设计数据库与脚本（Python 搜索与“设计系统生成”）。你可以在本机按仓库 README 的方式使用：

- 克隆仓库后，使用 `python3 src/ui-ux-pro-max/scripts/search.py "<query>" --design-system` 生成推荐设计系统
- 支持 domain 搜索（product/style/color/typography/landing/chart/ux）与 stack（react/nextjs/shadcn 等）

本技能默认不依赖这些脚本即可工作（由我按规则直接生成设计系统与整改建议）。
