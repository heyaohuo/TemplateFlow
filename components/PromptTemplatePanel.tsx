import React, { useState, useMemo } from 'react';
import { Search, Star, X, Sparkles } from 'lucide-react';

interface PromptTemplate {
  id: number;
  prompt: string;
  title: string;
  prompt_author?: string;
  prompt_img: string;
  tag?: string;
  featured?: boolean;
}

interface PromptTemplatePanelProps {
  allPrompts: PromptTemplate[];
  onSelect?: (template: PromptTemplate) => void;
  onClose: () => void;
}

export const PromptTemplatePanel: React.FC<PromptTemplatePanelProps> = ({ 
  allPrompts, 
  onSelect,
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = useMemo(() => {
    const baseTags = ['All', '小红书', 'Youtube', '抖音', 'Free Course', 'AI Tools'];
    return Array.from(new Set([...baseTags, ...allPrompts.map(p => p.tag).filter(Boolean)]));
  }, [allPrompts]);

  // 过滤主列表
  const filteredPrompts = allPrompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || p.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  // 提取精选内容 (前10个左右)
  const featuredPrompts = useMemo(() => 
    // allPrompts.filter(p => p.featured).slice(0, 10), 
        allPrompts.slice(5, 10), 
  [allPrompts]);

  return (
    <div className="absolute left-20 top-6 bottom-6 w-[500px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[32px] border border-slate-200/60 flex flex-col z-[100] animate-in fade-in slide-in-from-left-8 duration-300">
      
      {/* 头部：搜索 */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Sparkles size={16} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Libray {allPrompts.length}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100/80 border-none rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 标签栏 */}
      <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag!)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
              ${selectedTag === tag 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 滚动内容区 */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 scrollbar-hide pt-4">
        
        {/* 1. Featured 模块 - 横向滑动卡片 */}
        {!searchTerm && selectedTag === 'All' && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-amber-100 rounded-md">
                <Star size={12} className="text-amber-600" fill="currentColor" />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Featured</span>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
              {featuredPrompts.map(item => (
                <div 
                  key={`feat-${item.id}`}
                  onClick={() => onSelect?.(item)}
                  className="min-w-[160px] cursor-pointer group"
                >
                  <div className="relative rounded-2xl overflow-hidden mb-2 shadow-sm group-hover:shadow-xl transition-all duration-300">
                    <img src={item.prompt_img} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[10px] font-medium text-white truncate">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. All Templates 模块 - 瀑布流布局保持原比例 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">All Templates</span>
        </div>

        {/* 使用 columns-2 实现瀑布流，保持图片原始比例 */}
        <div className="columns-2 gap-4 space-y-4">
          {filteredPrompts.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect?.(item)}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="bg-slate-100 rounded-2xl overflow-hidden mb-2 relative shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100">
                <img 
                  src={item.prompt_img} 
                  alt={item.title} 
                  className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-500" 
                  // h-auto 保持原始比例
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-700 truncate px-1 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredPrompts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-400 italic">No templates match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};