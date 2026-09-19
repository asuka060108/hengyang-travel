# 雁城衡阳 · 南岳衡山文旅指南

一个介绍湖南衡阳文旅资源的静态响应式网站，使用原生 **HTML + CSS + JavaScript** 开发，无任何框架与构建依赖，打开 `index.html` 即可运行。

## 网站主题

衡阳古称衡州、雅称“雁城”，是南岳衡山所在地、湖湘文化重要发祥地。本站围绕“山水 + 文脉 + 美食 + 攻略”组织内容：

- **雁城概览**：城市名片与关键数据（面积 15310km²、常住人口 643.43 万、2200+ 年建城史）
- **必游景点**：南岳衡山、南岳大庙、石鼓书院、回雁峰、蔡伦竹海、东洲岛六张名片，支持分类筛选与详情弹窗
- **四季衡山**：春杜鹃、夏云海、秋日出、冬雾凇四季切换
- **衡阳味道**：衡阳鱼粉、衡东土菜、酥薄月
- **推荐行程**：两日精华游 / 三日深度游时间轴
- **旅行工具箱**：衡山行预算计算器（实时计算人均与合计）、登山装备清单（localStorage 持久化）

## 技术特性

- 语义化 HTML5，CSS 自定义属性（设计变量）+ Grid/Flex 响应式布局，适配桌面与手机
- 原生 JavaScript：IntersectionObserver 滚动揭示与导航高亮、数字滚动动画、Tab 切换、卡片筛选、模态框、预算计算、本地存储
- 支持 `prefers-reduced-motion` 无障碍降级
- 全部资源本地化，可离线运行

## 目录结构

```
hengyang-travel/
├── index.html          # 页面结构
├── css/
│   └── style.css       # 全部样式与响应式规则
├── js/
│   └── main.js         # 全部交互逻辑
├── assets/
│   └── img/            # 景点与美食图片素材
├── .gitignore
└── README.md
```

## 本地运行

直接双击 `index.html`，或在项目目录启动任意静态服务器：

```bash
# 任选其一
python -m http.server 8000
npx serve .
```

浏览器访问 <http://localhost:8000>。

## 在线访问与代码仓库

- **在线网址（GitHub Pages）**：<https://asuka060108.github.io/hengyang-travel/>
- **Gitee 仓库（主仓库）**：<https://gitee.com/ink060108/hengyang-travel>
- **GitHub 镜像仓库**：<https://github.com/asuka060108/hengyang-travel>

> Gitee Pages 免费静态托管服务已停止，故网站部署在 GitHub Pages；源码同时推送到 Gitee 与 GitHub 两个远程仓库。

## 数据与素材说明

- 城市数据与门票价格来自湖南省人民政府、湖南省发改委、南岳区人民政府等公开资料（2025 年），仅供参考，出行请以景区官方公示为准。
- 图片素材来自公开网络检索与 AI 生成，版权归原作者所有，本项目仅作学习演示，不用于商业用途。
