import { cache } from "react";
import { casesClient, isCaseId } from "@/lib/cases";
import type { Database } from "@/lib/database.types";
import { getSession, isAdmin } from "@/lib/session";

export type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

export type CaseComment = Pick<
  CommentRow,
  | "id"
  | "comment"
  | "case"
  | "author"
  | "created_time"
  | "mentioned_users"
  | "parent_comment"
  | "replies"
>;

export type CommentsForCase = {
  rows: CaseComment[];
  error: string | null;
};

export type CreateCommentState = {
  ok: boolean;
  message: string;
  id?: string;
};

/** Temporary admin stub. Do not invent a person name or email. */
export const COMMENT_AUTHOR = "admin";

const COMMENT_SELECT =
  "id, comment, case, author, created_time, mentioned_users, parent_comment, replies";

/**
 * `@tokens` from the comment body. Email-like `user@host` is skipped.
 * Stored comma-separated without `@`. Blank stays blank.
 */
export function parseMentionedUsers(comment: string): string | null {
  const tokens: string[] = [];
  const seen = new Set<string>();
  const re = /(?<![A-Za-z0-9._-])@([A-Za-z0-9._-]+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(comment)) !== null) {
    const token = match[1];
    if (!token || seen.has(token)) continue;
    seen.add(token);
    tokens.push(token);
  }
  return tokens.length === 0 ? null : tokens.join(",");
}

export const listCommentsForCase = cache(
  async (caseId: string): Promise<CommentsForCase> => {
    const { client } = casesClient();
    if (!client) {
      return { rows: [], error: "Supabase client is not configured." };
    }
    if (!isCaseId(caseId)) {
      return { rows: [], error: null };
    }

    const { data, error } = await client
      .from("comments")
      .select(COMMENT_SELECT)
      .eq("case", caseId)
      .order("created_time", { ascending: true });

    if (error) {
      return { rows: [], error: error.message };
    }

    return { rows: data ?? [], error: null };
  },
);

export async function createCommentFromForm(
  formData: FormData,
): Promise<CreateCommentState> {
  const session = await getSession();
  if (!isAdmin(session)) {
    return {
      ok: false,
      message: "Temporary login required to post a comment.",
    };
  }

  const commentRaw = formData.get("comment");
  const comment = typeof commentRaw === "string" ? commentRaw : "";
  if (comment.trim() === "") {
    return { ok: true, message: "" };
  }

  const idRaw = formData.get("caseRowId");
  const caseId = typeof idRaw === "string" ? idRaw : "";
  if (!isCaseId(caseId)) {
    return { ok: false, message: "Could not post: invalid case id." };
  }

  const parentRaw = formData.get("parentCommentId");
  let parentComment: string | null = null;
  if (typeof parentRaw === "string" && parentRaw.trim() !== "") {
    if (!isCaseId(parentRaw)) {
      return { ok: false, message: "Could not post: invalid parent comment." };
    }
    parentComment = parentRaw;
  }

  const { client } = casesClient();
  if (!client) {
    return { ok: false, message: "Supabase client is not configured." };
  }

  if (parentComment) {
    const { data: parent, error: parentError } = await client
      .from("comments")
      .select("id, case")
      .eq("id", parentComment)
      .maybeSingle();
    if (parentError) {
      return { ok: false, message: parentError.message };
    }
    if (!parent || parent.case !== caseId) {
      return {
        ok: false,
        message: "Could not post: parent comment is not on this case.",
      };
    }
  }

  const row: CommentInsert = {
    comment: comment.trim(),
    case: caseId,
    author: COMMENT_AUTHOR,
    created_time: new Date().toISOString(),
    mentioned_users: parseMentionedUsers(comment),
    parent_comment: parentComment,
    airtable_id: null,
  };

  const { data, error } = await client
    .from("comments")
    .insert(row)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Could not post: comment was not saved." };
  }

  return { ok: true, message: "Posted.", id: data.id };
}
