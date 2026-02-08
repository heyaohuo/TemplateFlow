
export const NodeRegistry = {
    // 用户输入节点
    Trigger: (params:any, context:any) => {
       console.log("Node message: ", params.message);
        //return { queryUserId: "123", category: "VIP" };
    },
  
    // HTTP 请求节点：现在它从 Context 读取 UserInput 的结果
    HttpRequest: (params:any, context:any) => {
        console.log("Node message: ", params.message);
      // 从上下文获取 ID
    //   const userId = context["user_start"].queryUserId; 
    //   console.log(`[HTTP] 正在请求用户数据，ID: ${userId}...`);
      
    //   // 模拟 API 返回
    //   return { 
    //     name: "张三", 
    //     score: 85, 
    //     lastLogin: "2023-10-01" 
    //   };
    },
  
    // 逻辑判断节点：读取 HttpRequest 的结果
    Condition: (params:any, context:any) => {
        console.log("Node message: ", params.message);
    //   const score = context["get_user_info"].score;
    //   console.log(`[Condition] 检查分数: ${score}`);
    //   return score >= 60 ? "pass" : "fail";
    },
  
    // 汇总输出节点：把前面所有信息整合在一起
    Output: (params:any, context:any) => {
        console.log("Node message: ", params.message);
    //   const user = context["get_user_info"];
    //   const input = context["user_start"];
    //   // 整合所有节点的记忆
    //   const report = `用户 ${user.name} (分类: ${input.category}) 考试${user.score >= 60 ? '通过' : '未通过'}`;
    //   console.log(`[Report] >>> ${report}`);
    //   return { report };
    },

    Log: (params:any, context:any) => {
        console.log("Node message: ", params.message);
    },

    //
    Action : (params:any, context:any) => {
        console.log("Node message: ", params.message);
    },
  };


export function runWorkflow(wf:any) {
    const context = {}; // 唯一的共享黑板
    let currentNodeId = wf.startNode;
  
    while (currentNodeId) {
      const node = wf.nodes.find(n => n.id === currentNodeId);
      
      // 每一个节点执行时，都把全局 context 传进去
      // 1. 获取该节点对应的处理函数
      const handler = NodeRegistry[node.type];
  
      // 2. 执行函数并传入配置参数
      const result = handler(node.parameters, context);
      
      // 存入黑板
      context[node.id] = result;
  
      // 下一步寻路
      const outgoingEdges = wf.edges.filter(e => e.from === currentNodeId);
      if (node.type === "Condition") {
        const edge = outgoingEdges.find(e => e.label === result);
        currentNodeId = edge ? edge.to : null;
      } else {
        currentNodeId = outgoingEdges.length > 0 ? outgoingEdges[0].to : null;
      }
    }
    console.log("执行结束。");
  }