'use client'

import {
  Play,
  Square,
  Target,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

interface WorkspaceBottomProps {
  scale: number
  setScale: (fn: (s: number) => number) => void
  zoomReset: () => void
  handleFitView: () => void
}

export default function WorkspaceBottom({
  scale,
  setScale,
  zoomReset,
  handleFitView,
}: WorkspaceBottomProps) {
  return (
    <div className="absolute bottom-8 right-8 z-50 pointer-events-none">
      {/* Dock */}
      <div
        className="flex items-center gap-2
                   px-2 py-2
                   bg-white/80 backdrop-blur-xl
                   border border-slate-200/70
                   rounded-2xl
                   shadow-[0_20px_50px_rgba(0,0,0,0.12)]
                   pointer-events-auto"
      >

        {/* ================= View Controls ================= */}
        <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 bg-white">
          {/* Fit View */}
          <IconButton
            onClick={handleFitView}
            title="Fit View"
          >
            <Target size={16} />
          </IconButton>

          <Divider />

          {/* Zoom Out */}
          <IconButton
            onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </IconButton>

          {/* Scale */}
          <button
            onClick={zoomReset}
            className="px-3 h-10 text-xs font-medium
                       text-slate-700 bg-slate-50
                       hover:bg-slate-100
                       transition"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom In */}
          <IconButton
            onClick={() => setScale(s => Math.min(2, s + 0.1))}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

/* ================= Sub Components ================= */

function IconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-10
                 flex items-center justify-center
                 text-slate-600
                 hover:bg-slate-50
                 transition active:scale-95"
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-6 bg-slate-200" />
}
