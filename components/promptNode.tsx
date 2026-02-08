'use client'

import React, { useState, useMemo } from 'react'
import { WorkflowNode, NodeType, Connection } from '@/lib/types/nodeType'
import { handlePrompt } from '@/hooks/useNodeAgent'
import { Video, ImageIcon, Clock, Loader2, Sparkles } from 'lucide-react'
import { image_modles, video_modles } from '@/lib/types/modleType'
import { AllModelIds } from '@/lib/types/ratioType'

// --- 类型定义 ---
type AppMode = 'image' | 'video' | 'text'
type ResolutionType = '1k' | '2k' | '720p'
type AspectRatioType = '1:1' | '16:9' | '9:16' | '4:3'
type DurationType = '5s' | '10s'

interface InputNodeProps {
  node: WorkflowNode
  draggingNodeId: string | null
  snapTargetId: string | null
  linkingFromId: string | null
  combinedImgUrls?: string[]
  nodes: WorkflowNode[]
  connections: Connection[]
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>
  onAddNode: (
    type: NodeType,
    x: number,
    y: number,
    data: any,
    sourceNodeId: string
  ) => void
  startLinking: (e: React.MouseEvent, nodeId: string) => void
  onMouseDown?: (e: React.MouseEvent) => void
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
        className={`appearance-none cursor-pointer rounded-xl border border-gray-200 bg-gray-50/50 py-1 pr-6 text-[11px] font-bold text-gray-600
          hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10
          ${icon ? 'pl-8' : 'pl-3'}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function PromptNode(props: InputNodeProps) {
  const {
    node,
    draggingNodeId,
    onAddNode,
    setNodes,
    nodes,
    connections,
    combinedImgUrls,
    startLinking,
    onMouseDown,
  } = props

  const mode: AppMode = node.mode || 'image'

  // --- 动态配置 ---
  const config = useMemo(() => {
    if (mode === 'video') {
      return {
        title: 'Video Generator',
        icon: <Video size={14} />,
        themeColor: 'bg-purple-600',
        models: video_modles.map(m => ({ label: m.name, value: m.modle_id })),
      
      }
    }

    // image + text 共用
    return {
      title: mode === 'text' ? 'Image Generator' : 'Image Generator',
      icon: <ImageIcon size={14} />,
      themeColor: 'bg-slate-900',
      models: image_modles.filter(m => mode === 'text' ? m.type === "T2I" : m.type === "I2I").map(m => ({ label: m.name, value: m.modle_id })),
    }
  }, [mode])

  // --- 状态 ---
  const [resolution, setResolution] = useState<ResolutionType>('1k')
  const [ratio, setRatio] = useState<AspectRatioType>('16:9')
  const [selectedModel, setSelectedModel] = useState<AllModelIds>(
    config.models[0].value
  )
  const [duration, setDuration] = useState<DurationType>('5s')
  const [isGenerating, setIsGenerating] = useState(false)

  // --- 图片输入（仅 image / video） ---
  const activeImgUrls = useMemo(() => {
    if (mode === 'text') return []

    if (combinedImgUrls?.length) return combinedImgUrls

    return connections
      .filter((c) => c.to === node.id)
      .map((c) => {
        const source = nodes.find((n) => n.id === c.from)
        return source?.type === 'IMAGE' ? source.imageUrl : null
      })
      .filter(Boolean) as string[]
  }, [mode, combinedImgUrls, connections, nodes, node.id])

  const handleGenerate = async () => {
    if (!node.prompt || isGenerating) return
    setIsGenerating(true)
  
    try {
      // 1️⃣ 收集多图（UI 只负责收集，不负责判断）
      const base64Images =
        mode === 'text'
          ? undefined
          : activeImgUrls.map((url) => url.split(',')[1] || url)
  
      // 2️⃣ 所有“可变参数”统一放进 extra
      const extra = {
        duration: mode === 'video' ? duration : undefined,
        resolution,
        ratio,
      }
  
      // 3️⃣ 调用 agent
      const result = await handlePrompt({
        id: node.id,
        prompt: node.prompt!,
        model: selectedModel,
        mode,
        base64Images,
        extra,
      })
  
      // 4️⃣ 根据返回类型创建不同节点
      if (result) {
        onAddNode(
          'IMAGE',
          node.x + 400,
          node.y,
          {
            imageUrl: result.url,
            label: `Result (${selectedModel})`,
          },
          node.id
        )
      }
    } finally {
      setIsGenerating(false)
    }
  }
  
  // 1. 定义触发禁用的新条件
  const isMediaMissing = (mode === "image" || mode === "video") && activeImgUrls.length === 0;
  // 2. 综合判断是否禁用按钮
  const canGenerate = node.prompt && !isGenerating && !isMediaMissing;

  return (
    <div
      onMouseDown={onMouseDown}
      className={`relative w-[450px] rounded-2xl border-2 bg-white transition-all
        ${
          draggingNodeId === node.id
            ? 'border-indigo-500 scale-[1.02] shadow-2xl'
            : 'border-transparent shadow-xl hover:border-slate-200'
        }`}
    >
      {/* 标题 */}
      <div className="absolute -top-8 left-0 flex items-center gap-2">
        <div
          className={`w-5 h-5 ${config.themeColor} rounded-xl flex items-center justify-center`}
        >
          <div className="text-white">{config.icon}</div>
        </div>
        <span className="text-xs tracking-widest text-slate-800">
          {config.title}
        </span>
      </div>

      {/* 连接点 */}
      <div className="absolute -left-2.5 top-8 w-5 h-5 rounded-full bg-slate-300 border-[3px] border-white" />
      <div
        onMouseDown={(e) => {
          e.stopPropagation()
          startLinking(e, node.id)
        }}
        className="absolute -right-2.5 top-8 w-5 h-5 bg-white rounded-full border-[3px] border-indigo-500 cursor-crosshair"
      />

      {/* 顶部素材栏（仅 image / video） */}
      {mode !== 'text' && (
        <div className="flex gap-2 px-2 pt-2 overflow-x-auto">
          {activeImgUrls.length === 0 && (
            <div className="h-15 w-15 rounded-2xl border border-dashed flex items-center justify-center text-slate-300">
              <Sparkles size={18} />
            </div>
          )}
          {activeImgUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              className="h-15 w-15 rounded-lg object-cover border"
            />
          ))}
        </div>
      )}

      {/* Prompt */}
      <div className="px-2 pt-2">
        <textarea
          value={node.prompt || ''}
          onChange={(e) =>
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id ? { ...n, prompt: e.target.value } : n
              )
            )
          }
          placeholder={
            mode === 'video'
              ? 'Describe motion and cinematic feeling...'
              : 'Describe your imagination...'
          }
          className="w-full min-h-[120px] rounded-2xl p-4 bg-slate-50 text-sm outline-none focus:bg-white"
        />
      </div>

      {/* 底部控制 */}
      <div className="flex justify-between items-center px-2 py-2">
        <div className="flex gap-2">
          <SelectTrigger
            value={selectedModel}
            onChange={setSelectedModel}
            options={config.models}
          />

          {mode === 'video' && (
            <SelectTrigger
              value={duration}
              onChange={setDuration}
              icon={<Clock size={12} />}
              options={[
                { label: '5s', value: '5s' },
                { label: '10s', value: '10s' },
              ]}
            />
          )}

          <SelectTrigger
            value={resolution}
            onChange={setResolution}
            options={[
              { label: '720P', value: '720p' },
              { label: '1K', value: '1k' },
              { label: '2K', value: '2k' },
            ]}
          />

          <SelectTrigger
            value={ratio}
            onChange={setRatio}
            options={[
              { label: '1:1', value: '1:1' },
              { label: '16:9', value: '16:9' },
              { label: '9:16', value: '9:16' },
            ]}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`h-8 w-8 rounded-2xl flex items-center justify-center
            ${
              canGenerate
                ? `${config.themeColor} text-white`
                : 'bg-slate-100 text-slate-300'
            }`}
        >
          {isGenerating ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
