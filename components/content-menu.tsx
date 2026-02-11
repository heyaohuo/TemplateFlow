"use client"

import { NodeType } from '@/lib/types/nodeType';
import { Video, Music, Sparkles, Upload, FileText, ImageIcon} from 'lucide-react';
// --- ContextMenu Component (New) ---
interface ContextMenuProps {
    x: number;
    y: number;
    onAddNode: (type: NodeType, inputType: string) => void;
    onUpload?: () => void;
    onClose: () => void;
    showPromptPanel: boolean;
    setShowPromptPanel: (show: boolean) => void;
  }

  function MenuAction({ icon, label, sub, badge, onClick }: { icon: any, label: string, sub?: string, badge?: string, onClick?: () => void }) {
    return (
      <button 
        onClick={onClick}
        className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100/80 rounded-xl transition-all group text-left w-full"
      >
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all">
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-slate-700">{label}</span>
            {badge && <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase">{badge}</span>}
          </div>
          {sub && <span className="text-[10px] text-slate-400 leading-tight">{sub}</span>}
        </div>
      </button>
    );
  }  

export default function ContextMenu({ x, y, onAddNode, onUpload, onClose,showPromptPanel,
  setShowPromptPanel, }: ContextMenuProps) {

    return (
      <div 
        className="fixed z-100 w-[220px] bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl p-2 flex flex-col gap-1.5 animate-in fade-in zoom-in duration-100"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={onClose}
      >
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Add Nodes</div>
        
        <MenuAction icon={<FileText size={18} />} label="Input" onClick={()=>{ onAddNode('Input', "text"); onClose()}} />
        <MenuAction icon={<ImageIcon size={18} />} label="Image" onClick={() => { onAddNode('Input',"image"); onClose(); }} />
        <MenuAction icon={<Video size={18} />} label="Video" onClick={() => { onAddNode('Input',"video"); onClose(); }}/>
        <MenuAction icon={<Sparkles size={18} />} label="Templates" onClick={() => { setShowPromptPanel(!showPromptPanel); onClose(); }}/>
        {/* <MenuAction icon={<Music size={18} />} label="Audio" badge="Beta" />
        <MenuAction icon={<Scissors size={18} />} label="Image Editor" sub="Edit and process images" /> */}
        <div className="h-px bg-slate-100 mx-2 my-1" />
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Add Source</div>
        <MenuAction icon={<Upload size={18} />} label="Upload" onClick={onUpload} />
      </div>
    );
  }
  
