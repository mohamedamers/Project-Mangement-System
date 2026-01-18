import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import type { AxiosError } from "axios";
import { http } from "../../../../Services/Api/httpInstance";
import { TASK_URLS } from "../../../../Services/Api/ApisUrls";

type Msg = { role: "user" | "assistant"; content: string };

type CountResponse = {
  toDo: number;
  inProgress: number;
  done: number;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}

export default function SimpleChatBot() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "أهلًا 👋 اسأليني مثلًا: (عدد التاسكات) أو (tasks count) أو (help).",
    },
  ]);

  // ✅ load/save dark mode
  useEffect(() => {
    const saved = localStorage.getItem("chat_dark");
    if (saved) setDark(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_dark", dark ? "1" : "0");
  }, [dark]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const theme = dark
    ? {
        panel: "#0B1220",
        header: "#0B1220",
        body: "#0F172A",
        border: "rgba(255,255,255,0.10)",
        userBubble: "#F4A21B",
        botBubble: "#111827",
        botText: "#E5E7EB",
        userText: "#fff",
        inputBg: "#0B1220",
        inputText: "#E5E7EB",
        inputBorder: "rgba(255,255,255,0.14)",
      }
    : {
        panel: "#fff",
        header: "#fff",
        body: "#fafafa",
        border: "rgba(0,0,0,0.06)",
        userBubble: "#F4A21B",
        botBubble: "#fff",
        botText: "#111",
        userText: "#fff",
        inputBg: "#fff",
        inputText: "#111",
        inputBorder: "rgba(0,0,0,0.12)",
      };

 const replies = useMemo(
  () => [
    // ---- Names ----
    { keywords: ["ameera", "amira"], reply: "❤️ Love you, Ameera!" },
    { keywords: ["nadia"], reply: "😎 Much respect, Engineer Nadia!" },
    { keywords: ["mohamed"], reply: "👑 Welcome, Mohamed!" },
    { keywords: ["ahmed"], reply: "🔥 Ahmed, you’re awesome!" },

    // ---- Company / Team ----
    {
      keywords: ["upskilling", "upskill"],
      reply: "🚀 Upskilling is a great place to learn and grow."
    },
    {
      keywords: ["team", "the team"],
      reply:
        "🤝 Thank you team for your dedication and great teamwork."
    },

    // ---- Greetings ----
    {
      keywords: ["hello", "hi", "hey", "welcome"],
      reply: "👋 Hello! Nice to see you."
    },
    {
      keywords: ["morning", "good morning"],
      reply: "☀️ Good morning! Have a great day."
    },
    {
      keywords: ["evening", "good evening"],
      reply: "🌙 Good evening!"
    },

    // ---- Feelings ----
    {
      keywords: ["love", "love you"],
      reply: "💖 Love you too!"
    },
    {
      keywords: ["sad", "upset"],
      reply: "😔 I’m here if you want to talk."
    },
    {
      keywords: ["happy", "excited"],
      reply: "🥳 That’s great! Congrats!"
    },

    // ---- Thanks / Compliments ----
    {
      keywords: ["thanks", "thank you"],
      reply: "You’re welcome 🙌"
    },
    {
      keywords: ["great", "awesome", "nice work"],
      reply: "😎 Thanks! Glad you like it."
    },

    // ---- Help ----
    {
      keywords: ["help", "how", "what is"],
      reply:
        "🤔 How can I help? Try: tasks, projects, users, dashboard, login."
    },
    {
      keywords: ["dashboard"],
      reply:
        "📊 The dashboard shows stats, charts, and performance data."
    },

    // ---- Tasks ----
    {
      keywords: ["task", "tasks"],
      reply:
        "📌 You can manage tasks from the Tasks page."
    },
    {
      keywords: ["todo"],
      reply: "🟡 To Do means not started yet."
    },
    {
      keywords: ["in progress"],
      reply: "🔵 In Progress means work is ongoing."
    },
    {
      keywords: ["done", "completed"],
      reply: "🟢 Done means the task is finished."
    },

    // ---- Projects ----
    {
      keywords: ["project", "projects"],
      reply:
        "📁 Projects help you organize tasks together."
    },
    {
      keywords: ["add project"],
      reply:
        "➕ Go to Projects and click Add New Project."
    },
    {
      keywords: ["edit project"],
      reply:
        "✏️ Use the menu and select Edit."
    },
    {
      keywords: ["delete project"],
      reply:
        "🗑️ Use the menu and confirm delete."
    },

    // ---- Users ----
    {
      keywords: ["user", "users"],
      reply:
        "👥 You can manage users from the Users page."
    },
    {
      keywords: ["active"],
      reply: "✅ Active means the user is enabled."
    },
    {
      keywords: ["inactive"],
      reply: "⛔ Inactive means the user is disabled."
    },

    // ---- Auth / Errors ----
    {
      keywords: ["login", "auth", "token"],
      reply:
        "🔐 Check your token and make sure you are logged in."
    },
    {
      keywords: ["401", "unauthorized"],
      reply:
        "🚫 401 means your token is invalid or expired."
    },
    {
      keywords: ["403", "forbidden"],
      reply:
        "🚫 403 means you don’t have permission."
    },
    {
      keywords: ["404"],
      reply:
        "🔎 404 means the resource was not found."
    },
    {
      keywords: ["500"],
      reply:
        "💥 500 is a server error. Please try again."
    },

    // ---- Git ----
    {
      keywords: ["git"],
      reply:
        "🐙 Do you want to pull, merge, or stash?"
    },
    {
      keywords: ["pull"],
      reply:
        "⬇️ Use git pull to get the latest updates."
    },
    {
      keywords: ["merge"],
      reply:
        "🔀 Use git merge to combine branches."
    },
    {
      keywords: ["conflict"],
      reply:
        "⚠️ Fix conflicts, then commit your changes."
    },

    // ---- UI ----
    {
      keywords: ["bootstrap"],
      reply:
        "🧩 Bootstrap helps with layout and styling."
    },
    {
      keywords: ["dark mode"],
      reply:
        "🌙 Dark mode improves night viewing."
    },
    {
      keywords: ["loading", "spinner"],
      reply:
        "⏳ Show a spinner while loading data."
    },

    // ---- Fun ----
    {
      keywords: ["lol", "haha"],
      reply: "😂 That made me laugh!"
    },
    {
      keywords: ["bye", "goodbye"],
      reply: "👋 Bye! See you soon."
    },
     {
      keywords: ["شكرا"],
      reply: "العفو يا صديقي .. يومك سعيد "
    }
  ],
  []
);


  const wantsTasksCount = (text: string) => {
    const t = normalize(text);

    const hasTasks = ["task", "tasks", "تاسك", "تاسكات", "مهام"].some((k) =>
      t.includes(normalize(k))
    );
    const hasCount = ["count", "عدد", "كام", "كم", "احص", "إحص", "statistics", "stats"].some(
      (k) => t.includes(normalize(k))
    );

    return hasTasks && hasCount;
  };

  const getReplyLocal = (text: string) => {
    const t = normalize(text);
    if (t.length < 2) return "اكتبي سؤال أو كلمة وأنا هساعدك.";

    for (const item of replies) {
      if (item.keywords.some((k) => t.includes(normalize(k)))) return item.reply;
    }

    return "مش فاهم قصدك بالظبط 😅 جرّبي: (عدد التاسكات) أو (help)";
  };

  const getTasksCountFromApi = async () => {
    const res = await http.get<CountResponse>(TASK_URLS.COUNT_TASKS);
    const c = res.data;
    return `إحصائيات التاسكات 👇
ToDo: ${c.toDo}
In Progress: ${c.inProgress}
Done: ${c.done}`;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    if (wantsTasksCount(text)) {
      setLoading(true);
      try {
        const reply = await getTasksCountFromApi();
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch (e) {
        const err = e as AxiosError<any>;
        const msg =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message ??
          "حصل خطأ في جلب بيانات التاسكات.";
        setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    const botReply = getReplyLocal(text);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    }, 250);
  };

  return (
    <>
      {/* زرار فتح الشات */}
      <Button
        onClick={() => setOpen((v) => !v)}
        className="rounded-circle shadow primarycolorbg2"
        style={{
          position: "fixed",
          bottom: 18,
          right: 18,
          width: 56,
          height: 56,
          zIndex: 9999,
        }}
      >
        <i className="bi bi-chat-dots" />
      </Button>

      {open && (
        <div
          className="shadow rounded-4"
          style={{
            position: "fixed",
            bottom: 86,
            right: 18,
            width: 560,
            maxWidth: "calc(100vw - 36px)",
            height: 530,
            zIndex: 9999,
            overflow: "hidden",
            background: theme.panel,
            border: `1px solid ${theme.border}`,
          }}
        >
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between p-3"
            style={{ background: theme.header, borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="fw-semibold" style={{ color: dark ? "#E5E7EB" : "#111" }}>
              Simple Bot
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-light"
                onClick={() => setDark((v) => !v)}
                title="Toggle theme"
              >
                {dark ? "☀️" : "🌙"}
              </button>

              <button className="btn btn-sm btn-light" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-3" style={{ height: 300, overflowY: "auto", background: theme.body }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`d-flex mb-2 ${m.role === "user" ? "justify-content-end" : ""}`}
              >
                <div
                  className="px-3 py-2 rounded-4"
                  style={{
                    maxWidth: "100%",
                    whiteSpace: "pre-line",
                    background: m.role === "user" ? theme.userBubble : theme.botBubble,
                    color: m.role === "user" ? theme.userText : theme.botText,
                    border: m.role === "user" ? "none" : `1px solid ${theme.border}`,
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="p-2" style={{ borderTop: `1px solid ${theme.border}` }}>
            <div className="d-flex gap-2 align-items-center">
              <Form.Control
                value={input}
                placeholder="اكتبي رسالتك…"
                style={{
                  background: theme.inputBg,
                  color: theme.inputText,
                  border: `1px solid ${theme.inputBorder}`,
                }}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    send();
                  }
                }}
              />

              <Button className="primarycolorbg2" onClick={send} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <i className="bi bi-send" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

