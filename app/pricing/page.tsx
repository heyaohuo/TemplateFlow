"use client"

import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 

  Star,
  BookOpen,
  Smartphone,
  MessageCircle,
  Download,
  ChevronRight
} from 'lucide-react';

const App = () => {
  const [salesCount, setSalesCount] = useState(5);

  // 利润计算逻辑
  const unitCost = 19; // 代理进货价
  const unitPrice = 59; // 市场指导价
  const dailyProfit = (unitPrice - unitCost) * salesCount;
  const monthlyProfit = dailyProfit * 30;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 顶部导航 */}
      <nav className="fixed w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Zap size={20} className="text-black fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight">副业<span className="text-yellow-500">掘金</span>系统</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <a href="#profit" className="hover:text-white transition-colors">收益计算</a>
            <a href="#manual" className="hover:text-white transition-colors">小白手册</a>
            <a href="#pricing" className="hover:text-white transition-colors">立即加入</a>
          </div>
          <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg shadow-white/10">
            登录后台
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* 背景光效 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-bold mb-8">
            <Star size={14} className="fill-yellow-400" />
            <span>2026 自动化分销 · 全新升级版</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">
            把你刷视频的时间<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600">变成银行卡的余额</span>
          </h1>
          
          <div className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
             <div className="flex flex-wrap items-center justify-center gap-2">
              <span>简单三步：</span>
              <strong className="text-white font-semibold">领取工具</strong>
              <ChevronRight className="text-gray-600" size={20} />
              <strong className="text-white font-semibold">照抄教程</strong>
              <ChevronRight className="text-gray-600" size={20} />
              <strong className="text-white font-semibold">坐等入账</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="w-full sm:w-auto px-10 py-5 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 hover:-translate-y-1 transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2">
              领取激活码 & 搞钱教程 <ArrowRight size={20} />
            </button>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0 sm:ml-4">
              <span className="text-green-500">●</span> 今日剩余名额: <span className="text-white font-mono">14</span>
            </p>
          </div>
        </div>
      </header>

      {/* 小白3天出单手册 */}
      <section id="manual" className="py-24 bg-zinc-900/30 border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                不讲大道理，<br />
                <span className="text-yellow-500">只给说明书。</span>
              </h2>
              <p className="text-lg text-gray-400">
                这是我们专门为零基础用户准备的——<span className="text-white font-bold border-b-2 border-yellow-500">《小白3天出单手册》</span>。
                按照 SOP 执行指令，3天时间，从配置环境到收获第一单。
              </p>
              
              <div className="space-y-4">
                {[
                  { day: "Day 01", title: "极速搭建", desc: "10分钟搞定账号人设，直接复制我们提供的爆款背景图和简介。" },
                  { day: "Day 02", title: "暴力引流", desc: "投放我们准备好的素材，配合独家截流话术，流量自动上门。" },
                  { day: "Day 03", title: "收钱出单", desc: "复制粘贴「万能成交话术」，收钱发码，完成业务闭环。" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default group">
                    <div className="shrink-0 w-14 h-14 bg-black rounded-xl flex flex-col items-center justify-center border border-white/10 group-hover:border-yellow-500/50">
                      <span className="text-xs text-gray-500 font-bold uppercase">{item.day.split(' ')[0]}</span>
                      <span className="text-lg font-bold text-yellow-500">{item.day.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white mb-1 group-hover:text-yellow-400">{item.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 手册视觉 */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-[80px]"></div>
              <div className="relative bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-3xl p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500 rounded-lg text-black">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">内部实操SOP.pdf</h3>
                      <p className="text-xs text-gray-500">保证出单 · 违约赔付</p>
                    </div>
                  </div>
                  <Download size={20} className="text-gray-500" />
                </div>
                
                <div className="space-y-3 opacity-50 select-none blur-[1px]">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-800 rounded w-full mt-4"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl">
                  <div className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer">
                    <Lock size={16} /> 立即解锁 3天出单手册
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 收益分析 */}
      <section id="profit" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">收益具象化</h2>
            <p className="text-gray-400 text-lg">基于 5,000+ 代理真实数据，看看你的执行力值多少钱</p>
          </div>

          <div className="bg-zinc-900/80 rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)] relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-12">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xl font-medium text-gray-300">假设每天仅售出：</span>
                  <div className="text-right">
                    <span className="text-6xl font-black text-yellow-500">{salesCount}</span>
                    <span className="text-xl text-gray-500 ml-2">个激活码</span>
                  </div>
                </div>
                
                <input 
                  type="range" min="1" max="30" value={salesCount} 
                  onChange={(e) => setSalesCount(parseInt(e.target.value))}
                  className="w-full h-4 bg-gray-800 rounded-full appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                 <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                    <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">单个利润</p>
                    <p className="text-3xl font-bold text-white">¥{unitPrice - unitCost}</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-black">
                    <p className="text-sm font-bold opacity-80 mb-1 uppercase tracking-wider">预估月利润</p>
                    <p className="text-4xl font-black">¥{monthlyProfit.toLocaleString()}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 方案/价格计划 */}
      <section id="pricing" className="py-24 bg-white text-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">开启您的副业系统</h2>
            <p className="text-gray-600 text-lg">选择最适合您的起步方案</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 免费计划 */}
            <div className="p-8 rounded-[2rem] border-2 border-gray-100 bg-gray-50 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Alpha 试用版</h3>
              <p className="text-gray-500 mb-6 text-sm">零成本体验系统性能。</p>
              <div className="text-4xl font-extrabold mb-8">免费领取</div>
              <ul className="space-y-4 mb-10 flex-grow text-sm">
                <li className="flex items-center gap-2 font-medium text-gray-700">
                  <CheckCircle2 size={18} className="text-green-600" /> 3个一次性测试激活码
                </li>
                <li className="flex items-center gap-2 font-medium text-gray-700">
                  <CheckCircle2 size={18} className="text-green-600" /> 手册核心内容预览
                </li>
                <li className="flex items-center gap-2 font-medium text-gray-700 text-gray-400">
                  <Lock size={16} /> 无法享受合伙人进货价
                </li>
              </ul>
              <button className="w-full py-4 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-all">
                立即测试系统
              </button>
            </div>

            {/* 个人版 */}
            <div className="p-8 rounded-[2rem] border-2 border-gray-100 bg-gray-50 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">个人代理版</h3>
              <p className="text-gray-500 mb-6 text-sm">适合追求稳定额外收入的初学者。</p>
              <div className="text-4xl font-extrabold mb-8">¥199</div>
              <ul className="space-y-4 mb-10 flex-grow text-sm text-gray-700">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={18} className="text-green-600" /> 10个授权激活码 (值¥590)
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={18} className="text-green-600" /> 进货价固定 ¥19/个
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={18} className="text-green-600" /> 专属营销素材包
                </li>
              </ul>
              <button className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                开始掘金
              </button>
            </div>

            {/* 合伙人版 */}
            <div className="p-8 rounded-[2rem] bg-black text-white flex flex-col relative shadow-2xl">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-yellow-500 rounded-t-[2rem]"></div>
              <div className="mb-4 flex justify-between items-start">
                <h3 className="text-2xl font-bold">合伙人·掘金版</h3>
                <Zap className="text-yellow-500 fill-current" size={24} />
              </div>
              <p className="text-gray-400 mb-6 text-sm">顶级权限，最高收益空间。</p>
              <div className="text-4xl font-extrabold mb-8 text-yellow-500">¥499</div>
              <ul className="space-y-4 mb-10 flex-grow text-sm text-gray-300">
                <li className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 size={18} className="text-yellow-500" /> 50个授权激活码 (值¥2950)
                </li>
                <li className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 size={18} className="text-yellow-500" /> 完整版《3天出单手册》
                </li>
                <li className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 size={18} className="text-yellow-500" /> 最低进货价 ¥9.9/个
                </li>
                <li className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 size={18} className="text-yellow-500" /> 1对1实战部署支持
                </li>
              </ul>
              <button className="w-full py-4 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">
                加入合伙人协议
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="py-20 bg-zinc-950 border-t border-white/5 text-center">
        <p className="text-gray-500 text-xs tracking-widest uppercase">
          © 2026 副业掘金分销系统 · 为每一位行动者提供工具
        </p>
      </footer>

    </div>
  );
};

export default App;