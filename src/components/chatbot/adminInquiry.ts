/**
 * @관리자 멘션 문의 저장.
 *
 * 현재는 localStorage에 저장 (Supabase 테이블 생성 전).
 * 추후 Supabase 연동 시 DB로 전환.
 */

export interface AdminInquiry {
  id: string;
  userId: string;
  userEmail: string;
  question: string;
  aiResponse: string;
  adminReply: string | null;
  status: "pending" | "replied";
  createdAt: string;
}

const STORAGE_KEY = "aigolab-admin-inquiries";

function loadInquiries(): AdminInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveInquiries(inquiries: AdminInquiry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
}

/** 사용자가 @관리자 멘션 시 호출 */
export async function saveAdminInquiry(params: {
  userId: string;
  userEmail: string;
  question: string;
  aiResponse: string;
}): Promise<void> {
  const inquiry: AdminInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId: params.userId,
    userEmail: params.userEmail,
    question: params.question.replace("@관리자", "").trim(),
    aiResponse: params.aiResponse,
    adminReply: null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const list = loadInquiries();
  list.unshift(inquiry);
  // 최대 100개 유지
  saveInquiries(list.slice(0, 100));
}

/** 관리자 대시보드에서 문의 목록 조회 */
export function listAdminInquiries(): AdminInquiry[] {
  return loadInquiries();
}

/** 관리자가 답변 작성 */
export function replyToInquiry(inquiryId: string, reply: string): void {
  const list = loadInquiries();
  const idx = list.findIndex((i) => i.id === inquiryId);
  if (idx >= 0) {
    list[idx].adminReply = reply;
    list[idx].status = "replied";
    saveInquiries(list);
  }
}

/** 특정 사용자의 문의 목록 조회 */
export function listUserInquiries(userId: string): AdminInquiry[] {
  return loadInquiries().filter((i) => i.userId === userId);
}

/** 특정 사용자의 답변된 문의 중 아직 확인하지 않은 것 개수 */
export function countUnreadReplies(userId: string): number {
  const readKey = `aigolab-read-replies-${userId}`;
  const readIds: string[] = JSON.parse(localStorage.getItem(readKey) ?? "[]");
  return loadInquiries().filter(
    (i) => i.userId === userId && i.status === "replied" && !readIds.includes(i.id)
  ).length;
}

/** 답변을 읽음 처리 */
export function markReplyAsRead(userId: string, inquiryId: string): void {
  const readKey = `aigolab-read-replies-${userId}`;
  const readIds: string[] = JSON.parse(localStorage.getItem(readKey) ?? "[]");
  if (!readIds.includes(inquiryId)) {
    readIds.push(inquiryId);
    localStorage.setItem(readKey, JSON.stringify(readIds));
  }
}

/** 문의 삭제 */
export function deleteInquiry(inquiryId: string): void {
  const list = loadInquiries().filter((i) => i.id !== inquiryId);
  saveInquiries(list);
}
