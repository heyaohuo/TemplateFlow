"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, ImageIcon,Layers,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';

import PromptNode from '@/components/promptNode';
import ImageNode from '@/components/image-node';
import { SubjectNode } from '@/components/subject-node';
import ContextMenu from '@/components/content-menu';
import { 
  WorkflowNode, Connection, CanvasTransform, Point, 
  NodeType,
  MessageState
} from '@/lib/types/nodeType';
import { allPrompts, testprompts } from '@/lib/total_prompts';
import { PromptTemplatePanel } from '@/components/PromptTemplatePanel';
import { Sidebar } from '@/components/Siderbar';
import Header from '@/components/header';
import WorkspaceBottom from '@/components/WorkspaceBottom';
import { useHistory } from '@/hooks/useHistory';
import { isVideoUrl } from '@/utils/urlType';
import { generateId } from '@/utils/idGenerate';
import KeyInputModal from '@/components/KeyInputModal';
import { WorkflowStorage } from '@/utils/storageUtils';

const App: React.FC = () => {
  // const initialNodes: WorkflowNode[] = [
  //   { 
  //     id: 'fetch_user', 
  //     x: 500, 
  //     y: 250, 
  //     label: testprompts?.[0]?.title || "User", 
  //     type: 'Subject', 
  //     color: 'bg-blue-100 text-blue-600', 
  //     icon: <User size={18} />,
  //     imageUrl: testprompts?.[0]?.prompt_img,
  //     prompt: testprompts?.[0]?.prompt
  //   }
  // ]
  // --- 状态管理 ---
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);

  const [connections, setConnections] = useState<Connection[]>([]);
  
  // 1. 在 App 组件中管理状态
  const [showPromptPanel, setShowPromptPanel] = useState(false);
  const [scale, setScale] = useState(1);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 }); // 这里的坐标是画布坐标
  const [snapTargetId, setSnapTargetId] = useState<string | null>(null);
  
  // 记录拖拽时的偏差值
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>({ x: 0, y: 0 });
  const [isCanvasDragging, setIsCanvasDragging] = useState<boolean>(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // 标题
  const [headerTitle, setHeaderTitle] = useState("Untitled");

  // 连线与菜单状态
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null);
  // menuConfig 扩展：uiX/Y 用于菜单定位，canvasX/Y 用于生成节点
  const [menuConfig, setMenuConfig] = useState<{ 
    uiX: number, 
    uiY: number, 
    canvasX: number, 
    canvasY: number, 
    fromNodeId?: string 
  } | null>(null);

  // 状态管理：多选、框选
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  
  // 剪贴板
  const [clipboard, setClipboard] = useState<{ nodes: Partial<WorkflowNode>[], avgX: number, avgY: number } | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 }); // 记录屏幕坐标

  // 运行状态
  // const [isRunning, setIsRunning] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Pet States
  // const [lifeStage, setLifeStage] = useState<LifeStage>('born'); 
  // const [petSpecies, setPetSpecies] = useState<PetSpecies>('dog'); 
  // const [crackLevel, setCrackLevel] = useState(0); 
  // const [petEmotion, setPetEmotion] = useState<PetEmotion>('idle'); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // 自动保存状态
  const [isAutoSaving, setIsAutoSaving] = useState(false); // 可选：用于显示保存状态
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });
  
  // 用户输入 fal ai key
  const [showKeyModal, setShowKeyModal] = useState(false)

  // 1. 初始化
// 2. 初始化历史记录 (传入初始状态)
const { saveHistory, undo, redo, canUndo, canRedo } = useHistory({ 
  nodes: [] as WorkflowNode[], 
  connections: connections 
});

const ICON_MAP: Record<string, React.ReactNode> = {
  'Subject': <Layers size={12} />,
  'Input': <ImageIcon size={12} />,
  'IMAGE': <ImageIcon size={12} />,
  // ... 其他类型
};

// 2. 增强版的更新状态函数
const applyHistoryState = (state: any) => {
  if (!state) return;

  // 为每个节点重新注入 React 图标
  const nodesWithIcons = state.nodes.map((node: any) => ({
    ...node,
    icon: ICON_MAP[node.type] || <ImageIcon size={12} />
  }));

  setNodes(nodesWithIcons);
  setConnections(state.connections);
};

// 3. 撤销/重做执行
const handleUndo = () => {
  const prevState = undo();
  if (prevState) applyHistoryState(prevState);
};

const handleRedo = () => {
  const nextState = redo();
  if (nextState) applyHistoryState(nextState);
};

// 4. 键盘快捷键监听
// 4. 键盘监听
useEffect(() => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      e.shiftKey ? handleRedo() : handleUndo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [handleUndo, handleRedo]);

  const scaleRef = useRef(scale);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  
  useEffect(() => {
    const el = canvasRef.current; // 使用你的 canvasRef
    if (!el) return;
  
    const handleWheel = (e: WheelEvent) => {
      // 必须在原生监听器中 preventDefault，否则页面会缩放或滚动
      e.preventDefault();
  
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
  
      const prevScale = scaleRef.current;
      const nextScale = Math.min(Math.max(0.1, prevScale + delta), 3);
      
      // 如果缩放没变，不进行后续计算
      if (prevScale === nextScale) return;
  
      const ratio = nextScale / prevScale;
  
      // 获取相对于 main 容器的鼠标位置
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
  
      // 更新偏移量，使鼠标下的逻辑点保持在视口相同位置
      setCanvasTransform(prev => ({
        x: mouseX - (mouseX - prev.x) * ratio,
        y: mouseY - (mouseY - prev.y) * ratio,
      }));
  
      setScale(nextScale);
    };
  
    // 添加原生监听器，开启 passive: false 以便 preventDefault 有效
    el.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef]); // 依赖项包含 ref


  // 1. 初始化时加载数据
  useEffect(() => {
    const localData = WorkflowStorage.load();
    if (localData) {
      setNodes(localData.nodes);
      setConnections(localData.connections);
    } else {
      // 如果没有本地数据，可以设置一些默认的初始节点
      // setNodes(defaultNodes);
    }
  }, []);

  // 2. 手动保存触发函数
  const handleSave = () => {
    WorkflowStorage.save(nodes, connections);
    alert('保存成功！');
  };

  // 自动保存逻辑（自带防抖）
  useEffect(() => {
    // 如果画布是空的（例如刚初始化），可能不需要覆盖本地数据
    // 你可以根据实际业务逻辑调整这个判断条件
    if (nodes.length === 0 && connections.length === 0) return;

    setIsAutoSaving(true);

    // 设置一个延迟定时器（例如 3000 毫秒）
    const timerId = setTimeout(() => {
      WorkflowStorage.save(nodes, connections);
      console.log('自动保存完成');
      setIsAutoSaving(false);
    }, 3000);

    // 👇 核心机制：清理函数
    // 每次 nodes 或 connections 变化触发新的 useEffect 之前，
    // React 会先执行这个清理函数，把上一次还没来得及执行的 setTimeout 取消掉。
    // 这样就保证了只有在用户停止操作 1000 毫秒后，才会真正执行 save 方法。
    return () => {
      clearTimeout(timerId);
    };
  }, [nodes, connections]); // 依赖项：只要节点或连线变化，就重新计时

  // 监听孵化
  // useEffect(() => {
  //   if (crackLevel >= 100 && lifeStage === 'egg') {
  //     setLifeStage('born');
  //   }
  // }, [crackLevel, lifeStage]);

  // 消息自动关闭
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 坐标转换：屏幕像素 -> 画布逻辑坐标
  const screenToCanvas = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - canvasTransform.x) / scale,
      y: (clientY - rect.top - canvasTransform.y) / scale
    };
  }, [canvasTransform, scale]);

  // --- 键盘快捷键 ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止在输入框内触发
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      const isMod = e.ctrlKey || e.metaKey;

      // Ctrl + C: 复制
      if (isMod && e.key === 'c' && selectedNodeIds.size > 0) {
        const selectedNodes = nodes.filter(n => selectedNodeIds.has(n.id));
        if (selectedNodes.length === 0) return;
        
        const avgX = selectedNodes.reduce((acc, n) => acc + n.x, 0) / selectedNodes.length;
        const avgY = selectedNodes.reduce((acc, n) => acc + n.y, 0) / selectedNodes.length;
        
        setClipboard({
          nodes: selectedNodes.map(({ id, ...rest }) => rest),
          avgX,
          avgY
        });
      }

      // Ctrl + V: 粘贴
      if (isMod && e.key === 'v' && clipboard) {
        // 粘贴到鼠标当前位置
        const targetPos = screenToCanvas(mousePosRef.current.x, mousePosRef.current.y);
        const newNodes: WorkflowNode[] = clipboard.nodes.map((nData, index) => ({
          ...nData as WorkflowNode,
          id: `node-${Date.now()}-${index}`,
          // 保持相对位置，整体移动到鼠标处
          x: targetPos.x + (nData.x! - clipboard.avgX),
          y: targetPos.y + (nData.y! - clipboard.avgY),
        }));
        
        setNodes(nds => [...nds, ...newNodes]);
        setSelectedNodeIds(new Set(newNodes.map(n => n.id)));
      }

      // Delete/Backspace: 删除
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeIds.size > 0) {
        // 同时删除相关的连线
        const idsToRemove = selectedNodeIds;
        setNodes(nds => nds.filter(n => !idsToRemove.has(n.id)));
        setConnections(prev => prev.filter(c => !idsToRemove.has(c.from) && !idsToRemove.has(c.to)));
        setSelectedNodeIds(new Set());
        const nextNodes = nodes.filter(n => !idsToRemove.has(n.id));
        const nextConnections = connections.filter(c => !idsToRemove.has(c.from) && !idsToRemove.has(c.to));
        saveHistory({ nodes: nextNodes, connections: nextConnections });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, clipboard, nodes, connections, screenToCanvas]); // ✨ 修复：添加 nodes 和 connections 依赖


  // 2. 处理模板选择逻辑
  const handleTemplateSelect = (template: any) => {
    // 计算新节点的位置（例如放在屏幕中心或者上一个节点旁边）
    // 闭包捕获当前所需位置
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const pos = screenToCanvas(centerX, centerY);


    const newNode: WorkflowNode = {
      id: `subject_${Date.now()}`,
      type: 'Subject', // 创建一个 Subject 类型的节点
      x: pos.x - 120,
      y: pos.y - 120,
      label: template.title,
      prompt: template.prompt, // 将模板提示词注入节点
      imageUrl: template.prompt_img, // 将模板图片设为初始图
      status: 'idle',
      color: 'bg-blue-400'
    };

    setNodes(prev => [...prev, newNode]);
    setShowPromptPanel(false); // 选择后自动关闭面板
  };
  // --- 交互处理 ---

  const handleNodeMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
    if ((e.target as HTMLElement).closest('textarea') || (e.target as HTMLElement).closest('button.preview-btn')) return;
    e.stopPropagation(); // 阻止冒泡到画布
    
    // 处理多选逻辑
    if (!selectedNodeIds.has(node.id)) {
        toggleNodeSelection(node.id, e);
    }
    
    if (e.button !== 0) return; // 仅左键

    const pos = screenToCanvas(e.clientX, e.clientY);
    setDraggingNodeId(node.id);
    // 计算点击点相对于节点左上角的偏移
    setOffset({ x: pos.x - node.x, y: pos.y - node.y });
    setSelectedConnectionId(null);
  };

  const startLinking = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setLinkingFromId(nodeId);
    const pos = screenToCanvas(e.clientX, e.clientY);
    setMousePos(pos);
    setSelectedConnectionId(null);
  };

  const completeLinking = (targetNodeId: string) => {
    if (linkingFromId && linkingFromId !== targetNodeId) {
      // 避免重复连线
      const exists = connections.some(c => c.from === linkingFromId && c.to === targetNodeId);
      if (!exists) {
        setConnections(prev => [...prev, { 
          id: `${linkingFromId}-${targetNodeId}-${Date.now()}`, 
          from: linkingFromId, 
          to: targetNodeId 
        }]);
      }
    }
    setLinkingFromId(null);
    setSnapTargetId(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    const pos = screenToCanvas(e.clientX, e.clientY); // 画布坐标
    
    if (draggingNodeId) {
      // 移动所有选中的节点
      if (selectedNodeIds.has(draggingNodeId)) {
        setNodes(nds => nds.map(n => {
          if (selectedNodeIds.has(n.id)) {
             // 简单的相对移动逻辑（这里简化处理，严谨做法是计算 delta）
             // 当前实现仅针对单个 draggingNode 准确，多选拖拽若要保持相对位置需要计算 delta
             if(n.id === draggingNodeId) {
                 return { ...n, x: pos.x - offset.x, y: pos.y - offset.y };
             } else {
                 // 多选拖拽的暂简略处理：
                 // 实际应用中，应记录MouseDown时的所有选中节点初始位置，然后统一加 delta
                 return n; 
             }
          }
          return n;
        }));
        // 修复：目前仅完美支持单点拖拽，多选拖拽逻辑较复杂，此处保留单点逻辑确保不跳变
        setNodes(nds => nds.map(n => 
            n.id === draggingNodeId ? { ...n, x: pos.x - offset.x, y: pos.y - offset.y } : n
        ));
      }
    } 
    else if (isCanvasDragging) {
      // 画布平移：使用屏幕坐标差值
      setCanvasTransform({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
    else if (linkingFromId) {
      setMousePos(pos);
      // 吸附逻辑
      let foundSnap: string | null = null;
      for (const node of nodes) {
        if (node.id === linkingFromId) continue;
        // 简单的距离检测：假设输入点在节点左侧
        // 优化：根据节点类型判断输入输出端口位置
        const dist = Math.hypot(pos.x - node.x, pos.y - (node.y + 35));
        if (dist < 50) {
          foundSnap = node.id;
          break;
        }
      }
      setSnapTargetId(foundSnap);
    } 
    else if (selectionBox) {
      // 更新框选区域
      setSelectionBox(prev => prev ? { ...prev, currentX: pos.x, currentY: pos.y } : null);
      
      const x1 = Math.min(selectionBox.startX, pos.x);
      const y1 = Math.min(selectionBox.startY, pos.y);
      const x2 = Math.max(selectionBox.startX, pos.x);
      const y2 = Math.max(selectionBox.startY, pos.y);

      const inBox = nodes.filter(n => 
        n.x + 100 > x1 && n.x < x2 && n.y + 100 > y1 && n.y < y2 // 简单的AABB碰撞
      ).map(n => n.id);
      setSelectedNodeIds(new Set(inBox));
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // 1. 处理拖线松开：如果没有吸附目标，打开菜单
    if (linkingFromId && !snapTargetId) {
      console.log("show contextmenu");
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setMenuConfig({
        uiX: e.clientX,       // 菜单 UI 使用屏幕坐标
        uiY: e.clientY,
        canvasX: canvasPos.x, // 节点创建使用画布坐标
        canvasY: canvasPos.y,
        fromNodeId: linkingFromId // 传递来源节点ID，用于自动连线
      });
      console.log("over");
      setLinkingFromId(null); // 暂停连线状态，但在菜单回调中处理连接
      return;
    }

    // 2. 处理拖线松开：有吸附目标，完成连线
    if (linkingFromId && snapTargetId) {
      completeLinking(snapTargetId);
    } 
    // 3. 右键点击
    else if (e.button === 2) {
      handleContextMenu(e);
    }

    // 重置状态
    setSelectionBox(null);
    setLinkingFromId(null);
    setSnapTargetId(null);
    setDraggingNodeId(null);
    setIsCanvasDragging(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // if (menuConfig) setMenuConfig(null);
    canvasRef.current?.focus();
    // 只有直接点击画布（非节点）时触发
    
    // 清空选择
    if (!(e.shiftKey || e.metaKey || e.ctrlKey)) {
      setSelectedNodeIds(new Set());
    }

    const pos = screenToCanvas(e.clientX, e.clientY);

    // 中键 或 Alt+左键 -> 平移
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsCanvasDragging(true);
      setOffset({ x: e.clientX - canvasTransform.x, y: e.clientY - canvasTransform.y });
    } 
    // 左键 -> 框选
    else if (e.button === 0) {
      setSelectionBox({ startX: pos.x, startY: pos.y, currentX: pos.x, currentY: pos.y });
    }
  };

  const zoomReset = () => { setScale(1); setCanvasTransform({x:0, y:0}); };

  // --- 节点操作 ---
const addNodeAtPos = (
  type: NodeType,
  canvasX: number,
  canvasY: number,
  extra = {},
  sourceNodeId?: string,
  inputType?: string,
  selfId?: string
) => {
  const newNodeId = selfId || generateId();

  const newNode: WorkflowNode = {
    id: newNodeId,
    type,
    x: canvasX,
    y: canvasY,
    mode: inputType || "notype",
    status: 'idle',
    ...extra
  };

  // ✅ 用函数式更新 nodes
  setNodes(prevNodes => {
    const nextNodes = [...prevNodes, newNode];

    // ⚠️ 注意：history 不能再用外部 nodes
    setConnections(prevConnections => {
      let nextConnections = [...prevConnections];

      if (sourceNodeId) {
        nextConnections.push({
          id: `${sourceNodeId}-${newNodeId}-${Date.now()}`,
          from: sourceNodeId,
          to: newNodeId,
        });
      }

      // ✅ 在“最终态”里存 history
      saveHistory({
        nodes: nextNodes,
        connections: nextConnections
      });

      return nextConnections;
    });

    return nextNodes;
  });

  setMenuConfig(null);
};

  // const addNodeAtPos = (type: NodeType, canvasX: number, canvasY: number, extra = {}, sourceNodeId?: string, inputType?:string) => {
  //   const newNodeId = `${type.toLowerCase()}_${Date.now()}`;
  //   const newNode: WorkflowNode = {
  //     id: newNodeId,
  //     type,
  //     x: canvasX, 
  //     y: canvasY,
  //     mode: inputType || "notype",
  //     status: 'idle',
  //     ...extra
  //   };

  //   setNodes(nds => [...nds, newNode]);
    
  //   // ✨ 自动连线逻辑
  // if (sourceNodeId) {
  //   const newConnection: Connection = {
  //     id: `${sourceNodeId}-${newNodeId}-${Date.now()}`,
  //     from: sourceNodeId,
  //     to: newNodeId,
  //   };

  //   setConnections(prev => [...prev, newConnection]);
  // }

  //   setMenuConfig(null);
    
  // };
  
  const toggleNodeSelection = (id: string, e: React.MouseEvent) => {
    const newSelected = new Set(selectedNodeIds);
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
    } else {
      newSelected.clear();
      newSelected.add(id);
    }
    setSelectedNodeIds(newSelected);
  };

  const removeConnection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConnections(prev => prev.filter(c => c.id !== id));
    setSelectedConnectionId(null);
  };

  // --- 文件处理 ---

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const pos = screenToCanvas(e.clientX, e.clientY);
      const reader = new FileReader();
      reader.onload = (event) => {
        const newNode: WorkflowNode = {
          id: 'IMAGE-'+ Date.now(),
          type: 'IMAGE',
          x: pos.x - 120,
          y: pos.y - 120,
          label: files[0].name,
          status: 'idle',
          imageUrl: event.target?.result as string
        };
        setNodes(nds => [...nds, newNode]);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setMenuConfig({ 
        uiX: e.clientX, 
        uiY: e.clientY,
        canvasX: canvasPos.x,
        canvasY: canvasPos.y
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
      console.log("wenjian")
      const reader = new FileReader();
      // 闭包捕获当前所需位置
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const pos = screenToCanvas(centerX, centerY);
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {

          const newNode: WorkflowNode = {
            id: 'IMAGE-'+ Date.now(),
            type: 'IMAGE',
            x: pos.x - 120,
            y: pos.y - 120,
            label: file.name,
            status: 'idle',
            imageUrl: event.target?.result as string
          };
          setNodes(nds => [...nds, newNode]);
          // addNodeAtPos('IMAGE', canvasX, canvasY, { imageUrl: result }, fromNodeId);
        }
        // 重置 input
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
    setMenuConfig(null);
  };

  // 一键聚焦
  const handleFitView = () => {
    if (nodes.length === 0) return;
  
    // 1. 计算所有节点的边界 (Bounding Box)
    const padding = 50; // 聚焦后的留白
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
    nodes.forEach(node => {
      // 假设 node.x 和 node.y 是左上角，这里简单估算宽度 240, 高度随图片比例
      // 你也可以根据节点类型精确计算
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + 240); 
      maxY = Math.max(maxY, node.y + 300); 
    });
  
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
  
    // 2. 获取画布容器的尺寸
    const viewportWidth = window.innerWidth; 
    const viewportHeight = window.innerHeight;
  
    // 3. 计算缩放比例 (Scale)
    // 确保所有节点都能装进屏幕，取宽比和高比的最小值
    const scaleX = (viewportWidth - padding * 2) / contentWidth;
    const scaleY = (viewportHeight - padding * 2) / contentHeight;
    const nextScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.2), 1.5); // 限制在 0.2 ~ 1.5 之间
  
    // 4. 计算偏移量 (Translate) 使其居中
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
  
    const nextX = viewportWidth / 2 - centerX * nextScale;
    const nextY = viewportHeight / 2 - centerY * nextScale;
  
    // 5. 更新画布状态 (假设你使用 setTransform 存储状态)
    setCanvasTransform({ x: nextX, y: nextY});
    setScale(nextScale)
  };


  // 贝塞尔曲线生成
  const getBezierPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const dist = Math.abs(x2 - x1);
    const cpOffset = Math.min(dist * 0.5, 150);
    // 假设输出在右(x1)，输入在左(x2)
    return `M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`;
  };

// 上传
// 导入函数JSON

// 辅助函数：根据类型还原图标（保持与你 UI 定义的一致）
const getIconByType = (type: NodeType) => {
  switch (type) {
    case 'Subject': return <Layers size={12} />;
    case 'Input': return <ImageIcon size={12} />;
    case 'IMAGE': return <ImageIcon size={12} />;
    default: return null;
  }
};

// 导入
const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const data = JSON.parse(content);

      if (data.nodes && data.edges) {
        const idMap: Record<string, string> = {};

        // 1. 处理节点：生成新 ID 并还原图标
        const restoredNodes = data.nodes.map((n: any) => {
          const newId = `node_${Math.random().toString(36).substr(2, 9)}`;
          idMap[n.id] = newId;
          return { ...n, id: newId, icon: getIconByType(n.type) };
        });

        // 2. 处理连线：生成新 ID 并修正 from/to 引用
        const restoredConnections = data.edges.map((e: any) => ({
          // 修复 "unique key prop" 错误的核心：分配新 ID
          id: e.id || `conn_${Math.random().toString(36).substr(2, 9)}`,
          from: idMap[e.from] || e.from,
          to: idMap[e.to] || e.to,
          label: e.label || ""
        }));

        // 3. 覆盖或追加到画布
        setNodes(restoredNodes);
        setConnections(restoredConnections);
      }
    } catch (error) {
      alert("导入失败：文件格式不正确");
    }
  };
  reader.readAsText(file);
};


// 下载
  const handleExport = () => {
    try {
      const workflow = {
        // 剔除 React 组件等不可序列化的属性
        nodes: nodes.map(({ icon, ...n }) => ({
          ...n,
          // 确保导出的是纯数据
          parameters: n.parameters || {},
          prompt: n.prompt || "",
        })),
        edges: connections.map(c => ({
          id: c.id,
          from: c.from,
          to: c.to,
          label: c.label || ""
        })),
        metadata: {
          version: "1.0.0",
          exportTime: new Date().toISOString(),
        }
      };
  
      const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${headerTitle}_${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: '导出成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '导出失败，请重试' });
      console.error("Failed to export workflow:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FFF9E6] overflow-hidden select-none font-mono text-slate-900">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      
      {/* 顶部导航 */}
      <Header 
        headerTitle={headerTitle} 
        setHeaderTitle={setHeaderTitle} 
        selectedNodeIds={selectedNodeIds} 
        onRedo={handleRedo}
        onUndo={handleUndo}
        canRedo={canRedo}
        canUndo={canUndo}
        credits={100} />
        <input
      type="file"
      id="import-workflow"
      className="hidden"
      accept=".json"
      onChange={importWorkflow}
    />
      {/* 左侧工具栏 */}
      <Sidebar
        onAddNode={(type) => addNodeAtPos(type, 0, 0)}
        setMenuConfig={setMenuConfig}
        showPromptPanel={showPromptPanel}
        setShowPromptPanel={setShowPromptPanel}
        onDownloadWorkspace={() => handleExport()}
        onShowHistory={() => console.log("Open History")}
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" // 示例头像
      />
      
      {showPromptPanel && (
        <PromptTemplatePanel 
          allPrompts={allPrompts} 
          onSelect={handleTemplateSelect}
          onClose={() => setShowPromptPanel(false)}
        />
      )}
      {/* 主画布区域 */}
      <main 
        ref={canvasRef}
        tabIndex={0} 
        className="flex-1 relative overflow-hidden bg-slate-50"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
        onDrop={handleDrop}
        onContextMenu={handleContextMenu}
        // onClick={()=>{setMenuConfig(null)}}
      >
        {/* 网格 */}
        <div className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            backgroundPosition: `${canvasTransform.x}px ${canvasTransform.y}px`
          }} 
        />

        {/* 变换层：包含所有节点和连线 */}
        <div 
          style={{ 
            transform: `translate(${canvasTransform.x}px, ${canvasTransform.y}px) scale(${scale})`, 
            transformOrigin: '0 0',
            // 拖拽时禁用过渡以提高性能
            transition: 'none'
          }} 
          
          className="absolute inset-0 w-full h-full z-10"
        >
          
          {/* 连线层 (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
             <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
             </defs>
            {connections.map((conn) => {
              const from = nodes.find(n => n.id === conn.from);
              const to = nodes.find(n => n.id === conn.to);
              if (!from || !to) return null;
              
              const isSelected = selectedConnectionId === conn.id;
              
              return (
                <g key={conn.id} className="pointer-events-auto cursor-pointer group">
                  {/* 粗透明线用于增大点击区域 */}
                  <path 
                    d={getBezierPath(from.x + 180, from.y + 35, to.x, to.y + 35)}
                    stroke="transparent" strokeWidth="20" fill="none"
                    onClick={(e) => { e.stopPropagation(); setSelectedConnectionId(conn.id); }}
                  />
                  {/* 实际显示的线 */}
                  <path 
                    d={getBezierPath(from.x + 180, from.y + 35, to.x, to.y + 35)}
                    stroke={isSelected ? "#3b82f6" : "#94a3b8"}
                    strokeWidth={isSelected ? "3" : "2"}
                    fill="none"
                    className="transition-colors"
                  />
                  {/* 删除按钮 (选中时显示) */}
                  {isSelected && (
                    <foreignObject 
                      x={(from.x + 180 + to.x) / 2 - 12} 
                      y={(from.y + 35 + to.y + 35) / 2 - 12} 
                      width="24" height="24"
                    >
                      <button 
                        onMouseDown={(e) => removeConnection(e, conn.id)}
                        className="w-6 h-6 bg-white border border-red-200 text-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                      >
                        <X size={14} />
                      </button>
                    </foreignObject>
                  )}
                </g>
              );
            })}

            {/* 正在拖拽的连接线 (虚线) */}
            {linkingFromId && (
              <path 
                d={getBezierPath(
                  nodes.find(n => n.id === linkingFromId)!.x + 180, 
                  nodes.find(n => n.id === linkingFromId)!.y + 35, 
                  snapTargetId ? nodes.find(n => n.id === snapTargetId)!.x : mousePos.x, 
                  snapTargetId ? nodes.find(n => n.id === snapTargetId)!.y + 35 : mousePos.y
                )}
                stroke={snapTargetId ? "#3b82f6" : "#cbd5e1"}
                strokeWidth="2"
                strokeDasharray="6,4"
                fill="none"
                className="pointer-events-none"
              />
            )}
          </svg>

          {/* 节点层 */}
          {nodes.map(node => (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              style={{ 
                left: node.x, 
                top: node.y, 
                zIndex: draggingNodeId === node.id ? 50 : 10,
              }}
              className={`absolute cursor-pointer transition-shadow duration-200 ${
                selectedNodeIds.has(node.id) ? 'ring-2 ring-indigo-500 shadow-xl' : 'shadow-md'
              }`}
            >
              {/* 根据类型渲染组件 */}
              {/* {node.type === "Pet" && (
                  <PetNode 
                    node={node}
                    draggingNodeId={draggingNodeId}
                    lifeStage={lifeStage}
                    petSpecies={petSpecies}
                    crackLevel={crackLevel}
                    petEmotion={petEmotion}
                    setCrackLevel={setCrackLevel}
                    setPetSpecies={setPetSpecies}
                    setPetEmotion={setPetEmotion}
                    setLifeStage={setLifeStage}
                    startLinking={startLinking}
                    onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  />
              )} */}
              {node.type === "Subject" && (
                <SubjectNode 
                  key={node.id} 
                  node={node}
                  draggingNodeId={draggingNodeId}
                  snapTargetId={snapTargetId}
                  linkingFromId={linkingFromId}
                  nodes={nodes}
                  setShowKeyModal={setShowKeyModal}
                  onPreview={(url) => setPreviewImage(url)}
                  setNodes={setNodes}
                  startLinking={startLinking}
                  connections={connections}
                  onAddNode={(type,x, y,data, sourceId,selfId) => addNodeAtPos(type, x, y, data, sourceId,selfId)}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                />
              )}
              {node.type === 'IMAGE' && (<ImageNode 
                key={node.id} 
                node={node}
                draggingNodeId={draggingNodeId}
                snapTargetId={snapTargetId}
                linkingFromId={linkingFromId}
                onPreview={(url) => setPreviewImage(url)}
                startLinking={startLinking}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                />)}
              {node.type === 'Input' && (
              <PromptNode 
                key={node.id} 
                node={node}
                nodes={nodes}
                setShowKeyModal={setShowKeyModal}
                draggingNodeId={draggingNodeId}
                connections={connections}
                snapTargetId={snapTargetId}
                linkingFromId={linkingFromId}
                // ✨ 核心修改：实时过滤属于当前节点的图片
                combinedImgUrls={connections
                  .filter(c => c.to === node.id) // 只找连向当前这个 Input 节点的线
                  .map(c => nodes.find(n => n.id === c.from)) // 找到线另一端的节点
                  .filter(sourceNode => sourceNode?.type === 'IMAGE' && sourceNode.imageUrl) // 过滤：必须是 IMAGE 类型且有图
                  .map(sourceNode => sourceNode!.imageUrl!) // 提取 url
                }
                setNodes={setNodes}
                onAddNode={(type, x, y, data, sourceId) => addNodeAtPos(type, x, y, data, sourceId)}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                startLinking={startLinking}
              />
            )}
              {/* 兜底渲染 */}
              {['Background','Style','MasterGenerator'].includes(node.type) && (
                 <div className={`w-40 h-20 rounded-lg flex items-center justify-center ${node.color} text-white`}>
                    {node.icon} <span className="ml-2">{node.label}</span>
                     <div 
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-crosshair hover:scale-125 transition-transform"
                        onMouseDown={(e) => startLinking(e, node.id)}
                     />
                 </div>
              )}
            </div>
          ))}

          {/* 框选矩形 */}
          {selectionBox && (
            <div 
              className="absolute border border-indigo-500 bg-indigo-500/10 pointer-events-none z-50 rounded-sm"
              style={{
                left: Math.min(selectionBox.startX, selectionBox.currentX),
                top: Math.min(selectionBox.startY, selectionBox.currentY),
                width: Math.abs(selectionBox.currentX - selectionBox.startX),
                height: Math.abs(selectionBox.currentY - selectionBox.startY)
              }}
            />
          )}
        </div>

        {/* 右下角控制区 */}
        <WorkspaceBottom scale={scale} setScale={setScale} zoomReset={zoomReset} handleFitView={handleFitView} />

        {/* 右键/添加菜单 */}
        {menuConfig && (
            <ContextMenu 
            x={menuConfig.uiX} 
            y={menuConfig.uiY} 
            showPromptPanel={showPromptPanel}
            setShowPromptPanel={setShowPromptPanel}
            onUpload={() => fileInputRef.current?.click()}
            onAddNode={(type: NodeType,inputType: string) => addNodeAtPos(type, menuConfig.canvasX, menuConfig.canvasY, {}, menuConfig.fromNodeId, inputType)}
            onClose={() => setMenuConfig(null)}
            />
        )}
      </main>

      {/* 消息 Toast */}
        {message.text && (
          <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg flex items-center gap-3 shadow-lg animate-in slide-in-from-right duration-300 ${message.type === 'success' ? 'bg-white text-emerald-700 border-l-4 border-emerald-500' : 'bg-white text-rose-700 border-l-4 border-rose-500'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}
      {/* 全屏预览 */}
          {previewImage && (
      <div
        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-8"
        onClick={() => setPreviewImage(null)}
      >
        {isVideoUrl(previewImage) ? (
          <video
            src={previewImage}
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain bg-black"
          />
        ) : (
          <img
            src={previewImage}
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            alt="full preview"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    )}

    {/* 弹窗 */}
          {/* 底部弹窗 */}
          <KeyInputModal
            open={showKeyModal}
            onClose={() => setShowKeyModal(false)}
            onUseCredits={() => {
              localStorage.removeItem("fal_api_key")
              localStorage.setItem("fal_mode", "credits")
            }}
            onUseUserKey={(key) => {
              localStorage.setItem("fal_api_key", key)
              localStorage.setItem("fal_mode", "user-" + generateId())
            }}
          />

    </div>
  );
};

export default App;