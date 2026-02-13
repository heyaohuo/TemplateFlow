
import { AllModelIds, getRatioValue } from "@/lib/types/ratioType";

type Sleep = (ms: number) => Promise<void>

const sleep: Sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const mockImageResult = (tag: string, numImages: string = "1"): [{ type: 'image'; url: string }] => {
  console.log(`✅ mock ${tag} success`)

  const nums = parseInt(numImages, 10);
  let finalUrls = [];
  for(let i = 0; i < nums; i++) {
    finalUrls.push({
      type: 'image',
      url: `https://store.coinminer.one/PR_image.jpeg`,
    });
  }

  return finalUrls as [{ type: 'image'; url: string }];
  return [{
    type: 'image',
    url: 'https://store.coinminer.one/PR_image.jpeg',
  }]
}

const mockVideoResult = (tag: string): [{ type: 'video'; url: string }] => {
  console.log(`🎬 mock ${tag} success`)
  return [{
    type: 'video',
    url: 'https://store.coinminer.one/PR_video.mp4',
  }]
}

export const handlePrompt = async ({
  id,
  prompt,
  model,
  mode,
  base64Images,
  extra = {},
}: {
  id: string
  prompt: string
  model: AllModelIds
  mode: string
  base64Images?: string[]
  extra?: {
    numImages?: string
    duration?: string
    resolution?: string
    ratio?: string
    [key: string]: any
  }
}): Promise<[{
  type: 'image' | 'video'
  url: string
}]> => {
  console.log('============================')
  console.log('🧠 handlePrompt invoked')
  console.log('node id:', id)
  console.log('mode:', mode)
  console.log('model:', model)
  console.log('prompt:', prompt)
  console.log('extra:', extra)
  console.log(
    'reference images:',
    base64Images ? base64Images.length : 0
  )
  const ratioValue = getRatioValue(model, extra.ratio || '1:1');
  console.log('mapped ratio value:', ratioValue);
  console.log('============================')

  const handle_node = async () => {

    const model_id = model;
    const ratioValue = getRatioValue(model_id, extra.ratio || '1:1');
    const numImages = extra?.numImages || '1';

    const falKey = localStorage.getItem('fal_api_key');

    const falHeaders = {
      'Content-Type': 'application/json',
    ...(falKey ? { 'x-user-fal-key': falKey } : {}),
    }
    // 判断是否是文生图或者文生视频
    if (mode === 'text' || base64Images?.length === 0 || !base64Images) {

      // 直接生成
      const res = await fetch('/api/falai',{
        method: 'POST',
        headers: falHeaders,
        body: JSON.stringify({
          id,
          prompt: prompt,
          model_id: model_id,
          mode: 'text',
          aspectRatio: ratioValue,
          imageConfig: {
            resolution: extra.resolution,
          },
        }),
      })
      const data = await res.json()
      return data.urls;

    } else if(mode === "image" || mode === "video") {
      // 如果是图生图或者图生视频
      if(base64Images?.length === 0 || !base64Images) return
      
      //  首先input图片转换为url
      const formData = new FormData();
      formData.append('image', base64Images[0]);
      const urlRes = await fetch('/api/upload', {
        method: "POST",
        body: formData,
      });
      

      const { url } = await urlRes.json();
      const urls = [url]; // 如果有多个图片，可以继续上传并添加到urls数组中
      // 然后将url等信息使用fal ai生成图片和视频
      const res = await fetch('/api/falai',{
        method: 'POST',
        headers: falHeaders,
        body: JSON.stringify({
          id,
          prompt: prompt,
          model_id: model_id,
          urls:urls,
          numImages,
          mode: 'image',
          aspectRatio: ratioValue,
          imageConfig: {
            resolution: extra.resolution,
            ...(mode === "video" && { duration: extra.duration }),
          },
        }),
      })

      const data = await res.json()
      return data.urls;
    }

  }

  // 真正调用 handle_node 获取结果
  // const result = await handle_node();

if(mode === 'text' || base64Images?.length === 0 || !base64Images) {
    await sleep(2000)
    return mockImageResult('text-to-image')
  } else if(mode === "image" && base64Images && base64Images.length > 0) {
    await sleep(2000)
    return mockImageResult('image-to-image', extra?.numImages && extra.numImages)
  } else if(mode === "video" && base64Images && base64Images.length > 0) {
    await sleep(3000)
    return mockVideoResult('image-to-video')
  } 


/*  //  🔹 文生图
   
  if (mode === 'text') {

    // const res = await fetch('/api/youmind', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       id,
    //       prompt: prompt,
    //       mode: 'image',
    //       base64Images,
    //       imageConfig: {
    //         aspectRatio: extra.aspectRatio,
    //         resolution: extra.resolution,
    //       },
    //     }),
    //   })
    // const data = await res.json()
      // data: { type, url }
    await sleep(1500)
    return mockImageResult('text-to-image')
  }
  
  //  🔹 图生图（1 ~ N 张参考图）
   
  if (mode === 'image') {
    if (!base64Images || base64Images.length === 0) {
      throw new Error('Image-to-image requires at least one reference image')
    }

    // const res = await fetch('/api/youmind', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       id,
    //       prompt: prompt,
    //       mode: 'image',
    //       base64Images,
    //       imageConfig: {
    //         aspectRatio: extra.aspectRatio,
    //         imageSize: extra.resolution,
    //       },
    //     }),
    //   })
    // const data = await res.json()
      // data: { type, url }
      

    await sleep(2000)
    return mockImageResult('image-to-image')
  }

  
    // 🔹 图生视频（1 ~ N 张参考图）
   

  if (mode === 'video') {
    if (!base64Images || base64Images.length === 0) {
      throw new Error('Image-to-video requires at least one reference image')
    }

    if (!extra.duration) {
      throw new Error('Video generation requires duration')
    }

    await sleep(3000)
    return mockVideoResult('image-to-video')
  } 
 */
  throw new Error(`Unsupported mode: ${mode}`)
}
