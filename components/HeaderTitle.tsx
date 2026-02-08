'use client'

import React, { useState, useRef, useEffect } from 'react'

interface HeaderTitleProps {
    headerTitle:string;
    setHeaderTitle: (n:string)=>void;
};

export default function HeaderTitle({headerTitle, setHeaderTitle}:HeaderTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当进入编辑模式时，自动聚焦 input
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select(); // 自动全选，方便覆盖
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (headerTitle.trim() === '') setHeaderTitle('Untitled Workflow'); // 防止为空
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur(); // 按回车保存
    if (e.key === 'Escape') setIsEditing(false); // 按 Esc 取消
  };

  return (
    <div className="flex items-center gap-2 cursor-pointer group">
      {isEditing ? (
        <input
          ref={inputRef}
          value={headerTitle}
          onChange={(e) => setHeaderTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-sm transparent text-slate-800 px-1 outline-none w-fit"
        />
      ) : (
        <div 
          className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1 rounded-md transition-colors"
          onClick={() => setIsEditing(true)}
        >
          <span className="text-sm text-slate-800">{headerTitle}</span>
        </div>
      )}
    </div>
  );
}