
// 判断 URL 是否为视频链接的函数
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];

export function isVideoUrl(url: string) {
  const cleanUrl = url.split('?')[0];
  const ext = cleanUrl.split('.').pop()?.toLowerCase();
  return ext ? VIDEO_EXTENSIONS.includes(ext) : false;
}
