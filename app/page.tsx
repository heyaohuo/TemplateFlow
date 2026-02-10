'use client';
import React, { useState, useEffect, ReactNode  } from 'react';
import { 
  Workflow, 
  Zap, 
  Layers, 
  Box, 
  Share2, 
  Code, 
  ChevronRight, 
  Cpu, 
  Sparkles,
  Shield, // 新增 Shield 图标
  Github,  // 新增 Github 图标 (虽然 lucide-react 可能没有 Github，用 Code 代替或检查可用性，这里使用 Github 可能会报错如果库版本不对，稳妥起见用 Code 或 GitBranch，但 Lucide 通常有 Github。为了保险，我将使用 Code 代表开源，或者 Shield)
  Globe,
  Youtube,
  Languages
} from 'lucide-react';

// --- Types ---
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

interface SocialLinkProps {
  href: string;
  name: string;
  icon: ReactNode;
  color: string;
}


// --- Types & Interfaces ---
type Language = 'zh' | 'en';

// --- Translations Dictionary ---
const translations = {
  zh: {
    navFeatures: "核心特性",
    navGithub: "GitHub",
    navDiscord: "加入Discord",
    heroBadge: "100% 开源的可视化生成引擎",
    heroTitle: "最简单的 AI 内容创作工具",
    heroDesc: "面向创作者与开发者的开源可视化 AI 编辑器。内置丰富的模版节点，快速构建复杂的图像生成流程。完全免费，代码透明，社区驱动。",
    btnStart: "立即开始",
    btnSource: "查看源码",
    featureSectionTitle: "为什么选择 TemplateFlow？",
    featureSectionSub: "回归创造的本质，简单、自由、开放",
    f1Title: "真正的零门槛",
    f1Desc: "告别繁琐的参数配置。像搭乐高一样，通过拖拽直观的节点即可完成工作流构建，新手也能秒变专家。",
    f2Title: "自由分享",
    f2Desc: "打破孤岛。内置完整的导入导出功能，轻松将你的创意工作流分享给社区，或一键加载他人的智慧结晶。",
    f3Title: "100% 开源",
    f3Desc: "小严相信开放的力量。项目代码完全公开，没有任何隐藏收费或私有协议，安全、透明、永久免费。",
    highlightTitle: "不仅是工具，更是你的",
    highlightDesc: "TemplateFlow 致力于降低 AI 生成门槛。兼容主流 Nano Banana Pro、Flux 2 Pro 及 Seedance Pro，Veo 3 等模型。无论你是想要生成精美的插画，还是构建自动化的电商图处理流水线，这里都是最佳的免费起点。",
    highlightL1: "无需订阅，无隐藏费用",
    highlightL2: "支持社区插件扩展",
    highlightL3: "代码完全开源，安全可控",
    hCard1: "极速响应",
    hCard2: "模版丰富",
    hCard3: "本地运行",
    hCard4: "逻辑灵活",
    communityBadge: "加入社区",
    communityTitle: "关注小严，获取最新动态",
    communityDesc: "小严活跃在各大社交平台。关注 TemplateFlow 官方账号，第一时间获取教程、新模版发布通知以及社区精选作品。",
    ctaTitle: "加入开源社区，共建未来",
    ctaDesc: "立即体验 TemplateFlow，无需注册，无需付费。",
    footerCopy: "© 2026 TemplateFlow 开源项目。"
  },
  en: {
    navFeatures: "Features",
    navGithub: "GitHub",
    navDiscord: "Join Discord",
    heroBadge: "100% Open Source Visual Engine",
    heroTitle: "The simplest tool for AI content creation",
    heroDesc: "An open-source visual AI editor for creators and developers. Built-in rich template nodes to quickly build complex image generation workflows. Completely free, transparent code, community driven.",
    btnStart: "Get Started",
    btnSource: "Source Code",
    featureSectionTitle: "Why Choose TemplateFlow?",
    featureSectionSub: "Return to the essence of creation: simple, free, and open.",
    f1Title: "Zero Threshold",
    f1Desc: "Say goodbye to tedious configurations. Build workflows intuitively like playing with LEGO. Beginners can become experts in seconds.",
    f2Title: "Free Sharing",
    f2Desc: "Break the silos. Built-in import/export features make it easy to share your workflows or one-click load community wisdom.",
    f3Title: "100% Open Source",
    f3Desc: "We believe in the power of openness. The project is fully public with no hidden fees or proprietary protocols. Secure and free forever.",
    highlightTitle: "Not just a tool, but your",
    highlightDesc: "TemplateFlow is dedicated to lowering the barrier for AI generation. Compatible with Nano Banana Pro, Flux 2 Pro, Seedance Pro, and Veo 3. Whether creating illustrations or automated e-commerce pipelines, this is your best starting point.",
    highlightL1: "No subscriptions, no hidden fees",
    highlightL2: "Supports community plugin extensions",
    highlightL3: "Fully open source, secure and controllable",
    hCard1: "Fast Response",
    hCard2: "Rich Templates",
    hCard3: "Local Running",
    hCard4: "Flexible Logic",
    communityBadge: "Join the Community",
    communityTitle: "Follow Yan for latest updates",
    communityDesc: "Yan is active on major social platforms. Follow TemplateFlow for tutorials, new template announcements, and community highlights.",
    ctaTitle: "Join the Community, Build the Future",
    ctaDesc: "Experience TemplateFlow now. No registration, no payment required.",
    footerCopy: "© 2026 TemplateFlow Open Source Project."
  }
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToWorkflow = () => {
    window.location.href = '/workflow';
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px]" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-[#0a0a0c]/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Workflow size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">TemplateFlow</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="https://github.com/heyaohuo/TemplateFlow" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                {t.navGithub} <ChevronRight size={14} />
              </a>
            </div>

            {/* Language Switcher - Now visible on all devices */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium"
            >
              <Languages size={14} className="text-purple-400" />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>

            {/* Discord Button - Desktop only or adjusted for mobile */}
            <a 
              href='https://discord.gg/uxpfAXTB' target="_blank" rel="noreferrer"
              className="hidden sm:block px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              {t.navDiscord}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-8 animate-fade-in-up">
            <Sparkles size={12} />
            <span>{t.heroBadge}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Build AI workflows, not prompts.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
             {t.heroDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={navigateToWorkflow}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                {t.btnStart}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <a href="https://github.com/heyaohuo/TemplateFlow" target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10 flex items-center gap-2">
              <Code size={18} />
              {t.btnSource}
            </a>
          </div>

          {/* Abstract Node Editor Visualization - (保持不变，视觉效果很好) */}
          <div id="demo" className="relative max-w-5xl mx-auto rounded-xl border border-white/10 bg-[#121214]/80 backdrop-blur-sm shadow-2xl overflow-hidden group">
          <img src="/TemplateFlow.png" alt='templateflow' className='w-full' />
{/*             <div className="absolute top-0 w-full h-8 bg-[#1a1a1c] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div> */}
            {/* Mock Nodes */}
            {/* <div className="p-8 h-[400px] relative overflow-hidden flex items-center justify-center">
                


               
              <div className="absolute left-[10%] md:left-[15%] top-1/2 -translate-y-1/2 w-48 bg-[#1e1e20] border border-purple-500/30 rounded-lg shadow-lg p-4 transform transition-transform hover:scale-105 z-10">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs font-bold text-gray-300">Prompt Input</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                    <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <div className="w-3 h-3 rounded-full bg-purple-500 ring-2 ring-[#0a0a0c]"></div>
                  </div>
               </div>

               <div className="absolute left-1/2 -translate-x-1/2 top-[30%] w-44 bg-[#1e1e20] border border-blue-500/30 rounded-lg shadow-lg p-4 z-10">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-bold text-gray-300">Latent Upscale</span>
                  </div>
                  <div className="flex justify-between mt-4">
                     <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-[#0a0a0c] -ml-5"></div>
                     <div className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-[#0a0a0c] -mr-5"></div>
                  </div>
               </div>

               <div className="absolute left-1/2 -translate-x-1/2 top-[60%] w-44 bg-[#1e1e20] border border-pink-500/30 rounded-lg shadow-lg p-4 z-10">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="text-xs font-bold text-gray-300">ControlNet</span>
                  </div>
                   <div className="flex justify-between mt-4">
                     <div className="w-3 h-3 rounded-full bg-pink-500 ring-2 ring-[#0a0a0c] -ml-5"></div>
                     <div className="w-3 h-3 rounded-full bg-pink-500 ring-2 ring-[#0a0a0c] -mr-5"></div>
                  </div>
               </div>

               <div className="absolute right-[10%] md:right-[15%] top-1/2 -translate-y-1/2 w-48 bg-[#1e1e20] border border-green-500/30 rounded-lg shadow-lg p-3 z-10 transform transition-transform hover:scale-105">
                  <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold text-gray-300">Image Save</span>
                  </div>
                  <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-black rounded flex items-center justify-center border border-white/5">
                     <span className="text-[10px] text-gray-500">Preview</span>
                  </div>
                   <div className="mt-3 flex justify-start">
                    <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-[#0a0a0c] -ml-4"></div>
                  </div>
               </div> 
            </div> */}
            
            {/* Overlay Gradient */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent pointer-events-none"></div> */}
          </div>
        </div>
      </section>

      {/* Features Grid - Updated with 3 Core Features */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.featureSectionTitle}</h2>
            <p className="text-gray-400">{t.featureSectionSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layers className="text-purple-400" />}
              title={t.f1Title}
              desc={t.f1Desc}
            />
            <FeatureCard 
              icon={<Share2 className="text-blue-400" />}
              title={t.f2Title}
              desc={t.f2Desc}
            />
            <FeatureCard 
              icon={<Shield className="text-green-400" />}
              title={t.f3Title}
              desc={t.f3Desc}
            />
          </div>
        </div>
      </section>

      {/* Additional Highlight Section */}
      <section className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 h-40 flex flex-col justify-end group hover:border-purple-500/50 transition-colors">
                   <Zap className="mb-auto text-yellow-400" />
                   <span className="font-bold">{t.hCard1}</span>
                </div>
                <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 h-40 flex flex-col justify-end group hover:border-blue-500/50 transition-colors translate-y-8">
                   <Box className="mb-auto text-blue-400" />
                   <span className="font-bold">{t.hCard2}</span>
                </div>
                <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 h-40 flex flex-col justify-end group hover:border-green-500/50 transition-colors">
                   <Cpu className="mb-auto text-green-400" />
                   <span className="font-bold">{t.hCard3}</span>
                </div>
                <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 h-40 flex flex-col justify-end group hover:border-pink-500/50 transition-colors translate-y-8">
                   <Workflow className="mb-auto text-pink-400" />
                   <span className="font-bold">{t.hCard4}</span>
                </div>
             </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {t.highlightTitle}<br />
              {/* {t.highlightTitle.split(',')[0]} <br/>{t.highlightTitle.split(',')[1] || ""} */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {lang === 'zh' ? '开放创意平台' : ' Creative Platform'}
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {t.highlightDesc}
            </p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                {t.highlightL1}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                {t.highlightL2}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                {t.highlightL3}
              </li>
            </ul>
          </div>
        </div>
      </section>

            {/* Social Media & Community Section */}
      <section id="community" className="py-20 bg-[#0d0d0f] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
            <Globe size={12} />
            <span>Join the Community</span>
          </div>
          <h2 className="text-3xl font-bold mb-6">关注小严，获取最新动态</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            小严活跃在各大社交平台。关注 TemplateFlow 官方账号，第一时间获取教程、
            新模版发布通知以及社区精选作品。
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <SocialLink 
              href="https://x.com/developer_yan?s=21" 
              name="Twitter / X" 
              icon={<TwitterIcon />} 
              color="hover:bg-black hover:border-gray-700"
            />
            <SocialLink 
              href="https://www.reddit.com/user/Left_Look6157/" 
              name="Reddit" 
              icon={<RedditIcon />} 
              color="hover:bg-[#FF4500] hover:border-[#FF4500] hover:text-white"
            />
            <SocialLink 
              href="https://www.youtube.com/@developer_xiaoyan" 
              name="YouTube" 
              icon={<Youtube size={30} />} 
              color="hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white"
            />
            <SocialLink 
              href="https://space.bilibili.com/3537107142314572" 
              name="Bilibili" 
              icon={<BilibiliIcon />} 
              color="hover:bg-[#00AEEC] hover:border-[#00AEEC] hover:text-white"
            />
            {/* Douyin - Redrawn SVG with glitch effect feel */}
            <SocialLink 
              href="https://store.coinminer.one/tiktok_profile.png" 
              name="抖音" 
              icon={<DouyinIcon />} 
              color="hover:bg-black hover:border-gray-700 hover:text-white"
            />
             <SocialLink 
              href="https://www.xiaohongshu.com/user/profile/684a82f9000000001d015b40?xsec_token=YBow3gxxk9fl5IvM8a4kZyGicKVjJUdEZiLqDi9ufIKpY=&xsec_source=app_share&xhsshare=CopyLink&appuid=684a82f9000000001d015b40&apptime=1770615290&&share_id=b47840c907f94da5961ba2471552c4c4" 
              name="小红书" 
              icon={<XiaohongshuIcon />} 
              color="hover:bg-[#FF2442] hover:border-[#FF2442] hover:text-white"
            />
             <SocialLink 
              href="#" 
              name="微信公众号" 
              icon={<WeChatIcon />} 
              color="hover:bg-[#07C160] hover:border-[#07C160] hover:text-white"
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl font-bold mb-6">{t.ctaTitle}</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">{t.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://discord.gg/uxpfAXTB" 
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              {t.navDiscord}
            </a>
            <a 
              href="https://github.com/heyaohuo/TemplateFlow" 
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-5 bg-[#1a1a1c] text-white border border-white/10 rounded-full font-bold text-lg hover:bg-[#252528] transition-colors flex items-center gap-2"
            >
              <Code size={20} />
              GitHub Star
            </a>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050506]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <Workflow size={20} className="text-gray-500" />
             <span className="font-bold text-gray-500">TemplateFlow</span>
          </div>
          <div className="text-gray-600 text-sm">
            © 2026 TemplateFlow Open Source Project.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="p-8 rounded-2xl bg-[#121214] border border-white/5 hover:border-purple-500/30 transition-all duration-300 group hover:-translate-y-1 h-full">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-purple-500/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-100">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}



function SocialLink({ href, name, icon, color }: SocialLinkProps) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex flex-col items-center gap-3 p-4 rounded-xl border border-white/5 bg-[#1a1a1c] w-28 h-28 justify-center transition-all duration-300 group ${color}`}
    >
      <div className="text-gray-400 group-hover:text-inherit transition-colors">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-500 group-hover:text-inherit transition-colors">{name}</span>
    </a>
  );
}

// --- Custom Icons ---

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const BilibiliIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M17.43,2.44L14.75,5.13H9.25L6.57,2.44L5.33,3.68l2.44,2.44H4.5A2.5,2.5,0,0,0,2,8.63v8.74a2.5,2.5,0,0,0,2.5,2.5h15a2.5,2.5,0,0,0,2.5-2.5V8.63a2.5,2.5,0,0,0-2.5-2.5h-3.27l2.44-2.44ZM7,11a1.5,1.5,0,1,1,1.5,1.5A1.5,1.5,0,0,1,7,11Zm8.5,1.5A1.5,1.5,0,1,1,17,11,1.5,1.5,0,0,1,15.5,12.5Z"/>
  </svg>
);

const DouyinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
    {/* Base shape with Douyin's offset style */}
    <path d="M16.7 1.5c-1.1 0-2.1.8-2.4 1.8v10.9c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c.3 0 .6.1.9.2V6.6c-.3 0-.6-.1-.9-.1-4.3 0-7.8 3.5-7.8 7.8s3.5 7.8 7.8 7.8 7.8-3.5 7.8-7.8V7.3c1.3.9 2.8 1.5 4.5 1.5V4.6c-2.3 0-4.2-1.4-5-3.1h-1.3z" />
  </svg>
);

const XiaohongshuIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2ZM8.6,15.1V9h1.1V8.4H6.2V7.3h3.5V5.5h1.1v1.8h3.5v1.1H10.8V9h1.1v6.1H8.6ZM15.4,14H13.2v1.1h3.3v1.1H7.5V15.1H12v-1.1H9.8V12.9h5.6Z"/>
  </svg>
);

const WeChatIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M8.5 4C4.36 4 1 6.81 1 10.27c0 1.95 1.05 3.69 2.69 4.87l-.68 2.05 2.45-1.22c.62.19 1.28.29 1.96.29 4.14 0 7.5-2.81 7.5-6.27S12.64 4 8.5 4zm4.18 5.4c.34 0 .62.28.62.62s-.28.62-.62.62-.62-.28-.62-.62.28-.62.62-.62zm-3.1 0c.34 0 .62.28.62.62s-.28.62-.62.62-.62-.28-.62-.62.28-.62.62-.62zM19 10c-3.31 0-6 2.24-6 5s2.69 5 6 5c.55 0 1.07-.07 1.57-.21l1.96.98-.55-1.64c1.32-.95 2.16-2.35 2.16-3.92 0-2.76-2.69-5-6-5zm2.35 4.32c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zm-2.5 0c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z"/>
    </svg>
);
