# TemplateFlow - Build AI workflows, not prompts.


<p align="center">
  <picture>
    <img alt="TemplateFLow Demo" src="PR_TemplateFlow.gif" />
  </picture>
</p>


<p align="center">
  <a href="./README_EN.md">English</a> | <b>简体中文</b>
</p>

<p align="center"> 
<img src="https://img.shields.io/github/license/heyaohuo/TemplateFlow?style=flat-square" alt="license" /> 
<a href="https://discord.gg/uxpfAXTB">
    <img src="https://img.shields.io/badge/Discord-Join%20Us-7289da?style=flat-square&logo=discord&logoColor=white" alt="Discord" />
  </a>
<img src="https://img.shields.io/badge/Node.js-22.0+-green?style=flat-square" alt="node version" /> 
</p>

<!-- **TemplateFlow** 内置了丰富的模版节点，无需从零开始构建，只需选择合适的模版节点，即可快速搭建复杂的工作流。 -->

**TemplateFlow** 是一个让你 **不用写 Prompt、不用调参数**，就能快速搭建 AI 生成流程的可视化工作流工具。

只需将预设的AI模板拖放到画布上，连接起来即可运行。


## 🤔 为什么选择 TemplateFlow？

TemplateFlow 强调简单、速度和可重用性：

- ❌ 无需担心从零开始创作

- ❌ 无需深入研究参数设置

- ❌ 无需编写脚本

- ✅ 只需选择模板，连接节点，即可生成。

## 🆚 TemplateFlow 与其他 AI Workflow 工具对比

| 功能 | TemplateFlow | ComfyUI / 其他 |
|------|------|------|
| 零配置模板 | ✅ 内置 | ❌ 大部分需要手动配置 |
| 新手友好 | ✅ 拖放即可运行 | ❌ 学习曲线陡峭 |
| 模板共享 | ✅ 基于 JSON | ⚠️ 功能有限 |
| 开源 | ✅ 100% | ⚠️ 部分开源 |
| 注重创作者体验 | ✅ | ❌ 开发者优先 |

<!-- 十个以内的核心功能 -->

## ✨ 核心功能 (Features)

- 🚀&nbsp;直接使用模板——无需配置任何参数。

- 🧩&nbsp;极简拖拽交互 (Drag-and-Drop UX)

- 📦&nbsp;以轻量级 JSON 文件格式导入和导出工作流程

- 🔒&nbsp;本地部署保护隐私安全 (Security)

- 🤖&nbsp;多模型支持 (Multiple Models)

- ♾️&nbsp;无限画布 (Infinite Canvas)

- ⏪&nbsp;支持撤销/重做 (Undo / Redo)

- 💻&nbsp;支持二次开发 (Extensible Design)

> 🚀 30 秒上手，零代码构建 AI 工作流



<!-- **🤖 多模型支持 (Multiple Models)**：自由切换不同底层模型，用于图像生成、视频创作及多模态工作流。

**🖱️ 极简拖拽交互 (Drag-and-Drop UX)**：像操作画板一样直观。所有节点均可通过拖拽连接，逻辑结构清晰可见。

**♾️ 无限画布 (Infinite Canvas)**：不受空间限制，自由构建任意规模的复杂工作流。

**🔍 自由缩放与平移 (Zoom & Pan)**：支持滚轮缩放、画布平移，并可一键定位当前工作区域。

**⌨️ 快捷键操作 (Keyboard Shortcuts)**：覆盖常用操作的快捷键体系，大幅提升编辑效率。

**📤 多模式文件上传 (Easy Upload)**：支持拖拽上传或手动选择文件，图片可直接拖入画布作为节点输入。

**⏪ 支持撤销/重做 (Undo / Redo)**：完整的操作历史管理，让每一步修改都可控、可回退。

**⚡ 轻量化高性能引擎 (High-Performance Engine)**：针对资源占用深度优化，即使在普通电脑上也能流畅运行大型工作流。

**💻 深度支持二次开发 (Extensible Design)**：支持自定义节点与插件，方便二次开发与功能扩展。

**📐 自由比例定制 (Aspect Ratio Control)**：内置常用比例与分辨率预设（如 1:1、16:9、9:16），满足不同创作场景。 -->


<!-- 示例gif -->


## 📢 加入SparkShort 创作者社区

- 为什么要加入 Discord ？

- 🚧 抢先体验新功能

- 🧠 分享和获取工作流程模板

- 🗳️ 参与路线图优先级投票

- 🛠️ 直接获得维护者的帮助

👉 [加入 Discord](https://discord.gg/uxpfAXTB)

## 🛠️ 如何运行 (Quick Start)

**先决条件：**

- Node.js 22.0 或更高版本

- 一个 Fal AI provider的 API 密钥

1. 克隆项目：
   ```bash
   git clone https://github.com/heyaohuo/TemplateFlow.git
   cd TemplateFlow
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量，.env 文件，填入你的 API 密钥

      ```bash
      # API Keys
      FAL_KEY=YOUR_FAL_API_KEY_

      # Cloudflare R2 Worker Configuration
      NEXT_PUBLIC_WORKER_UPLOAD_URL=你的_Cloudflare_Worker_File_Upload_URL
      NEXT_PUBLIC_R2_PUBLIC_URL=你的_Cloudflare_R2_密钥
      ```


4. 启动开发服务器：
   ```bash
   npm run dev
   ```

5. 打开浏览器访问 `http://localhost:3000`。


## 🗺️ 路线图 (Roadmap)

- 路线图的优先事项由社区反馈决定。


---

## 👋 持续维护，开源可用

TemplateFlow 正在积极开发和维护中。

如果您觉得这个项目有用，请考虑给它点个星 ⭐ —— 这将有助于项目的成长和持续发展。


## 贡献

欢迎贡献代码、提交问题或分享您的模版节点！请参考 [CONTRIBUTING.md](CONTRIBUTING.md) 获取更多信息。

