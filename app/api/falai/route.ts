// app/api/download/route.ts
import { NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";

export async function POST(req: Request) {

  try {

    // 1. 读取用户 key（从 header 或 body）
    const userFalKey =
      req.headers.get("x-user-fal-key") || undefined

    // 2. 创建 fal client（关键）
    fal.config({
        credentials: userFalKey || process.env.FAL_API_KEY!
      });
    // 获取前端发送的
    const {
        id,
        prompt,
        mode,
        model_id,
        numImages,
        urls = [],
        aspectRatio,
        imageConfig
      }: {
        id: string
        prompt: string
        model_id: string
        mode: 'text' | 'image' | 'video'
        numImages: string
        urls?: string[]
        aspectRatio?:{}
        imageConfig: {
          duration?: string
          resolution?: string
        }
      } = await req.json();

      // 2. 构建 Fal AI 的 Input 参数
      let falInput: any = {
        prompt: prompt,
        enable_safety_checker: true,
        // 展开长宽比设置
        ...(aspectRatio || {}),
      };

      // 根据模式处理特定参数
    if (mode === 'image') {
      falInput.output_format = "png";
      const nums = parseInt(numImages, 10);
      falInput.num_images = nums && nums > 0 ? nums : 1; // 默认生成1张图
      // 如果是图生图，需要传入 image_url
      if (urls && urls.length > 0) {
        falInput.image_urls = urls[0]; 
      }
    } else if (mode === 'video') {
      // 视频特定的配置 (根据模型不同，参数名可能不同，这里假设通用配置)
      if (imageConfig?.duration) {
         // 有些模型叫 duration，有些叫 seconds
         falInput.duration = imageConfig.duration;
         falInput.generate_audio = false; // 假设我们不需要音频
      }
      // 如果是图生视频
      if (urls && urls.length > 0) {
        falInput.image_url = urls[0];
      }
    }

    // 3. 调用 Fal AI
    const result: any = await fal.subscribe(model_id, {
      input: falInput,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    // 4. 提取生成结果的 URLs
    let generatedUrls: string[] = [];
    
    if (result.data.images && result.data.images.length > 0) {
      generatedUrls = result.data.images.map((img: any) => img.url);
    } else if (result.data.video) {
      generatedUrls.push(result.data.video.url);
    } else if (result.data.file) {
      // 部分视频模型返回 file.url
      generatedUrls.push(result.data.file.url); 
    } else {
      throw new Error("Fal response format not recognized");
    }

    console.log(`[Fal] Generated remote URLs: ${generatedUrls}`);


    // 返回生成的 URLs 数组
    // 如果 mode 是 'text' 或 'image'，统一返回 'image'
    const returnType = (mode === 'video') ? 'video' : 'image';
    const finalUrls = generatedUrls.map(url => ({ type: returnType, url }));
    return NextResponse.json({
      urls: finalUrls,
    });

    /*
    // 确定文件名和扩展名
    const raw_img_name = generatedUrl.split("/").pop(); 
    // 防止文件名中包含 query 参数
    const clean_img_name = raw_img_name?.split('?')[0]; 
    const ext = clean_img_name?.split('.').pop() || (mode === 'video' ? 'mp4' : 'png');
    
    // 构造最终存储的文件名 (Key)
    const filename = `${id}_${Date.now()}.${ext}`;

    // 发送 POST 请求给 Worker
    // 注意：这里通常不需要在 URL 后面加 /filename，因为 filename 已经在 body 的 key 字段里了
    // 除非你的 Worker 路由设计强制要求路径匹配
    const uploadRes = await fetch(WORKER_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: generatedUrl,  // Fal 生成的源地址
        key: filename       // 你希望保存在 R2 的文件名
      }),
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      throw new Error(`R2 Upload (Sideload) failed: ${uploadRes.status} ${text}`);
    }

    // 6. 返回最终的 R2 公开链接
    const publicUrl = `${R2_PUBLIC_URL}/${filename}`;

    // 6. 核心逻辑修改：映射返回的 type
    // 如果 mode 是 'text' 或 'image'，统一返回 'image'
    const returnType = (mode === 'video') ? 'video' : 'image';
    return NextResponse.json({
      type: returnType,
      url: publicUrl,
    });

    */
      
  } catch (err:any) {
    console.error('Generation error', err)
    return NextResponse.json(
        { error: err.message || 'Generation failed' },
        { status: 500 }
    )
  }

}
