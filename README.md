# TemplateFlow - Build AI workflows, not prompts.


<p align="center">
  <picture>
    <img alt="TemplateFLow Page" src="TemplateFlow.png" />
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

**TemplateFlow** 是一个让你 **不用反复调 Prompt、不用记参数**，就能快速搭建 AI 生成流程的可视化工作流工具。



## 🚀 为什么选择 TemplateFlow？

TemplateFlow 围绕三个核心理念构建

- ✅ 真正的零门槛：模块化思维： 内置深度预设的功能模板，不再需要从零研究参数。拖出节点，连接逻辑，剩下的交给 TemplateFlow。

- ✅ 自由分享：创意即文件： 内置完整的导入导出功能。支持一键导出轻量化 JSON 文件，或加载社区大神分享的方案，瞬间拥有同款 AI 生产力。

- ✅ 100%开源：由社区驱动：核心功能完全免费且开源。没有隐藏收费，没有功能限制。

<!-- 十个以内的核心功能 -->

## ✨ 核心功能 (Features)

- 🔒&nbsp;本地部署保护隐私安全 (Security)
- 🤖&nbsp;多模型支持 (Multiple Models)
- 🖱️&nbsp;极简拖拽交互 (Drag-and-Drop UX)
- ♾️&nbsp;无限画布 (Infinite Canvas)
- 🔍&nbsp;自由缩放与平移 (Zoom & Pan)
- ⌨️&nbsp;快捷键操作 (Keyboard Shortcuts)
- 📤&nbsp;多模式文件上传 (Easy Upload)
- ⏪&nbsp;支持撤销/重做 (Undo / Redo)
- ⚡&nbsp;轻量化高性能引擎 (High-Performance Engine)
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

## 📖 运行原理 (Quick Concept)

TemplateFlow 的核心在于将复杂的 AI 参数封装为语义化模板：

[输入数据/图片] ➔ [AI 逻辑模板] ➔ [结果预览/输出]

30 秒上手： 拖出一个“风格转换模板”，连入你的图片，点击运行——就是这么简单。


## 📢 加入SparkShort 创作者社区

在 Discord 中，您可以：
- 🚀 抢先体验新的视频模型和功能
- 🧪 参与公开发布前的私人 Beta 测试
- 🧠 了解创作者如何利用 AI 短视频实现盈利
- 🗳 对路线图功能进行投票（您的投票至关重要）

👉 [加入 Discord](https://discord.gg/uxpfAXTB)

## 🛠️ 如何运行 (Quick Start)

**Note:** 在开始之前，请确保你的系统已安装Nodejs 22.0+，获得API Key。

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
[ ] 支持更多图片生成模型 (如 Seedream v4 / reve )。

[ ] 支持更多视频生成模型 (如 Luma / Runway)。

[ ] 社区模版库: 直接在应用内浏览并下载云端模版。

[ ] 局部重绘: 增加 Canvas 编辑器内直接涂抹功能。


## 贡献

欢迎贡献代码、提交问题或分享您的模版节点！请参考 [CONTRIBUTING.md](CONTRIBUTING.md) 获取更多信息。

---

⭐ 如果 TemplateFlow 节省了您的时间或启发了您的工作流程，请考虑给它点个赞（加星标）——这真的有助于项目的成长。

