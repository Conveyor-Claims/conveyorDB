"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { CaseComment, CreateCommentState } from "@/lib/comments";
import { createCommentAction } from "./actions";

function formatCommentTime(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function authorInitial(author: string | null): string {
  const text = author?.trim() ?? "";
  return text ? text.slice(0, 1).toUpperCase() : "?";
}

function CommentBody({ text }: { text: string }) {
  const parts = text.split(/((?<![A-Za-z0-9._-])@[A-Za-z0-9._-]+)/g);
  return (
    <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
      {parts.map((part, index) =>
        part.startsWith("@") ? (
          <span
            key={`${part}-${index}`}
            className="rounded bg-wash px-0.5 font-medium text-accent"
          >
            {part}
          </span>
        ) : (
          <span key={`${index}-${part.slice(0, 8)}`}>{part}</span>
        ),
      )}
    </p>
  );
}

function CommentCard({
  row,
  onReply,
  nested = false,
}: {
  row: CaseComment;
  onReply: (id: string) => void;
  nested?: boolean;
}) {
  const author = row.author?.trim() || "";
  const body = row.comment ?? "";
  const mentioned = row.mentioned_users?.trim() || "";

  return (
    <article
      className={`space-y-2 ${nested ? "border-l-2 border-border pl-3" : ""}`}
    >
      <div className="flex items-start gap-2">
        <span
          aria-hidden
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-wash text-xs font-medium text-muted"
        >
          {authorInitial(author)}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="font-mono text-sm text-foreground">
              {author || ""}
            </p>
            <time
              className="text-xs text-muted"
              dateTime={row.created_time ?? undefined}
            >
              {formatCommentTime(row.created_time)}
            </time>
          </div>
          {body ? <CommentBody text={body} /> : null}
          {mentioned ? (
            <p className="text-xs text-muted">
              Mentioned:{" "}
              <span className="font-mono text-foreground">{mentioned}</span>
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => onReply(row.id)}
            className="text-xs text-accent hover:text-accent-hover"
          >
            Reply
          </button>
        </div>
      </div>
    </article>
  );
}

function Composer({
  caseId,
  canPost,
  replyTo,
  replyAuthor,
  onCancelReply,
}: {
  caseId: string;
  canPost: boolean;
  replyTo: string | null;
  replyAuthor: string;
  onCancelReply: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    createCommentAction,
    null as CreateCommentState | null,
  );
  const formKey = state?.id ?? "composer";

  useEffect(() => {
    if (state?.ok && state.id) {
      onCancelReply();
    }
  }, [state, onCancelReply]);

  if (!canPost) {
    return (
      <p className="border-t border-border px-4 py-3 text-sm text-muted">
        <Link href="/login" className="text-accent hover:text-accent-hover">
          Temporary login
        </Link>{" "}
        to post a comment.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-2 border-t border-border px-4 py-3">
      <input type="hidden" name="caseRowId" value={caseId} />
      {replyTo ? (
        <input type="hidden" name="parentCommentId" value={replyTo} />
      ) : null}
      {replyTo ? (
        <p className="flex items-center justify-between text-xs text-muted">
          <span>
            Replying to{" "}
            <span className="font-mono text-foreground">
              {replyAuthor || "comment"}
            </span>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-accent hover:text-accent-hover"
          >
            Cancel
          </button>
        </p>
      ) : null}
      <label className="sr-only" htmlFor="case-comment-body">
        Comment
      </label>
      <textarea
        key={formKey}
        id="case-comment-body"
        name="comment"
        rows={3}
        placeholder={
          replyTo
            ? "Write a reply… use @name to mention"
            : "Write a comment… use @name to mention"
        }
        className="w-full resize-y rounded-[12px] border border-border bg-background px-3 py-2 text-sm text-foreground"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[12px] bg-accent px-4 py-2 text-sm font-medium text-accent-on hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Posting…" : "Post"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            state?.ok
              ? "text-emerald-700"
              : state
                ? "text-red-800"
                : "text-muted"
          }`}
        >
          {pending ? "Posting…" : (state?.message ?? "")}
        </p>
      </div>
    </form>
  );
}

export function CaseComments({
  caseId,
  comments,
  error,
  canPost,
}: {
  caseId: string;
  comments: CaseComment[];
  error: string | null;
  canPost: boolean;
}) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const clearReply = useCallback(() => setReplyTo(null), []);
  const byParent = new Map<string, CaseComment[]>();
  const roots: CaseComment[] = [];

  for (const row of comments) {
    const parent = row.parent_comment?.trim() || "";
    if (parent && comments.some((item) => item.id === parent)) {
      const list = byParent.get(parent) ?? [];
      list.push(row);
      byParent.set(parent, list);
    } else {
      roots.push(row);
    }
  }

  const replyAuthor =
    comments.find((row) => row.id === replyTo)?.author?.trim() ?? "";

  return (
    <div className="flex h-full min-h-[28rem] flex-col">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">Comments</h2>
        <p className="text-xs text-muted">Case chat · oldest first</p>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {comments.length === 0 && !error ? (
          <p className="text-sm text-muted">No comments yet.</p>
        ) : null}
        <ol className="space-y-4">
          {roots.map((row) => (
            <li key={row.id} className="space-y-3">
              <CommentCard row={row} onReply={setReplyTo} />
              {(byParent.get(row.id) ?? []).map((reply) => (
                <CommentCard
                  key={reply.id}
                  row={reply}
                  onReply={setReplyTo}
                  nested
                />
              ))}
            </li>
          ))}
        </ol>
      </div>

      <Composer
        caseId={caseId}
        canPost={canPost}
        replyTo={replyTo}
        replyAuthor={replyAuthor}
        onCancelReply={clearReply}
      />
    </div>
  );
}
