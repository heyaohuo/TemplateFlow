import { WorkflowNode, Connection } from '@/lib/types/nodeType';
import { useState, useCallback } from 'react';

// 定义快照的接口
interface WorkflowState {
    nodes: WorkflowNode[];
    connections: Connection[];
  }
// 辅助函数：清洗数据，移除 React 节点等非纯数据属性
const sanitizeState = <T extends WorkflowState>(state: T): T => {
    return {
      ...state,
      nodes: state.nodes.map(({ icon, ...rest }: any) => ({
        ...rest
      })),
      connections: JSON.parse(JSON.stringify(state.connections))
    } as T;
  };

export function useHistory<T extends WorkflowState>(initialState: T) {
  const [index, setIndex] = useState(0);
  // 初始状态也需要清洗
  const [history, setHistory] = useState<T[]>(() => [sanitizeState(initialState)]);

  const saveHistory = useCallback((newState: T) => {
    try {
      // 1. 清洗数据，解决 Converting circular structure 错误
      const cleanState = sanitizeState(newState) as unknown as T;
      
      // 2. 比较快照（字符串化仅用于比较纯数据）
      const currentSnapshot = JSON.stringify(history[index]);
      const nextSnapshot = JSON.stringify(cleanState);

      if (currentSnapshot === nextSnapshot) return;

      const newHistory = history.slice(0, index + 1);
      newHistory.push(cleanState);

      if (newHistory.length > 30) newHistory.shift();

      setHistory(newHistory);
      setIndex(newHistory.length - 1);
    } catch (err) {
      console.warn("History save failed: circular structure detected in parameters", err);
    }
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      return history[index - 1];
    }
    return null;
  }, [index, history]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      return history[index + 1];
    }
    return null;
  }, [index, history]);

  return { saveHistory, undo, redo, canUndo: index > 0, canRedo: index < history.length - 1 };
}