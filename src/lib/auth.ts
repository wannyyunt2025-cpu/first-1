import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: "Supabase 未配置，请先设置环境变量" }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true }
}

export async function logout(): Promise<void> {
  if (!isSupabaseConfigured()) return
  await supabase.auth.signOut()
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  const { data } = await supabase.auth.getSession()
  return Boolean(data.session)
}
