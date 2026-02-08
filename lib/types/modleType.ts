

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
