import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

const WORKER_UPLOAD_URL = process.env.NEXT_PUBLIC_WORKER_UPLOAD_URL
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL 

export async function POST(req: NextRequest) {
  try {
    const {
      id,
      prompt,
      mode,
      base64Images = [],
      imageConfig
    }: {
      id: string
      prompt: string
      mode: 'text' | 'image'
      base64Images?: string[]
      imageConfig: {
        aspectRatio?: string
        resolution?: string
      }
    } = await req.json()

    const ai = new GoogleGenAI({})

    // 构建 contents 数组
    const contents: any[] = []

    // 文本提示总是放第一
    contents.push({ text: prompt })

    // 如果是图生图，就把 Base64 图片 inline 传入
    if (mode === 'image') {
      if (!base64Images || base64Images.length === 0) {
        return NextResponse.json(
          { error: 'image mode requires reference images' },
          { status: 400 }
        )
      }

      base64Images.forEach((img) => {
        contents.push({
          inlineData: {
            mimeType: 'image/png',
            data: img,
          },
        })
      })
    }

    // 调用 Gemini generateContent 进行图像生成
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // 推荐用于图片生成
      contents: contents,
      // 可选：设置只返回图像，不返回额外文本
      config: {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: imageConfig.aspectRatio,
          imageSize: imageConfig?.resolution,
        },
      },
    })

    // 从返回解析每个 part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        // 取图像数据
        const imageData = part.inlineData.data
        const buffer = Buffer.from(imageData, 'base64');
        const filename = `${id}_${Date.now()}.png`

        // 上传到 R2 Worker
        const uploadRes = await fetch(
          `${WORKER_UPLOAD_URL}/${filename}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: buffer,
          }
        )

        if (!uploadRes.ok) {
          const text = await uploadRes.text()
          throw new Error(
            `Upload failed: ${uploadRes.status} ${text}`
          )
        }

        const publicUrl = `${R2_PUBLIC_URL}/${filename}`

        return NextResponse.json({
          type: 'image',
          url: publicUrl,
        })
      }
    }

    throw new Error('No generated image found')
  } catch (err: any) {
    console.error('Generation error', err)
    return NextResponse.json(
      { error: err.message || 'Generation failed' },
      { status: 500 }
    )
  }
}
