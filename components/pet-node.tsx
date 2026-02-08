"use client"

import React from 'react';
import { Gamepad2, Move, Dog, Cat, Sparkles } from 'lucide-react';
import { WorkflowNode, LifeStage, PetSpecies, PetEmotion, Point } from '@/lib/types/nodeType';

interface PetNodeProps {
  node: WorkflowNode;
  draggingNodeId: string | null;
  lifeStage: LifeStage;
  petSpecies: PetSpecies;
  crackLevel: number;
  petEmotion: PetEmotion;
  setCrackLevel: React.Dispatch<React.SetStateAction<number>>;
  setPetSpecies: React.Dispatch<React.SetStateAction<PetSpecies>>;
  setPetEmotion: React.Dispatch<React.SetStateAction<PetEmotion>>;
  setLifeStage: React.Dispatch<React.SetStateAction<LifeStage>>;
  startLinking: (e: React.MouseEvent, nodeId: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const PetNode: React.FC<PetNodeProps> = ({
  node,
  draggingNodeId,
  lifeStage,
  petSpecies,
  crackLevel,
  petEmotion,
  setCrackLevel,
  setPetSpecies,
  setPetEmotion,
  setLifeStage,
  startLinking,
  onMouseDown
}) => {
  const renderPet = () => {
    if (lifeStage === 'egg') {
      return (
        <div className="relative group cursor-pointer" onClick={() => setCrackLevel(c => Math.min(c + 10, 100))}>
          <div className={`w-32 h-40 bg-orange-50 border-8 border-slate-900 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[8px_8px_0_rgba(0,0,0,0.1)] relative overflow-hidden animate-[wiggle_3s_ease-in-out_infinite]`}>
            {crackLevel > 20 && <div className="absolute top-10 left-4 w-12 h-1 bg-slate-900 rotate-45 opacity-40" />}
            {crackLevel > 50 && <div className="absolute top-20 right-4 w-16 h-1 bg-slate-900 -rotate-12 opacity-40" />}
            {crackLevel > 80 && <div className="absolute bottom-10 left-8 w-10 h-1 bg-slate-900 rotate-[70deg] opacity-40" />}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Sparkles size={40} className="animate-pulse" />
            </div>
          </div>
          <div className="mt-4 text-center font-black text-[10px] uppercase tracking-widest text-slate-400">
            孵化进度: {crackLevel}%
          </div>
        </div>
      );
    }

    const isDog = petSpecies === 'dog';
    const baseColor = isDog ? 'bg-orange-400' : 'bg-orange-300';
    
    return (
      <div className="relative flex flex-col items-center">
        {petEmotion !== 'idle' && (
          <div className="absolute -top-12 bg-white border-4 border-slate-900 px-4 py-1 rounded-full font-black text-xs animate-bounce z-50 shadow-lg whitespace-nowrap">
            {petEmotion === 'happy' ? "好吃！" : "思考中..."}
          </div>
        )}
        <div className={`
          w-40 h-36 rounded-[50px_50px_30px_30px] border-8 border-slate-900 relative shadow-[inset_0_-8px_0_rgba(0,0,0,0.1)]
          ${baseColor} transition-all duration-300
          ${petEmotion === 'happy' ? 'animate-[jump_0.4s_ease-in-out_infinite]' : ''}
        `}>
          <div className={`absolute -top-4 left-2 w-10 h-12 ${baseColor} border-8 border-slate-900 rounded-2xl ${isDog ? 'rotate-[-15deg]' : 'rounded-t-full'}`} />
          <div className={`absolute -top-4 right-2 w-10 h-12 ${baseColor} border-8 border-slate-900 rounded-2xl ${isDog ? 'rotate-[15deg]' : 'rounded-t-full'}`} />
          <div className="flex gap-8 justify-center mt-10">
            <div className="w-3.5 h-3.5 bg-slate-900 rounded-full" />
            <div className="w-3.5 h-3.5 bg-slate-900 rounded-full" />
          </div>
          <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-8 bg-white/30 rounded-full border-4 border-slate-900/10 flex items-center justify-center`}>
            <div className={`w-4 h-2 bg-slate-900 rounded-full transition-all ${petEmotion === 'happy' ? 'h-4 bg-red-400' : ''}`} />
          </div>
          <div className={`absolute bottom-4 -right-6 w-10 h-5 ${baseColor} border-4 border-slate-900 rounded-full origin-left animate-[wag_0.4s_infinite]`} />
        </div>
      </div>
    );
  };

  return (
    <div 
      onMouseDown={onMouseDown}
      className={`flex gap-4 items-stretch p-4 bg-white border-4 border-slate-900 rounded-[32px] shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-transform ${draggingNodeId === node.id ? 'scale-[1.02] cursor-grabbing' : 'cursor-grab hover:border-blue-500'}`}
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-20 pointer-events-none">
        <Move size={16} />
      </div>
      
      <div 
        onMouseDown={(e) => startLinking(e, node.id)} 
        className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-300 rounded-full border-2 border-white transition-all cursor-crosshair hover:scale-150 hover:bg-blue-500 z-20" 
      />

      <div className="relative px-2 pt-2">
        {renderPet()}
      </div>

      <div className="w-40 border-l-4 border-slate-100 pl-4 flex flex-col justify-center" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-3">
          <Gamepad2 size={18} className="text-pink-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">实验室节点</span>
        </div>
        <div className="space-y-3">
          {lifeStage === 'egg' ? (
            <button onClick={() => setCrackLevel(c => Math.min(c + 20, 100))} className="w-full py-2 bg-orange-400 border-2 border-slate-900 rounded-xl text-white text-[10px] font-black animate-pulse hover:bg-orange-500 transition-colors shadow-sm">
              加速孵化
            </button>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <button onClick={() => setPetSpecies('dog')} className={`w-full py-1.5 border-2 border-slate-900 rounded-lg text-[10px] font-black flex items-center justify-center gap-2 transition-colors ${petSpecies === 'dog' ? 'bg-orange-400 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <Dog size={12}/> 柴犬
                </button>
                <button onClick={() => setPetSpecies('cat')} className={`w-full py-1.5 border-2 border-slate-900 rounded-lg text-[10px] font-black flex items-center justify-center gap-2 transition-colors ${petSpecies === 'cat' ? 'bg-slate-600 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <Cat size={12}/> 橘猫
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button onClick={() => setPetEmotion('happy')} className="py-1.5 bg-yellow-300 border-2 border-slate-900 rounded-lg text-[10px] font-black hover:bg-yellow-400 active:scale-95 transition-all">开心</button>
                <button onClick={() => setPetEmotion('thinking')} className="py-1.5 bg-blue-300 border-2 border-slate-900 rounded-lg text-[10px] font-black hover:bg-blue-400 active:scale-95 transition-all">思考</button>
              </div>
              <button onClick={() => {setLifeStage('egg'); setCrackLevel(0);}} className="w-full mt-2 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black hover:bg-slate-700 transition-colors">重置</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
