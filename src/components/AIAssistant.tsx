import { useState } from "react";
import { Send, Sparkles, Loader2, FileText, CheckCircle, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { formatSummaryForExport } from "../lib/workspace";

interface AIAssistantProps {
  onExportDoc: (title: string, content: string) => Promise<any>;
  onExportDrive: (filename: string, content: string) => Promise<any>;
  isLoggedIn: boolean;
}

export default function AIAssistant({
  onExportDoc,
  onExportDrive,
  isLoggedIn,
}: AIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const QUICK_PROMPTS = [
    { text: "ملخص كتاب 'الذكاء العاطفي' لدانيال جولمان", label: "لخص كتاب" },
    { text: "كيف يمكنني التغلب على قلق المستقبل والتفكير المفرط؟", label: "نصائح نفسية" },
    { text: "ما هي أفكار كارل يونغ وكيف تختلف عن فرويد؟", label: "مدارس نفسية" },
  ];

  const handleGenerate = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    setStatusMsg("");
    setStatusType("");

    // Try to extract a clean title from the query
    const titleMatch = query.match(/['"«](.+?)['"»]/) || [null, query.substring(0, 30)];
    setBookTitle(titleMatch[1] || "إجابة مستشار علم النفس");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          systemInstruction:
            "أنت مستشار وخبير متخصص في علم النفس وتحليل كتب التنمية الذاتية والعلوم السلوكية. أجب باللغة العربية الفصحى بشكل منظم وجميل. استخدم العناوين، والنقاط، والخط العريض لتنسيق النص. قدم ملخصات دقيقة وعميقة تحتوي على: الفكرة الكبرى، أهم 3 مفاهيم، واقتباس مميز.",
        }),
      });

      if (!res.ok) {
        throw new Error("فشل توليد الإجابة من خادم الذكاء الاصطناعي");
      }

      const data = await res.json();
      setResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setStatusMsg("عذراً، فشل الاتصال بخادم الذكاء الاصطناعي. الرجاء المحاولة مجدداً.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToDoc = async () => {
    if (!response) return;
    if (!isLoggedIn) {
      setStatusMsg("يرجى ربط حساب Google أولاً للتصدير");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatusMsg("جاري تصدير ملخصك إلى Google Docs...");
    setStatusType("");

    try {
      const formatted = formatSummaryForExport(
        bookTitle,
        "توليد الذكاء الاصطناعي",
        new Date().getFullYear(),
        "ملخص مخصص بالذكاء الاصطناعي",
        response,
        [],
        []
      );

      const result = await onExportDoc(bookTitle, formatted);
      setStatusMsg(`تم التصدير بنجاح! يمكنك فتحه من الرابط: ${result.url}`);
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "فشل التصدير إلى مستندات Google");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToDrive = async () => {
    if (!response) return;
    if (!isLoggedIn) {
      setStatusMsg("يرجى ربط حساب Google أولاً للتصدير");
      setStatusType("error");
      return;
    }

    setLoading(true);
    setStatusMsg("جاري تصدير ملفك إلى Google Drive...");
    setStatusType("");

    try {
      const formatted = formatSummaryForExport(
        bookTitle,
        "توليد الذكاء الاصطناعي",
        new Date().getFullYear(),
        "ملخص مخصص بالذكاء الاصطناعي",
        response,
        [],
        []
      );

      const result = await onExportDrive(`ملخص_${bookTitle.replace(/\s+/g, "_")}`, formatted);
      setStatusMsg(`تم حفظ الملف في Google Drive بنجاح! الرابط: ${result.url}`);
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "فشل التصدير إلى Google Drive");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl">
          <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-gray-900 text-md leading-tight">
            مستشار علم النفس الذكي (Gemini)
          </h3>
          <p className="text-xs text-gray-400 font-mono tracking-wider mt-0.5">
            ASK AI & CUSTOM SUMMARIES
          </p>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_PROMPTS.map((qp, i) => (
          <button
            key={i}
            onClick={() => {
              setPrompt(qp.text);
              handleGenerate(qp.text);
            }}
            disabled={loading}
            className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-xs text-gray-600 rounded-xl border border-gray-100 transition-all text-right disabled:opacity-50"
          >
            <span className="font-semibold text-emerald-600 block text-[10px] mb-0.5">
              {qp.label}
            </span>
            {qp.text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="اكتب اسم أي كتاب في علم النفس لتلخيصه، أو اسأل عن نظرية نفسية سلوكية..."
          rows={3}
          disabled={loading}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-4 pl-12 text-sm text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
        />
        <button
          onClick={() => handleGenerate(prompt)}
          disabled={loading || !prompt.trim()}
          className="absolute left-3 bottom-4 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Status Messages */}
      {statusMsg && (
        <div
          className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2 border ${
            statusType === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : statusType === "error"
              ? "bg-red-50 border-red-100 text-red-800"
              : "bg-amber-50 border-amber-100 text-amber-800"
          }`}
        >
          {statusType === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <HelpCircle className="w-4 h-4 shrink-0 text-red-500" />
          )}
          <div className="break-all">
            {statusMsg.includes("http") ? (
              <p>
                {statusMsg.split("http")[0]}
                <a
                  href={"http" + statusMsg.split("http")[1]}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline text-emerald-700 hover:text-emerald-950 inline-block mr-1"
                >
                  فتح المستند الرابط ↗
                </a>
              </p>
            ) : (
              statusMsg
            )}
          </div>
        </div>
      )}

      {/* Response Box */}
      <div className="flex-1 overflow-y-auto max-h-[250px] bg-gray-50/50 border border-gray-100 rounded-2xl p-4">
        {loading && !response ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-xs">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
            <p>جاري صياغة المعرفة وتلخيص الأفكار...</p>
          </div>
        ) : response ? (
          <div className="prose prose-sm text-gray-800 text-right leading-relaxed text-sm">
            {response.split("\n").map((line, i) => {
              if (line.startsWith("#")) {
                return (
                  <h4 key={i} className="font-bold text-emerald-800 mt-3 mb-1">
                    {line.replace(/#/g, "").trim()}
                  </h4>
                );
              }
              if (line.startsWith("-") || line.startsWith("*")) {
                return (
                  <li key={i} className="mr-4 list-disc text-gray-700">
                    {line.replace(/^[-*]\s*/, "").trim()}
                  </li>
                );
              }
              return (
                <p key={i} className="mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-xs">
            <Sparkles className="w-8 h-8 text-gray-300 mb-2" />
            <p>اطرح سؤالك أو لخص كتابك المفضل الآن.</p>
          </div>
        )}
      </div>

      {/* Export Options (Active only when there's an active response) */}
      {response && (
        <div className="flex gap-3 mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={handleExportToDoc}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>تصدير إلى Google Docs</span>
          </button>
          <button
            onClick={handleExportToDrive}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-indigo-600">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
            </svg>
            <span>حفظ في Drive</span>
          </button>
        </div>
      )}
    </div>
  );
}
