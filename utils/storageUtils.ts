import { WorkflowNode, Connection } from '@/lib/types/nodeType'; // 替换为你的类型定义路径
import { ReactNode } from 'react';

const WORKFLOW_STORAGE_KEY = 'workflow_local_data';

// 假设你有一个根据 NodeType 获取对应 Icon 的辅助函数
// 因为从 localStorage 读取出来的数据是没有 icon 的，需要重新映射
const getIconForNodeType = (type: string): ReactNode | undefined => {
  // TODO: 返回你对应的 React 组件，例如：
  // if (type === 'Subject') return <SubjectIcon />;
  // return undefined;
  return undefined; 
};

export const WorkflowStorage = {
  /**
   * 将工作流保存到 LocalStorage
   */
  save: (nodes: WorkflowNode[], connections: Connection[]) => {
    try {
      const workflow = {
        // 剔除 React 组件等不可序列化的属性
        nodes: nodes.map(({ icon, ...n }) => ({
          ...n,
          parameters: n.parameters || {},
          prompt: n.prompt || "",
        })),
        // 注意这里我帮你补全了 c.id，否则加载时会丢失唯一标识
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

      const serializedData = JSON.stringify(workflow);
      localStorage.setItem(WORKFLOW_STORAGE_KEY, serializedData);
      
      console.log('工作流已成功保存到本地');
      return true;
    } catch (error) {
      console.error('保存工作流失败，可能是超出了 LocalStorage 容量限制:', error);
      return false;
    }
  },

  /**
   * 从 LocalStorage 加载工作流
   */
  load: (): { nodes: WorkflowNode[], connections: Connection[] } | null => {
    try {
      const serializedData = localStorage.getItem(WORKFLOW_STORAGE_KEY);
      if (!serializedData) {
        return null; // 没有本地数据
      }

      const parsedData = JSON.parse(serializedData);

      // 重新组装 Nodes，并恢复被剔除的 icon
      const loadedNodes: WorkflowNode[] = parsedData.nodes.map((n: any) => ({
        ...n,
        // 根据 type 重新生成并挂载 icon 组件
        icon: getIconForNodeType(n.type),
      }));

      // 重新组装 Connections
      const loadedConnections: Connection[] = parsedData.edges.map((e: any) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        label: e.label || ""
      }));

      return {
        nodes: loadedNodes,
        connections: loadedConnections
      };
    } catch (error) {
      console.error('加载工作流数据失败，数据可能已损坏:', error);
      return null;
    }
  },

  /**
   * 清除本地存储的数据
   */
  clear: () => {
    localStorage.removeItem(WORKFLOW_STORAGE_KEY);
  }
};