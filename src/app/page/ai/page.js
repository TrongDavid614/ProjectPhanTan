"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/common/Navbar/Navbar";
import { Sparkles, SendHorizonal, Bot, UserRound } from "lucide-react";
import styles from "./ai.module.css";

const QUICK_PROMPTS = [
  "Sắp có concert nào đáng mua nhất?",
  "Giới thiệu cho tôi sự kiện phù hợp với sinh viên.",
  "Tôi muốn tìm vé giá rẻ dưới 500k.",
  "Có concert nào ở TP.HCM tuần này không?",
];

function createMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

function extractAiReply(payload) {
  if (!payload) return "AI chưa trả lời được lúc này.";

  if (typeof payload === "string") {
    const trimmed = payload.trim();

    if (!trimmed) return "AI chưa trả lời được lúc này.";

    try {
      return extractAiReply(JSON.parse(trimmed));
    } catch {
      return trimmed;
    }
  }

  if (typeof payload !== "object") {
    return String(payload);
  }

  if (typeof payload.reply === "string" && payload.reply.trim()) {
    return payload.reply.trim();
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  const candidates = Array.isArray(payload.candidates)
    ? payload.candidates
    : [];

  for (const candidate of candidates) {
    const parts = candidate?.content?.parts;

    if (!Array.isArray(parts)) continue;

    const text = parts
      .map((part) => part?.text)
      .filter((partText) => typeof partText === "string" && partText.trim())
      .join("\n")
      .trim();

    if (text) {
      return text;
    }
  }

  if (typeof payload.text === "string" && payload.text.trim()) {
    return payload.text.trim();
  }

  return "AI chưa trả lời được lúc này.";
}

export default function AiPage() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    createMessage(
      "assistant",
      "Xin chào, tôi là trợ lý AI của 8ThreadsEvent. Hãy hỏi tôi về concert, vé, giá hoặc sự kiện phù hợp với bạn.",
    ),
  ]);

  const canSend = useMemo(
    () => message.trim().length > 0 && !isSending,
    [message, isSending],
  );

  const sendMessage = async (customMessage) => {
    const text = (customMessage ?? message).trim();
    if (!text || isSending) return;

    setError("");
    setMessages((prev) => [...prev, createMessage("user", text)]);
    setMessage("");
    setIsSending(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Không thể kết nối AI");
      }

      const reply = extractAiReply(data?.reply ?? data?.data ?? data);
      setMessages((prev) => [...prev, createMessage("assistant", reply)]);
    } catch (err) {
      setError(err?.message || "Đã xảy ra lỗi khi gửi câu hỏi.");
      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          "Hiện tại tôi không thể phản hồi. Vui lòng thử lại sau ít phút.",
        ),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.pageShell}>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            AI tư vấn sự kiện
          </div>
          <h1>Trò chuyện với AI để chọn concert phù hợp hơn.</h1>
          <p>
            Hỏi về lịch diễn, giá vé, khu vực phù hợp hoặc gợi ý concert theo
            nhu cầu. AI sẽ trả lời dựa trên dữ liệu sự kiện đang có trong hệ
            thống.
          </p>
        </section>

        <section className={styles.chatCard}>
          <div className={styles.chatHeader}>
            <div>
              <span className={styles.chatTitle}>8Threads AI Assistant</span>
              <p>Hỗ trợ người dùng tìm sự kiện nhanh hơn</p>
            </div>
            <div className={styles.chatStatus}>
              <span className={styles.statusDot} />
              Sẵn sàng
            </div>
          </div>

          <div className={styles.promptList}>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className={styles.promptChip}
                onClick={() => sendMessage(prompt)}
                disabled={isSending}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className={styles.messageList}>
            {messages.map((item) => (
              <article
                key={item.id}
                className={`${styles.messageRow} ${
                  item.role === "user" ? styles.userRow : styles.assistantRow
                }`}
              >
                <div className={styles.avatarWrap}>
                  {item.role === "user" ? (
                    <UserRound size={18} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>
                <div className={styles.messageBubble}>
                  <div className={styles.messageRole}>
                    {item.role === "user" ? "Bạn" : "AI"}
                  </div>
                  <div className={styles.messageText}>{item.content}</div>
                </div>
              </article>
            ))}

            {isSending && (
              <article
                className={`${styles.messageRow} ${styles.assistantRow}`}
              >
                <div className={styles.avatarWrap}>
                  <Bot size={18} />
                </div>
                <div className={styles.messageBubble}>
                  <div className={styles.messageRole}>AI</div>
                  <div className={styles.typingDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </article>
            )}
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form
            className={styles.composer}
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập câu hỏi của bạn về concert, vé hoặc sự kiện..."
              rows={3}
              className={styles.textarea}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!canSend}
            >
              <SendHorizonal size={18} />
              Gửi câu hỏi
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
