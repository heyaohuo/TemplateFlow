'use client'

import React from 'react'
import {
  Sparkles,
  Gift,
  Coins,
  Users,
  Share2,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import HeaderTitle from './HeaderTitle'

interface HeaderProps {
  headerTitle: string
  setHeaderTitle: (v: string) => void
  selectedNodeIds: Set<string>
  credits: number
  // 新增 Undo/Redo 属性
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export default function Header({
  headerTitle,
  setHeaderTitle,
  selectedNodeIds,
  credits,
  onRedo,onUndo,canUndo,canRedo
}: HeaderProps) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-16
                 flex items-center justify-between
                 px-4 z-50 pointer-events-none"
    >
      {/* ================= 左侧 ================= */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div
          className="w-10 h-10 rounded-xl
                     bg-gradient-to-br from-indigo-500 to-purple-600
                     flex items-center justify-center
                     shadow-lg shadow-indigo-500/20"
        >
          <Sparkles size={20} className="text-white" />
        </div>

        <HeaderTitle
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
        />
      </div>

      {/* ================= 右侧 ================= */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Undo 按钮 */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-10 cursor-pointer h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm
                      enabled:hover:bg-slate-50 enabled:active:scale-95 transition
                      disabled:opacity-30 disabled:cursor-not-allowed"
            title="撤销 (Ctrl+Z)"
          >
            <RotateCcw size={16} className="text-slate-700" />
          </button>

          {/* Redo 按钮 */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="w-10 h-10 cursor-pointer rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm
                      enabled:hover:bg-slate-50 enabled:active:scale-95 transition
                      disabled:opacity-30 disabled:cursor-not-allowed"
            title="重做 (Ctrl+Shift+Z)"
          >
            <RotateCw size={16} className="text-slate-700" />
          </button>
        {/* 已选中节点 */}
        {selectedNodeIds.size > 0 && (
          <div
            className="flex items-center gap-2
                       h-10 px-2
                       rounded-full
                       bg-white/80 backdrop-blur
                       border border-slate-200
                       text-xs font-medium text-slate-600
                       shadow-sm"
          >
            选中节点: {selectedNodeIds.size}
          </div>
        )}

        {/* Earn Tapies */}
        {/* <PillButton
          icon={Gift}
          label="Earn Tapies"
        /> */}

        {/* Credits */}
        <div
          className="flex items-center gap-2
                     h-10 px-2
                     rounded-full
                     bg-white
                     border border-slate-200
                     shadow-sm"
        >
          <Coins size={16} className="text-yellow-500" />
          <span className="text-sm font-semibold text-slate-900">
            {credits}
          </span>
        </div>

        {/* Community */}
        <PillButton
          icon={Users}
          label="Community"
        />

        {/* Share（圆形按钮） */}
        <button
          className="w-10 h-10
                     rounded-full
                     bg-white
                     border border-slate-200
                     flex items-center justify-center
                     shadow-sm
                     hover:bg-slate-50
                     transition active:scale-95"
        >
          <Share2 size={16} className="text-slate-700" />
        </button>
      </div>
    </div>
  )
}

/* ================= Pill Button ================= */

function PillButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
}) {
  return (
    <button
      className="flex items-center gap-2
                 h-10 px-4
                 rounded-full
                 bg-white
                 border border-slate-200
                 text-sm font-medium text-slate-800
                 shadow-sm
                 hover:bg-slate-50
                 transition active:scale-95"
    >
      <Icon size={16} className="text-slate-700" />
      {label}
    </button>
  )
}
