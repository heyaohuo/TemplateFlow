'use client'

import React, {useRef} from 'react'
import { 
  Sparkles, 
  Upload, 
  History, 
  Download, 
  Plus, X
} from 'lucide-react'
import { NodeType } from '@/lib/types/nodeType';

interface SidebarProps {
  onAddNode: (type: any) => void;
  setMenuConfig?: (config: any) => void;
  showPromptPanel: boolean;
  setShowPromptPanel: (show: boolean) => void;
  onDownloadWorkspace: () => void;
  onShowHistory: () => void;
  userAvatar?: string;
}

// 提取通用的侧边栏按钮组件

const COLOR_MAP = {
    indigo: {
      active: 'bg-indigo-50 text-indigo-600',
    },
    blue: {
      active: 'bg-blue-50 text-blue-600',
    },
  };
  
  const SidebarButton = ({
    icon: Icon,
    label,
    onClick,
    active = false,
    color = 'indigo',
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    active?: boolean;
    color?: keyof typeof COLOR_MAP;
  }) => {
    const activeClass = COLOR_MAP[color]?.active ?? '';
  
    return (
      <div className="relative group px-1.5">
        <button
          onClick={onClick}
          className={[
            'p-2.5 cursor-pointer rounded-xl transition-all duration-200 flex items-center justify-center',
            active
              ? `${activeClass} shadow-sm`
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
          ].join(' ')}
        >
          <Icon size={20} strokeWidth={2.2} />
        </button>
  
        {/* Tooltip */}
        <div
          className="absolute left-full top-1/2 ml-3 -translate-y-1/2 px-2 py-1.5
                     bg-slate-900 text-white text-[10px] font-bold rounded-lg
                     opacity-0 group-hover:opacity-100 pointer-events-none
                     transition-all duration-200 translate-x-[-8px] group-hover:translate-x-0
                     whitespace-nowrap z-[999]"
        >
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-slate-900" />
        </div>
      </div>
    );
  };
  



export const Sidebar: React.FC<SidebarProps> = ({
    onAddNode,
    setMenuConfig,
    showPromptPanel,
    setShowPromptPanel,
    onDownloadWorkspace,
    onShowHistory,
    userAvatar,
  }) => {
    const triggerRef = useRef<HTMLDivElement>(null);
  
    const handleMouseEnter = () => {
      if (!triggerRef.current || !setMenuConfig) return;
  
      const rect = triggerRef.current.getBoundingClientRect();
  
      setMenuConfig({
        uiX: rect.right + 12,
        uiY: rect.top,
        canvasX: 0,
        canvasY: 0,
      });
    };
  
    return (
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2
                   flex flex-col justify-between
                   py-2 w-[60px]
                   bg-white/80 backdrop-blur-2xl
                   border border-slate-200/60
                   rounded-[24px]
                   z-50
                   shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
      >
        {/* 上部分 */}
        <div className="flex flex-col items-center gap-3 pb-1">
          <div
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            className="relative cursor-pointer group"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center
                            transition-all duration-300 group-hover:bg-slate-800
                            shadow-lg shadow-slate-200"
            >
              <Plus
                size={20}
                className="text-white absolute transition-all duration-300
                           opacity-100 scale-100
                           group-hover:opacity-0 group-hover:scale-50 group-hover:rotate-90"
              />
              <X
                size={20}
                className="text-white absolute transition-all duration-300
                           opacity-0 scale-50 -rotate-90
                           group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0"
              />
            </div>
          </div>
        </div>
  
        {/* 下部分 */}
        <div className="flex flex-col gap-1 items-center">
          <SidebarButton
            icon={Sparkles}
            label="Prompt Templates"
            active={showPromptPanel}
            color="blue"
            onClick={() => setShowPromptPanel(!showPromptPanel)}
          />
  
          <SidebarButton icon={History} label="History" onClick={onShowHistory} />
  
          <SidebarButton
            icon={Upload}
            label="Import Workflow"
            onClick={() => document.getElementById('import-workflow')?.click()}
          />
  
          <SidebarButton
            icon={Download}
            label="Export Workflow"
            onClick={onDownloadWorkspace}
          />
  
          <div className="w-8 h-px bg-slate-200 my-2" />
  
          {/* Avatar */}
          <div className="relative group pb-1">
            <button
              className="w-10 h-10 rounded-full overflow-hidden
                         border-2 border-white bg-slate-100
                         shadow-md hover:ring-2 hover:ring-indigo-500/20
                         transition-all active:scale-90"
            >
              {userAvatar ? (
                <img src={userAvatar} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center
                                bg-gradient-to-br from-indigo-500 to-purple-500
                                text-white text-xs font-bold">
                  JD
                </div>
              )}
            </button>
  
            <div className="absolute left-full top-1/2 ml-3 -translate-y-1/2
                            px-2 py-1.5 bg-slate-900 text-white
                            text-[10px] font-bold rounded-lg
                            opacity-0 group-hover:opacity-100
                            pointer-events-none whitespace-nowrap z-[999]">
              User Settings
            </div>
          </div>
        </div>
      </div>
    );
  };
  