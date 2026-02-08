
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    // 这里的检查可以帮助您捕获并更好地报告错误
    throw new Error('Missing Supabase environment variables!')
  }
export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );