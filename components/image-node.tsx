'use client'

import React from 'react';
import { ImageIcon, UploadCloud, Maximize2, Download } from 'lucide-react'; // 引入 Maximize2 图标
import { WorkflowNode } from '@/lib/types/nodeType';
import { isVideoUrl } from '@/utils/urlType';

interface ImageNodeProps {
  node: WorkflowNode;
  draggingNodeId: string | null;
  snapTargetId: string | null;
  linkingFromId: string | null;
  startLinking: (e: React.MouseEvent, nodeId: string) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onPreview: (url: string) => void;
}



export default function ImageNode({ 
  node,
  draggingNodeId,
  snapTargetId,
  linkingFromId,
  startLinking,
  onMouseDown,
  onPreview 
}: ImageNodeProps) {
  
  const isDragging = draggingNodeId === node.id;
  const isSnapTarget = snapTargetId === node.id;

  const isVideo = node.imageUrl ? isVideoUrl(node.imageUrl) : false;


  const handleDownload = (
    e: React.MouseEvent,
    imageUrl: string,
    filename: string
  ) => {
    e.stopPropagation();
  
    const downloadUrl =
      `/api/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
  
    window.location.href = downloadUrl;
  };
  

  return (
    <div 
      onMouseDown={onMouseDown}
      className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all w-[240px]
        ${isDragging ? 'shadow-2xl scale-[1.02] border-blue-400 z-50' : 'border-transparent hover:border-slate-200'}
        ${isSnapTarget ? 'ring-4 ring-blue-500/20 border-blue-400 scale-105 shadow-lg' : ''}
      `}
    >
      {/* 外部标题 */}
      <div className="absolute -top-7 -left-1 flex items-center gap-1.5 whitespace-nowrap">

        <div className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center shadow-sm">
          <ImageIcon size={12} className="text-white" />
        </div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {node.label || 'Output Image'}
        </span>
        {/* ⬇️ 下载按钮 */}
        {node.imageUrl && (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) =>
              handleDownload(e, node.imageUrl!, `${node.id}.${isVideo ? 'mp4' : 'png'}`)
            }
            className="
              ml-1 p-1 rounded-md
              text-slate-400 hover:text-slate-700
              hover:bg-slate-100
              transition-all
            "
            title="Download image"
          >
            <Download size={16} />
          </button>
        )}
      </div>

      {/* 连接点逻辑保持不变 ... */}
      <div className={`absolute -left-2 top-8 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white transition-all z-20 ${(linkingFromId && linkingFromId !== node.id) ? 'bg-blue-500' : 'bg-slate-300'}`} />
      <div onMouseDown={(e) => { e.stopPropagation(); startLinking(e, node.id); }} className="absolute -right-2 top-8 -translate-y-1/2 w-4 h-4 bg-slate-300 rounded-full border-2 border-white transition-all cursor-crosshair hover:bg-blue-500 z-20" />

      {/* --- 图片主体 --- */}
      <div className="p-0 w-full">

{node.imageUrl ? (
  <div className="relative group rounded-xl overflow-hidden bg-slate-50 border border-slate-100">

    {isVideo ? (
      <video
        src={node.imageUrl}
        playsInline
        muted
        loop
        controls
        preload="metadata"
        onDragStart={(e) => e.preventDefault()}
        className="w-full h-auto block min-h-[100px] max-h-[400px] object-cover"
      />
    ) : (
      <img
        src={node.imageUrl}
        alt="Generated"
        onDragStart={(e) => e.preventDefault()}
        className="w-full h-auto block min-h-[100px] max-h-[400px] object-cover"
      />
    )}

    {/* 右上角预览按钮（视频 / 图片共用） */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onPreview(node.imageUrl!);
      }}
      className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform translate-y-2 group-hover:translate-y-0"
      title="全屏预览"
    >
      <Maximize2 size={16} />
    </button>

  </div>
) : (
  <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 bg-slate-50/50">
    <UploadCloud size={24} className="text-slate-300" />
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
      Waiting
    </span>
  </div>
)}


      </div>
    </div>
  );
}