
// 能够动态输入imgUrl，并自动展示到输入节点中，在点击生成时，能够自动引入节点并生成文件。引用上限和预估积分值。
  // 动态计算主节点的合成提示词
  // useEffect(() => {
  //   const masterNode = nodes.find(n => n.type === 'MasterGenerator');
  //   if (masterNode) {
  //     const inputPrompts = connections
  //       .filter(c => c.to === masterNode.id)
  //       .map(c => nodes.find(n => n.id === c.from)?.prompt)
  //       .filter(Boolean);
      
  //     const combined = inputPrompts.length > 0 ? inputPrompts.join(', ') : '等待连接提示词节点...';
  //     if (masterNode.prompt !== combined) {
  //       setNodes(nds => nds.map(n => n.id === masterNode.id ? { ...n, prompt: combined } : n));
  //     }
  //   }
  // }, [connections, nodes]);
{/* 删除节点按钮 */}
{/* <button 
    onClick={(e) => { 
    e.stopPropagation(); 
    setNodes(prev => prev.filter(n => n.id !== node.id)); 
    setConnections(prev => prev.filter(c => c.from !== node.id && c.to !== node.id)); 
    }}
    className="absolute -top-2 -right-2 bg-white text-slate-400 p-1 rounded-full border border-slate-100 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-100 transition-all shadow-sm z-30"
>
    <Trash2 size={12} />
</button> */}

  // --- 模拟运行项目 ---
//   const runProject = () => {
//     // 自动寻找 startNode: 在所有连接中，没有作为 "to" 出现的节点即为起点
//     const targetNodeIds = new Set(connections.map(c => c.to));
//     const potentialStartNodes = nodes.filter(n => !targetNodeIds.has(n.id));
//      // 如果找到了没有入度的节点，取第一个；否则取 nodes 数组第一个
//      const startNodeId = potentialStartNodes.length > 0 ? potentialStartNodes[0].id : (nodes[0]?.id || null);
//     // 构建导出结构
//     const workflow = {
//         startNode: startNodeId,
//         nodes: nodes.map(n => ({
//           id: n.id,
//           type: n.type,
//           parameters: n.parameters || {}
//         })),
//         edges: connections.map(c => ({
//           from: c.from,
//           to: c.to,
//           label: c.label
//         }))
//       };

//     console.log("🚀 开始运行工作流...");
//     console.log("📦 数据结构预览:", JSON.stringify(workflow, null, 2));

//     runWorkflow(workflow);
    
//     // 模拟简易执行
//     let currentNodeId = workflow.startNode;
//     let step = 1;

//     const executeStep = () => {
//       if (!currentNodeId) {
//         console.log("🏁 工作流结束。");
//         return;
//       }
//       const node = nodes.find(n => n.id === currentNodeId);
//       if (!node) return;

//       console.log(`[Step ${step++}] 执行节点: ${node.label} (${node.type})`);
      
//       // 寻找下一个连接
//       const nextEdge = connections.find(c => c.from === currentNodeId);
//       if (nextEdge) {
//         currentNodeId = nextEdge.to;
//         setTimeout(executeStep, 500);
//       } else {
//         console.log("🏁 未找到后续节点，运行完成。");
//       }
//     };

//     executeStep();
//   };



<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
<path d="M12 19V5M5 12l7-7 7 7"/>
</svg>
