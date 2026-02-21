'use client'

import { useState } from "react"
import { 
  Key, 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  X,
  Sparkles
} from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  onUseCredits: () => void
  onUseUserKey: (key: string) => void
}

export default function KeyInputModal({
  open,
  onClose,
  onUseCredits,
  onUseUserKey,
}: Props) {
  const [mode, setMode] = useState<"credits" | "key">("credits")
  const [key, setKey] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleConfirm = () => {
    if (mode === "key") {
      if (!key.trim()) {
        setError("请输入有效的 FAL API Key")
        return
      }
      // 使用用户自己的 Key
      onUseUserKey(key.trim())
      onClose()
    } else {
    // 作者的联系方式(xiaoyan)
      // 使用内置积分
      onUseCredits()
      onClose()
      // 跳转到价格页面 (使用原生 API 替代 Next.js router 以兼容当前环境)
      window.location.href = 'https://x.com/developer_yan'
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 border border-gray-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              配置生成方式
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              请选择您希望如何支付图像生成的费用
            </p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid gap-4 mb-6">
          {/* Option 1: Credits */}
          <div
            onClick={() => setMode("credits")}
            className={`relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:border-blue-300 ${
              mode === "credits"
                ? "border-blue-600 bg-blue-50/50"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
               mode === "credits" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Sparkles size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-bold ${mode === "credits" ? "text-blue-900" : "text-gray-900"}`}>
                  使用内置积分
                </span>
                {mode === "credits" && (
                  <CheckCircle2 size={20} className="text-blue-600" />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                简单快捷，无需技术配置。直接充值积分即可开始生成。
              </p>
              <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                推荐新手
              </span>
            </div>
          </div>

          {/* Option 2: Custom Key */}
          <div
            onClick={() => setMode("key")}
            className={`relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:border-purple-300 ${
              mode === "key"
                ? "border-purple-600 bg-purple-50/50"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
               mode === "key" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              <Key size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-bold ${mode === "key" ? "text-purple-900" : "text-gray-900"}`}>
                  使用 FAL API Key
                </span>
                {mode === "key" && (
                  <CheckCircle2 size={20} className="text-purple-600" />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                适合开发者或高频用户。使用您自己的账户扣费，费率更低。
              </p>
            </div>
          </div>
        </div>

        {/* Conditional Input Section */}
        {mode === "key" && (
          <div className="mb-6 rounded-xl bg-gray-50 p-4 border border-gray-100 animate-in slide-in-from-top-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              输入您的 API Key
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="fal_xxxxxxxxxxxxxxxxx"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value)
                  setError(null)
                }}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 ${
                  error 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                    : "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
                }`}
              />
            </div>
            
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <X size={14} /> {error}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>您的 Key 仅存储在本地浏览器中</span>
              <a 
                href="https://fal.ai/dashboard/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-600 hover:text-purple-700 hover:underline font-medium"
              >
                获取 Key <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all active:scale-95 ${
              mode === "credits" 
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" 
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
            }`}
          >
            {mode === "credits" ? "联系作者" : "确认使用"}
          </button>
        </div>
      </div>
    </div>
  )
}