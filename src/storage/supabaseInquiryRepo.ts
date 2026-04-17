/**
 * admin_inquiries 테이블 repo.
 *
 * RLS 정책:
 *   - 본인 문의: 누구나 조회 가능 (user_id = auth.uid())
 *   - 본인 문의 생성: 로그인 사용자 (user_id = auth.uid())
 *   - 전체 조회 + 답변 작성 + 삭제: admin만
 *
 * 테이블이 없으면 localStorage 폴백.
 */

import { supabase } from "../lib/supabase";

export interface AdminInquiry {
  id: string;
  user_id: string;
  user_email: string;
  question: string;
  ai_response: string;
  admin_reply: string | null;
  status: "pending" | "replied";
  created_at: string;
  replied_at: string | null;
}

// ─── localStorage 폴백 (테이블 미생성 시) ───

const LS_KEY = "aigolab-admin-inquiries";

function lsLoad(): AdminInquiry[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]"); } catch { return []; }
}
function lsSave(list: AdminInquiry[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 100)));
}

let useLocalFallback = false;

// ─── 사용자용 ───

/** 문의 저장 (사용자가 @관리자 멘션 시) */
export async function createInquiry(params: {
  userId: string;
  userEmail: string;
  question: string;
  aiResponse: string;
}): Promise<{ error?: string }> {
  if (useLocalFallback) {
    const item: AdminInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user_id: params.userId,
      user_email: params.userEmail,
      question: params.question,
      ai_response: params.aiResponse,
      admin_reply: null,
      status: "pending",
      created_at: new Date().toISOString(),
      replied_at: null,
    };
    const list = lsLoad();
    list.unshift(item);
    lsSave(list);
    return {};
  }

  const { error } = await supabase.from("admin_inquiries").insert({
    user_id: params.userId,
    user_email: params.userEmail,
    question: params.question,
    ai_response: params.aiResponse,
    status: "pending",
  });

  if (error) {
    // 테이블이 없으면 localStorage 폴백 활성화
    if (error.code === "42P01" || error.message.includes("does not exist")) {
      console.warn("[inquiry] 테이블 미생성 — localStorage 폴백 사용");
      useLocalFallback = true;
      return createInquiry(params); // 재시도
    }
    console.error("[inquiry] createInquiry error:", error.message);
    return { error: error.message };
  }
  return {};
}

/** 사용자 본인의 문의 목록 조회 */
export async function listMyInquiries(userId: string): Promise<AdminInquiry[]> {
  if (useLocalFallback) {
    return lsLoad().filter((i) => i.user_id === userId);
  }

  const { data, error } = await supabase
    .from("admin_inquiries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01" || error.message.includes("does not exist")) {
      useLocalFallback = true;
      return listMyInquiries(userId);
    }
    console.error("[inquiry] listMyInquiries error:", error.message);
    return [];
  }
  return (data as AdminInquiry[]) ?? [];
}

// ─── 관리자용 ───

/** 전체 문의 목록 조회 (admin) */
export async function listAllInquiries(): Promise<AdminInquiry[]> {
  if (useLocalFallback) {
    return lsLoad();
  }

  const { data, error } = await supabase
    .from("admin_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01" || error.message.includes("does not exist")) {
      useLocalFallback = true;
      return listAllInquiries();
    }
    console.error("[inquiry] listAllInquiries error:", error.message);
    return [];
  }
  return (data as AdminInquiry[]) ?? [];
}

/** 관리자 답변 작성 (admin) */
export async function replyToInquiry(
  inquiryId: string,
  reply: string
): Promise<{ error?: string }> {
  if (useLocalFallback) {
    const list = lsLoad();
    const idx = list.findIndex((i) => i.id === inquiryId);
    if (idx >= 0) {
      list[idx].admin_reply = reply;
      list[idx].status = "replied";
      list[idx].replied_at = new Date().toISOString();
      lsSave(list);
    }
    return {};
  }

  const { error } = await supabase
    .from("admin_inquiries")
    .update({
      admin_reply: reply,
      status: "replied",
      replied_at: new Date().toISOString(),
    })
    .eq("id", inquiryId);

  if (error) {
    console.error("[inquiry] replyToInquiry error:", error.message);
    return { error: error.message };
  }
  return {};
}

/** 문의 삭제 (admin) */
export async function deleteInquiry(
  inquiryId: string
): Promise<{ error?: string }> {
  if (useLocalFallback) {
    lsSave(lsLoad().filter((i) => i.id !== inquiryId));
    return {};
  }

  const { error } = await supabase
    .from("admin_inquiries")
    .delete()
    .eq("id", inquiryId);

  if (error) {
    console.error("[inquiry] deleteInquiry error:", error.message);
    return { error: error.message };
  }
  return {};
}
