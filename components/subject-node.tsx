'use client'

import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Maximize2, Zap, ChevronDown, Check, Layers } from 'lucide-react';
import { Connection, NodeType, WorkflowNode } from '@/lib/types/nodeType';
import { handlePrompt } from '@/hooks/useNodeAgent';
import { image_modles } from '@/lib/types/modleType';
import { AllModelIds } from '@/lib/types/ratioType';
import { generateId } from '@/utils/idGenerate';


type AspectRatioType = '1:1' | '16:9' | '9:16' | '4:3'
interface SubjectNodeProps {
  node: WorkflowNode;
  draggingNodeId: string | null;
  snapTargetId: string | null;
  linkingFromId: string | null;
  connections: Connection[];
  onAddNode: (type: NodeType, x: number, y: number, data: any, sourceNodeId: string, selfId?: string) => void;
  nodes: WorkflowNode[];
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
  startLinking: (e: React.MouseEvent, nodeId: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onPreview?: (url: string) => void;
  setShowKeyModal: (show: boolean) => void;
}

// --- 通用下拉组件 ---
interface SelectOption<T> {
  label: string
  value: T
}
function SelectTrigger<T extends string>({
  value,
  onChange,
  options,
  icon,
}: {
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  icon?: React.ReactNode
}) {
  return (
    <div className="relative group flex items-center">
      {icon && (
        <div className="absolute left-2.5 text-gray-400 group-focus-within:text-indigo-500">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none bg-slate-100/50 text-[10px] font-bold text-slate-700 pl-2.5 pr-6 py-2 rounded-lg outline-none border border-transparent hover:border-slate-200 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  )
}

export const SubjectNode: React.FC<SubjectNodeProps> = ({
  node, draggingNodeId, snapTargetId, linkingFromId, nodes,onPreview,
  onAddNode, setNodes, connections, startLinking, onMouseDown,setShowKeyModal
}) => {
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AllModelIds>("fal-ai/nano-banana-pro/edit");
  const [ratio, setRatio] = useState<AspectRatioType>('9:16')

  const [numImages, setNumImages] = useState("1"); // 生成图片数量，默认为1

  
  const models = image_modles.filter(m => m.type === "I2I");

  useEffect(() => {
    const targetConnection = connections.find(c => c.to === node.id);
    setSourceNodeId(targetConnection ? targetConnection.from : null);
  }, [connections, node.id]);

  const handleImageGeneration = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sourceNodeId || isLoading) return;
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    if (!sourceNode?.imageUrl) return;

    const falMode = localStorage.getItem("fal_mode") || "credits"
    const falKey = localStorage.getItem("fal_api_key")
    

    if (falMode === "credits" || !falKey) {
      // 没有 key → 弹窗
      setShowKeyModal(true)
      return
    }

    setIsLoading(true);
    try {
      const base64 = sourceNode.imageUrl.split(',')[1] || sourceNode.imageUrl;
      const extra = {
        numImages,
        resolution: "1K",
        ratio: ratio
      }
      const newUrls = await handlePrompt({
        prompt: node?.prompt || "Cinematic shot",
        base64Images: [base64],
        id: sourceNode.id,
        mode: "image",
        model: selectedModel,
        extra
      });

      if (Array.isArray(newUrls) && newUrls.length > 0) {
        const gapX = 260  // 横向间距
const gapY = 220  // 纵向间距
const rows = 2
const total = newUrls.length
const cols = Math.ceil(total / rows)

newUrls.forEach((item, index) => {
  const row = index % rows       // 0 | 1
  const col = Math.floor(index / rows)

  onAddNode(
    'IMAGE',
    node.x + 300 + col * gapX,
    node.y + row * gapY,
    {
      imageUrl: item.url,
      label: `Result ${index + 1} (${selectedModel})`,
    },
    node.id,
    generateId()
  )
})

      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      onMouseDown={onMouseDown}
      className={`relative w-[275px] bg-white rounded-[12px] shadow-2xl border-2 transition-all duration-300
        ${draggingNodeId === node.id ? 'border-indigo-500 scale-[1.02] z-50' : 'border-transparent hover:border-slate-200'}`}
    >
      {/* 1. 外部标题 */}
      <div className="absolute -top-8 left-0 flex items-center gap-2 group/title w-full pointer-events-none">
        <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100 pointer-events-auto">
          <Layers size={12} className="text-white" />
        </div>
        <div className="relative flex-1 pointer-events-auto">
          <span className="text-[12px] font-black text-slate-800 tracking-tight truncate block max-w-[180px]">
            {node.label || 'Subject Agent'}
          </span>
          <div className="absolute left-0 -top-5 opacity-0 group-hover/title:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap z-[110]">
            {node.label}
          </div>
        </div>
      </div>

      {/* 连接点 (Ports) */}
      <div className={`absolute -left-2.5 top-6 w-5 h-5 rounded-full border-[3px] border-white shadow-md z-20 ${sourceNodeId ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
      <div onMouseDown={(e) => { e.stopPropagation(); startLinking(e, node.id); }} className="absolute -right-2.5 top-6 w-5 h-5 bg-white rounded-full border-[3px] border-indigo-500 shadow-md cursor-crosshair hover:scale-125 z-20" />

      {/* 2. 图片展示区：自适应比例 */}
      <div className="p-0.5">
        <div className="group relative rounded-[20px] overflow-hidden bg-slate-50 border border-slate-100 min-h-[100px]">
          {node.imageUrl ? (
            <>
            <img 
              src={node.imageUrl} 
              alt="preview" 
              className="w-full h-auto block object-contain max-h-[350px] select-none" 
              onDragStart={(e) => e.preventDefault()}
            />
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 阻止冒泡，防止触发节点的拖拽或画布点击
                  onPreview?.(node.imageUrl!);
                }}
                className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform translate-y-2 group-hover:translate-y-0"
                title="全屏预览"
              >
                <Maximize2 size={16} />
              </button>
              </>
          ) : (
            <div className="aspect-video w-full flex flex-col items-center justify-center text-slate-300">
              <Sparkles size={20} className="mb-1 opacity-20" />
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-40">Waiting</span>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-[1px] flex items-center justify-center z-40">
              <Loader2 size={24} className="text-indigo-600 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* 3. 常驻提示词区域 & 弹出按钮 */}
      <div className="px-2 pt-1 pb-1">
        <div className="relative group/textarea">
          <div className="flex justify-between items-center mb-1 px-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">提示词</span>
            
            {/* ✨ 弹出模块触发按钮：位于 textarea 右上方 */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowFullEditor(!showFullEditor); }}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
              title="Expand Editor"
            >
              <Maximize2 size={12} />
            </button>
          </div>
          
          <textarea 
            value={node.prompt || ''} 
            onChange={(e) => setNodes(nds => nds.map(n => n.id === node.id ? {...n, prompt: e.target.value} : n))}
            className="w-full h-16 bg-slate-50/50 rounded-xl p-2 text-[11px] text-slate-600 outline-none border border-slate-100 focus:border-indigo-200 transition-all resize-none font-medium leading-tight"
            placeholder="Enter generation logic..."
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* 4. 底部控制区 */}
      <div className="px-2 pb-2 flex items-center gap-1">
        <div className="relative group">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AllModelIds)}
            onClick={(e) => e.stopPropagation()}
            className="w-full appearance-none bg-slate-100/50 text-[10px] font-bold text-slate-700 pl-2.5 pr-6 py-2 rounded-lg outline-none border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            {models.map(m => <option key={m.modle_id} value={m.modle_id}>{m.name}</option>)}
          </select>
          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <SelectTrigger
            value={ratio}
            onChange={setRatio}
            options={[
              { label: '16:9', value: '16:9' },
              { label: '1:1', value: '1:1' },
              { label: '9:16', value: '9:16' },
            ]}
          />
          <SelectTrigger
            value={numImages}
            onChange={setNumImages}
            options={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '4', value: '4' },
            ]}
          />
        <button 
          disabled={!sourceNodeId || isLoading}
          onClick={handleImageGeneration} 
          className={`shrink-0 w-10 h-8 flex items-center justify-center rounded-lg transition-all
            ${(sourceNodeId && !isLoading) 
              ? 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-90 shadow-md cursor-pointer' 
              : 'bg-slate-100 text-slate-300'}`}
        >
          <Zap size={14} fill={sourceNodeId ? "currentColor" : "none"} />
        </button>
      </div>

      {/* 5. 弹出式全屏编辑器 */}
      {showFullEditor && (
        <div 
          className="absolute left-[calc(100%+12px)] -top-4 w-80 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[24px] border border-slate-200 p-4 z-[150] animate-in zoom-in-95 duration-200"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-1 border-b border-slate-50 pb-1">
            <div className="flex items-center gap-2">
              <div className=" bg-indigo-50 rounded-md">
                <Sparkles size={12} className="text-indigo-600" />
              </div>
              <span className="text-[10px] font-black text-slate-800 tracking-widest">Full Prompt Editor</span>
            </div>
            <button 
              onClick={() => setShowFullEditor(false)} 
              className="p-1 hover:bg-emerald-50 rounded-full text-emerald-500 transition-colors"
            >
              <Check size={18} strokeWidth={3} />
            </button>
          </div>
          <textarea 
            value={node.prompt || ''} 
            onChange={(e) => setNodes(nds => nds.map(n => n.id === node.id ? {...n, prompt: e.target.value} : n))}
            autoFocus
            className="w-full h-60 bg-slate-50/50 rounded-2xl p-4 text-[13px] text-slate-700 outline-none border border-slate-100 focus:border-indigo-300 focus:bg-white transition-all resize-none font-medium leading-relaxed"
            placeholder="Describe your creative vision in detail..."
          />
        </div>
      )}
    </div>
  );
};