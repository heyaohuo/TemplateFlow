// ==========================================
// 1. 基础类型定义 (Interfaces & Types)
// ==========================================

// Flux 使用 image_size
export interface FluxValue {
  image_size: string;
}

// 其他模型使用 aspect_ratio
export interface AspectRatioValue {
  aspect_ratio: string;
}

// 联合类型：返回值可能是其中之一
export type AnyRatioValue = FluxValue | AspectRatioValue;

// 列表项的通用结构
export interface RatioOption<T = AnyRatioValue> {
  label: string;
  value: T;
}

// ==========================================
// 2. 比例数据源 (Ratio Sources)
// ==========================================

export const flux_ratio: RatioOption<FluxValue>[] = [
  { label: '1:1', value: { image_size: "square_hd" } },
  { label: '9:16', value: { image_size: "portrait_16_9" } },
  { label: '16:9', value: { image_size: "landscape_16_9" } },
];

export const banana_ratio: RatioOption<AspectRatioValue>[] = [
  { label: '1:1', value: { aspect_ratio: "1:1" } },
  { label: '9:16', value: { aspect_ratio: "9:16" } },
  { label: '16:9', value: { aspect_ratio: "16:9" } },
];

export const veo_ratio: RatioOption<AspectRatioValue>[] = [
  { label: '1:1', value: { aspect_ratio: "1:1" } },
  { label: '9:16', value: { aspect_ratio: "9:16" } },
  { label: '16:9', value: { aspect_ratio: "16:9" } },
  { label: 'auto', value: { aspect_ratio: "auto" } },
];

export const seedance_ratio: RatioOption<AspectRatioValue>[] = [
  { label: '1:1', value: { aspect_ratio: "1:1" } },
  { label: '9:16', value: { aspect_ratio: "9:16" } },
  { label: '16:9', value: { aspect_ratio: "16:9" } },
  { label: 'auto', value: { aspect_ratio: "auto" } },
];

// ==========================================
// 3. 模型列表 (Models List)
// 使用 as const 锁定字面量类型，以便提取 modle_id
// ==========================================

export const image_modles = [
    // Banana Pro
    { modle_id: "fal-ai/nano-banana-pro", name: "Banana Pro", type: "T2I" },
    { modle_id: "fal-ai/nano-banana-pro/edit", name: "Banana Pro", type: "I2I" },

    // Nano Banana
    { modle_id: "fal-ai/nano-banana/edit", name: "Nano Banana", type: "I2I" },
    { modle_id: "fal-ai/nano-banana", name: "Nano Banana", type: "T2I" },

    // Flux 2 Pro
    { modle_id: "fal-ai/flux-2-pro/edit", name: "Flux 2 Pro", type: "I2I" },
    { modle_id: "fal-ai/flux-2-pro", name: "Flux 2 Pro", type: "T2I" },
] as const;

export const video_modles = [
    // Veo
    { modle_id: "fal-ai/veo2/image-to-video", name: "🎬 Veo 2", type: "I2V" },
    { modle_id: "fal-ai/veo3/image-to-video", name: "🎬 Veo 3", type: "I2V" },

    // Seedance
    { modle_id: "fal-ai/bytedance/seedance/v1.5/pro/image-to-video", name: "🎥 Seedance Pro 1.5", type: "I2V" },
    { modle_id: "fal-ai/bytedance/seedance/v1/pro/image-to-video", name: "🎥 Seedance Pro 1.0", type: "I2V" },
] as const;

// 提取所有可能的 modle_id 类型
export type ImageModelId = typeof image_modles[number]['modle_id'];
export type VideoModelId = typeof video_modles[number]['modle_id'];
export type AllModelIds = ImageModelId | VideoModelId;

// ==========================================
// 4. 注册表逻辑 (Registry Logic)
// ==========================================

// 辅助函数：将数组转为 Map
function createRatioMap<T>(arr: RatioOption<T>[]): Map<string, T> {
  return new Map(arr.map((r) => [r.label, r.value]));
}

// 1. 创建基础 Map
const maps = {
  flux: createRatioMap(flux_ratio),
  banana: createRatioMap(banana_ratio),
  veo: createRatioMap(veo_ratio),
  seedance: createRatioMap(seedance_ratio),
};

// 2. 建立 "modle_id" -> "Map" 的精确映射
// 使用 Record 确保每个 ID 都有对应的配置
const idToRatioRegistry: Record<AllModelIds, Map<string, AnyRatioValue>> = {
  // Banana 系列 (Pro 和 普通版，编辑和生成版，都指向 maps.banana)
  "fal-ai/nano-banana-pro": maps.banana,
  "fal-ai/nano-banana-pro/edit": maps.banana,
  "fal-ai/nano-banana": maps.banana,
  "fal-ai/nano-banana/edit": maps.banana,

  // Flux 系列
  "fal-ai/flux-2-pro": maps.flux,
  "fal-ai/flux-2-pro/edit": maps.flux,

  // Veo 系列
  "fal-ai/veo2/image-to-video": maps.veo,
  "fal-ai/veo3/image-to-video": maps.veo,

  // Seedance 系列
  "fal-ai/bytedance/seedance/v1.5/pro/image-to-video": maps.seedance,
  "fal-ai/bytedance/seedance/v1/pro/image-to-video": maps.seedance,
};

// ==========================================
// 5. 获取函数 (Getter Function)
// ==========================================

/**
 * 根据模型 ID 和 比例 Label 获取参数
 * @param modelId - 具体的 modle_id，例如 "fal-ai/flux-2-pro"
 * @param label - 比例标签，如 '1:1', '16:9'
 */
export function getRatioValue(modelId: AllModelIds, label: string): AnyRatioValue | undefined {
  const map = idToRatioRegistry[modelId];
  if (!map) {
      // 理论上 TS 会拦截未知的 ID，但运行时仍需防护
      console.warn(`No ratio map found for model ID: ${modelId}`);
      return undefined;
  }
  return map.get(label);
}