"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Supabase+프로젝트+연결이+필요합니다.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials(formData));
  if (error) {
    redirect("/login?error=이메일과+비밀번호를+확인해+주세요.");
  }
  redirect("/");
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Supabase+프로젝트+연결이+필요합니다.");
  }

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    ...credentials(formData),
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    redirect("/login?error=회원가입을+완료하지+못했습니다.");
  }
  redirect("/login?message=확인+메일을+보냈습니다.+메일의+링크를+눌러주세요.");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
