// ============================
// 类型定义
// ============================
type AgentState = 'Idle' | 'Running' | 'Waiting' | 'Done' | 'Error';

interface AgentContext {
  lastResult?: any;
  errorCount: number;
  history: { task: string; state: AgentState }[];
  dependenciesStates?: Record<string, AgentState>;
}

interface Agent {
  id: string;
  name: string;
  state: AgentState;
  animationState?: 'Idle' | 'Action' | 'Wait' | 'Success' | 'Fail';
  frameIndex?: number; // 当前动画帧
  currentTask?: string;
  dependencies?: string[]; // agent id
  context: AgentContext;
}

// ============================
// Agent 初始化
// ============================
const agents: Agent[] = [
  {
    id: '1',
    name: 'Scout',
    state: 'Idle',
    currentTask: 'Search Information',
    context: { errorCount: 0, history: [], dependenciesStates: {} },
  },
  {
    id: '2',
    name: 'Analyst',
    state: 'Idle',
    currentTask: 'Analyze Data',
    dependencies: ['1'],
    context: { errorCount: 0, history: [], dependenciesStates: {} },
  },
  {
    id: '3',
    name: 'Executor',
    state: 'Idle',
    currentTask: 'Execute Task',
    dependencies: ['2'],
    context: { errorCount: 0, history: [], dependenciesStates: {} },
  },
];

// Agent 动画
function syncAnimation(agent: Agent) {
    switch (agent.state) {
      case 'Idle':
        agent.animationState = 'Idle';
        break;
      case 'Running':
        agent.animationState = 'Action';
        break;
      case 'Waiting':
        agent.animationState = 'Wait';
        break;
      case 'Done':
        agent.animationState = 'Success';
        break;
      case 'Error':
        agent.animationState = 'Fail';
        break;
    }
  }
  

// ============================
// 状态机注册表
// ============================
const agentStateRules: Record<
  AgentState,
  (agent: Agent, context: { agents: Agent[] }) => void
> = {
  Idle: (agent, ctx) => {
    // 检查依赖是否完成
    const blocked = agent.dependencies?.some((depId) => {
      const depAgent = ctx.agents.find((a) => a.id === depId);
      return depAgent?.state !== 'Done';
    });
    if (!blocked) {
      agent.state = 'Running';
      agent.context.history.push({ task: agent.currentTask || '', state: 'Running' });
      console.log(`${agent.name} → Running`);
      updateAgentState(agent, ctx); // 立即触发
    } else {
      agent.state = 'Waiting';
      agent.context.history.push({ task: agent.currentTask || '', state: 'Waiting' });
      console.log(`${agent.name} → Waiting (waiting for dependencies)`);
    }
  },

  Running: (agent, ctx) => {
    console.log(`${agent.name} is running task: ${agent.currentTask}`);
    // 模拟任务执行
    setTimeout(() => {
      const success = Math.random() < 0.9; // 90% 成功率
      agent.state = success ? 'Done' : 'Error';
      agent.context.history.push({ task: agent.currentTask || '', state: agent.state });
      agent.context.lastResult = success ? `Result of ${agent.currentTask}` : null;
      agent.context.errorCount += success ? 0 : 1;
      console.log(
        `${agent.name} → ${agent.state} ${
          agent.state === 'Done' ? '' : '(retry allowed)'
        }`
      );

      // 更新全局依赖上下文
      ctx.agents.forEach((a) => {
        a.context.dependenciesStates = {};
        a.dependencies?.forEach((depId) => {
          const dep = ctx.agents.find((x) => x.id === depId);
          if (dep) a.context.dependenciesStates![depId] = dep.state;
        });
      });

      // 尝试触发其他 Waiting 的 agent
      runAgentFlow(ctx.agents);
    }, 1000 + Math.random() * 2000);
  },

  Waiting: (agent, ctx) => {
    const stillBlocked = agent.dependencies?.some((depId) => {
      const depAgent = ctx.agents.find((a) => a.id === depId);
      return depAgent?.state !== 'Done';
    });
    if (!stillBlocked) {
      agent.state = 'Running';
      agent.context.history.push({ task: agent.currentTask || '', state: 'Running' });
      console.log(`${agent.name} → Running (dependencies cleared)`);
      updateAgentState(agent, ctx); // 立即执行
    }
  },

  Done: (agent, ctx) => {
    // 完成状态，不做任何动作
    console.log(`${agent.name} has completed its task.`);
  },

  Error: (agent, ctx) => {
    // 简单重试机制
    if (agent.context.errorCount < 3) {
      console.log(`${agent.name} will retry task: ${agent.currentTask}`);
      agent.state = 'Idle';
      updateAgentState(agent, ctx);
    } else {
      console.log(`${agent.name} failed after 3 retries.`);
    }
  },
};

// ============================
// 状态机执行函数
// ============================
function updateAgentState(agent: Agent, context: { agents: Agent[] }) {
  const handler = agentStateRules[agent.state];
  if (handler) handler(agent, context);
}

// ============================
// 调度器函数
// ============================
function runAgentFlow(agentList: Agent[]) {
  agentList.forEach((agent) => {
    if (agent.state === 'Idle' || agent.state === 'Waiting') {
      updateAgentState(agent, { agents: agentList });
    }
  });
}

// ============================
// 启动流程
// ============================
// console.log('=== Starting Agent Flow ===');
// runAgentFlow(agents);
