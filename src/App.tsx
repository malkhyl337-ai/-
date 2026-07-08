import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
  History,
  Lock,
  RefreshCw,
  FileText,
  CheckCircle,
  HelpCircle,
  Brain,
  Moon,
  Layers,
  Shield,
  Compass,
  Heart,
  Zap,
  Target,
  Users,
  UserCheck,
  Award,
  Loader2,
} from "lucide-react";

import { PSYCHOLOGY_BOOKS } from "./data/psychology";
import { BookSummary } from "./types";
import { initAuth, googleSignIn, logout, getAccessToken } from "./lib/firebase";
import {
  exportToGoogleDoc,
  exportToGoogleDriveFile,
  listExportedFiles,
  formatSummaryForExport,
} from "./lib/workspace";

import Navbar from "./components/Navbar";
import MindMap from "./components/MindMap";
import AIAssistant from "./components/AIAssistant";

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Moon":
      return <Moon className="w-5 h-5 text-emerald-600" />;
    case "Layers":
      return <Layers className="w-5 h-5 text-emerald-600" />;
    case "Shield":
      return <Shield className="w-5 h-5 text-emerald-600" />;
    case "Compass":
      return <Compass className="w-5 h-5 text-emerald-600" />;
    case "Sparkles":
      return <Sparkles className="w-5 h-5 text-emerald-600" />;
    case "Heart":
      return <Heart className="w-5 h-5 text-emerald-600" />;
    case "Zap":
      return <Zap className="w-5 h-5 text-emerald-600" />;
    case "Brain":
      return <Brain className="w-5 h-5 text-emerald-600" />;
    case "Target":
      return <Target className="w-5 h-5 text-emerald-600" />;
    case "Users":
      return <Users className="w-5 h-5 text-emerald-600" />;
    case "UserCheck":
      return <UserCheck className="w-5 h-5 text-emerald-600" />;
    case "Award":
      return <Award className="w-5 h-5 text-emerald-600" />;
    default:
      return <HelpCircle className="w-5 h-5 text-emerald-600" />;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSummary>(PSYCHOLOGY_BOOKS[0]);
  const [exportedFiles, setExportedFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [isExporting, setIsExporting] = useState(false);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        loadExportedFiles(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setExportedFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMsg("");
    setStatusType("");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        loadExportedFiles(result.accessToken);
        setStatusMsg("تم ربط حسابك في Google بنجاح!");
        setStatusType("success");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setStatusMsg("فشل الاتصال بحساب Google. يرجى التأكد من قبول الصلاحيات.");
      setStatusType("error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setExportedFiles([]);
      setStatusMsg("تم إلغاء ربط الحساب بنجاح.");
      setStatusType("success");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const loadExportedFiles = async (accessToken: string) => {
    setLoadingFiles(true);
    try {
      const files = await listExportedFiles(accessToken);
      setExportedFiles(files);
    } catch (err) {
      console.error("Failed to load exported files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Export handlers passed to AI Assistant or used by local curated book summary card
  const handleExportDoc = async (title: string, formattedText: string) => {
    const accessToken = token || (await getAccessToken());
    if (!accessToken) {
      throw new Error("يرجى ربط حساب Google أولاً للتصدير");
    }
    const result = await exportToGoogleDoc(accessToken, title, formattedText);
    loadExportedFiles(accessToken);
    return result;
  };

  const handleExportDrive = async (filename: string, content: string) => {
    const accessToken = token || (await getAccessToken());
    if (!accessToken) {
      throw new Error("يرجى ربط حساب Google أولاً للتصدير");
    }
    const result = await exportToGoogleDriveFile(accessToken, filename, content);
    loadExportedFiles(accessToken);
    return result;
  };

  const handleBookExportDoc = async (book: BookSummary) => {
    if (!token) {
      setStatusMsg("يرجى ربط حساب Google من القائمة العلوية أولاً");
      setStatusType("error");
      return;
    }

    setIsExporting(true);
    setStatusMsg(`جاري تصدير ملخص "${book.titleAr}" إلى Google Docs...`);
    setStatusType("");

    try {
      const formatted = formatSummaryForExport(
        book.titleAr + " (" + book.titleEn + ")",
        book.authorAr,
        book.year,
        book.categoryAr,
        book.overviewAr,
        book.keyConcepts,
        book.quotes
      );

      const result = await exportToGoogleDoc(token, book.titleAr, formatted);
      setStatusMsg(`تم التصدير بنجاح! يمكنك فتحه من الرابط: ${result.url}`);
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "فشل التصدير إلى مستندات Google");
      setStatusType("error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleBookExportDrive = async (book: BookSummary) => {
    if (!token) {
      setStatusMsg("يرجى ربط حساب Google من القائمة العلوية أولاً");
      setStatusType("error");
      return;
    }

    setIsExporting(true);
    setStatusMsg(`جاري حفظ ملف "${book.titleAr}" في Google Drive...`);
    setStatusType("");

    try {
      const formatted = formatSummaryForExport(
        book.titleAr + " (" + book.titleEn + ")",
        book.authorAr,
        book.year,
        book.categoryAr,
        book.overviewAr,
        book.keyConcepts,
        book.quotes
      );

      const result = await exportToGoogleDriveFile(token, `ملخص_${book.id}`, formatted);
      setStatusMsg(`تم حفظ الملف بنجاح! يمكنك تصفحه عبر الرابط: ${result.url}`);
      setStatusType("success");
    } catch (err: any) {
      console.error(err);
      setStatusMsg(err.message || "فشل حفظ الملف في Google Drive");
      setStatusType("error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-16">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
      />

      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100 py-10 px-4" dir="rtl">
        <div className="max-w-7xl mx-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-100 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام تلخيص وتصدير ذكي متكامل</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-900 leading-tight"
          >
            بوابة علم النفس ومصدر المستندات الذكي
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-gray-500 max-w-3xl leading-relaxed"
          >
            اكتشف أعمق المفاهيم السلوكية والفكرية من واقع أمهات كتب علم النفس الكلاسيكية
            والحديثة. تفاعل مع الخرائط الذهنية، واطرح أسئلتك على مساعد Gemini الذكي،
            وصدر ملخصاتك مباشرة بنقرة واحدة إلى Google Docs و Google Drive.
          </motion.p>
        </div>
      </div>

      {/* Status Notifications Panel */}
      {statusMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6" dir="rtl">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 rounded-2xl border text-sm flex items-start gap-3 shadow-sm ${
              statusType === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : statusType === "error"
                ? "bg-red-50 border-red-100 text-red-800"
                : "bg-blue-50 border-blue-100 text-blue-800"
            }`}
          >
            {statusType === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : statusType === "error" ? (
              <HelpCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">تحديث النظام:</p>
              {statusMsg.includes("http") ? (
                <div className="mt-1">
                  {statusMsg.split("http")[0]}
                  <a
                    href={"http" + statusMsg.split("http")[1]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold underline text-emerald-700 hover:text-emerald-950 mr-1"
                  >
                    <span>فتح الرابط المستند ↗</span>
                  </a>
                </div>
              ) : (
                <p className="mt-0.5">{statusMsg}</p>
              )}
            </div>
            <button
              onClick={() => setStatusMsg("")}
              className="text-gray-400 hover:text-gray-700 font-bold px-2"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8" dir="rtl">
        
        {/* Curated Directory & Visualizer (8 cols) */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* Books Directory Row */}
          <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-sans font-bold text-gray-800 text-md mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>المكتبة المنسقة (أبرز 5 كتب)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PSYCHOLOGY_BOOKS.map((book) => {
                const isSelected = selectedBook.id === book.id;
                return (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setStatusMsg("");
                    }}
                    className={`p-3.5 rounded-2xl text-right transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-100"
                        : "bg-gray-50 border-gray-150 text-gray-700 hover:bg-emerald-50/50 hover:border-emerald-200"
                    }`}
                  >
                    <span className="block text-[10px] font-mono opacity-80 mb-1">
                      {book.categoryAr.split(" ")[0]}
                    </span>
                    <span className="block text-xs font-bold line-clamp-2 leading-snug">
                      {book.titleAr}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Book Viewer */}
          <AnimatePresence mode="wait">
            <motion.section
              key={selectedBook.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Cover Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-8 relative">
                <div className="absolute right-0 top-0 bottom-0 left-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent"></div>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono">
                    {selectedBook.categoryAr}
                  </span>
                  <h2 className="font-sans font-extrabold text-2xl mt-3">
                    {selectedBook.titleAr}
                  </h2>
                  <p className="text-sm text-gray-300 font-sans mt-1">
                    {selectedBook.titleEn}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-gray-300">
                    <div>
                      <span className="block text-gray-400">الكاتب والمؤلف</span>
                      <span className="font-semibold text-white mt-0.5 block text-sm">
                        {selectedBook.authorAr} ({selectedBook.authorEn})
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400">سنة النشر</span>
                      <span className="font-semibold text-white mt-0.5 block text-sm flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedBook.year}م</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                
                {/* Overview */}
                <div>
                  <h3 className="font-sans font-bold text-gray-900 text-md mb-3">
                    حول مادة هذا الكتاب فكرياً
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedBook.overviewAr}
                  </p>
                </div>

                {/* Key Concepts (3 cards) */}
                <div>
                  <h3 className="font-sans font-bold text-gray-900 text-md mb-4">
                    المفاهيم والأفكار النفسية الكبرى
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedBook.keyConcepts.map((concept, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-2xl border border-gray-150 hover:border-emerald-200 transition-all duration-300"
                      >
                        <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm mb-3">
                          {getIconComponent(concept.icon)}
                        </div>
                        <h4 className="font-sans font-bold text-gray-800 text-xs mb-1">
                          {concept.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 leading-normal">
                          {concept.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Mind Map Component */}
                <MindMap
                  nodes={selectedBook.mindMapNodes}
                  edges={selectedBook.mindMapEdges}
                  bookTitle={selectedBook.titleAr}
                />

                {/* Editorial Quotes */}
                <div>
                  <h3 className="font-sans font-bold text-gray-900 text-md mb-4">
                    من أشهر اقتباسات الكتاب
                  </h3>
                  <div className="space-y-3">
                    {selectedBook.quotes.map((quote, idx) => (
                      <blockquote
                        key={idx}
                        className="bg-emerald-50/30 border-r-4 border-emerald-500 p-4 rounded-xl text-right relative overflow-hidden"
                      >
                        <span className="absolute left-4 top-2 text-6xl text-emerald-100 font-serif leading-none select-none">
                          ”
                        </span>
                        <p className="text-xs font-semibold text-gray-800 leading-relaxed relative z-10">
                          {quote.text}
                        </p>
                        <cite className="block text-[10px] text-gray-400 font-mono mt-2 not-italic relative z-10">
                          — {quote.context}
                        </cite>
                      </blockquote>
                    ))}
                  </div>
                </div>

                {/* Document Exporter Box */}
                <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-sans font-bold text-gray-800 text-xs">
                      تصدير ملخص "{selectedBook.titleAr}" إلى Google Workspace
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1">
                      انقل هذا الملخص بالكامل وبشكل منسق تلقائياً إلى مستنداتك الشخصية.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleBookExportDoc(selectedBook)}
                      disabled={isExporting}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-100 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      <span>تصدير إلى Docs</span>
                    </button>
                    <button
                      onClick={() => handleBookExportDrive(selectedBook)}
                      disabled={isExporting}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                      </svg>
                      <span>حفظ في Drive</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.section>
          </AnimatePresence>
        </main>

        {/* AI Generator & Export logs sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* AI Generator */}
          <AIAssistant
            onExportDoc={handleExportDoc}
            onExportDrive={handleExportDrive}
            isLoggedIn={!!token}
          />

          {/* Export logs (Google Drive listings) */}
          <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-bold text-gray-900 text-md flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>أرشيف التصدير المباشر</span>
              </h3>
              {token && (
                <button
                  onClick={() => loadExportedFiles(token)}
                  disabled={loadingFiles}
                  title="تحديث القائمة"
                  className="p-1 hover:bg-gray-150 rounded-lg text-gray-400 hover:text-gray-700 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? "animate-spin" : ""}`} />
                </button>
              )}
            </div>

            {token ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {loadingFiles && exportedFiles.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-gray-400 text-xs gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    <span>جاري تحديث سجلات التصدير...</span>
                  </div>
                ) : exportedFiles.length > 0 ? (
                  exportedFiles.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-200 block transition-all group"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {file.mimeType.includes("document") ? (
                            <FileText className="w-4 h-4 text-blue-500" />
                          ) : (
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-indigo-500">
                              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-gray-800 truncate leading-tight group-hover:text-emerald-700">
                            {file.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">
                            {new Date(file.createdTime).toLocaleDateString("ar-EG", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-emerald-500 shrink-0 mt-0.5" />
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    <p>لا توجد ملفات مصدرة حالياً.</p>
                    <p className="text-[10px] text-gray-300 mt-1">
                      صدر ملخصاً من الأعلى لتظهر ملفاتك هنا!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                <div className="bg-gray-100 text-gray-400 p-3 rounded-full mb-3 shadow-inner">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-xs text-gray-700">الأرشيف مغلق حالياً</h4>
                <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed max-w-[200px] mx-auto">
                  قم بربط حساب Google الخاص بك لاستعراض سجلات التصدير السابقة وإدارة ملفاتك.
                </p>
              </div>
            )}
          </section>

        </aside>

      </div>
    </div>
  );
}
