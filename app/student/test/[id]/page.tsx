"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import { 
  getInternshipById, 
  getQuestions, 
  saveTestResult, 
  Internship, 
  Question 
} from "@/lib/supabase/db";
import { 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const internshipId = params.id as string;

  const [user, setUser] = useState<UserSession | null>(null);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Test state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)
  const [cheatingCount, setCheatingCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch data
  useEffect(() => {
    async function loadTest() {
      if (!internshipId) return;
      try {
        const u = await getCurrentUser();
        if (!u) {
          router.push("/auth/login");
          return;
        }
        setUser(u);

        const [int, qList] = await Promise.all([
          getInternshipById(internshipId),
          getQuestions(internshipId),
        ]);

        if (!int) {
          router.push("/student/dashboard");
          return;
        }

        setInternship(int);
        setQuestions(qList);
      } catch (err) {
        console.error("Error loading test data", err);
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [internshipId]);

  // Submit test — defined with useCallback so effects always get a fresh, stable reference
  const submitTestResultData = useCallback(async (forcedByCheating = false) => {
    if (submitting || !user || questions.length === 0) return;
    setSubmitting(true);

    try {
      // 1. Calculate Score
      let correctCount = 0;
      questions.forEach((q) => {
        const studentAns = answers[q.id];
        if (studentAns !== undefined && studentAns === q.correct_option_index) {
          correctCount++;
        }
      });

      // Forced submission by cheating → instant fail score
      if (forcedByCheating) {
        correctCount = 0;
      }

      const total = questions.length;
      const percentage = total > 0 ? (correctCount / total) * 100 : 0;
      const passed = percentage >= 70;

      // 2. Save result (with automatic mock fallback in saveTestResult)
      const resultObj = await saveTestResult({
        student_id: user.id,
        internship_id: internshipId,
        score: correctCount,
        total_questions: total,
        percentage,
        passed,
        completed_at: new Date().toISOString(),
      });

      if (!resultObj || !resultObj.id) {
        throw new Error("Test result was not saved correctly. Please try again.");
      }

      // 3. Redirect to results
      router.push(`/student/results/${resultObj.id}`);
    } catch (err: any) {
      console.error("Error submitting test:", err?.message || err);
      alert(`Submission failed: ${err?.message || "Unknown error"}. Please try again.`);
      setSubmitting(false);
    }
  }, [submitting, user, questions, answers, internshipId, router]);

  // Tab switching / Cheating detection
  useEffect(() => {
    if (loading || submitting || questions.length === 0) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatingCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert("Maximum tab-switches reached. Your test is being auto-submitted.");
            submitTestResultData(true);
          } else {
            alert(`Warning: Tab switching detected! (${newCount}/3). Subsequent violations will trigger automatic failure/submission.`);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loading, submitting, questions, submitTestResultData]);

  // Countdown timer
  useEffect(() => {
    if (loading || submitting) return;

    if (timeLeft <= 0) {
      alert("Time is up! Your assessment will be submitted automatically.");
      submitTestResultData();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, submitting, submitTestResultData]);

  const selectOption = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-slate-50 min-h-screen">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto mb-4" />
          <p className="text-zinc-550 text-sm font-medium">Preparing assessment environment...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 p-4">
        <div className="glass-panel rounded-3xl border border-zinc-200 p-8 max-w-md text-center bg-white shadow-sm">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-zinc-900 mb-2">No Questions Available</h2>
          <p className="text-xs text-zinc-500 mb-6 font-light">This internship track currently does not have any active evaluation questions.</p>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-600 px-4 py-2 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIdx === totalQuestions - 1;

  // Circular timer calculations
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (timeLeft / 300) * circumference;

  return (
    <div className="space-y-6 relative z-10 text-zinc-800">
      {/* Top Header/Status Panel */}
      <div className="glass-panel rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white shadow-sm border border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-bold text-red-600 tracking-wider uppercase">Live Assessment Mode</span>
        </div>
        <div className="text-center">
          <h1 className="text-sm font-extrabold text-zinc-900 max-w-xs sm:max-w-md truncate">{internship?.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 flex items-center justify-center">
            <svg className="absolute transform -rotate-90 w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="16"
                className="stroke-zinc-100"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                className={`timer-circle transition-all duration-1000 ${timeLeft < 60 ? "stroke-red-500" : "stroke-indigo-600"}`}
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className={`text-[10px] font-mono font-bold ${timeLeft < 60 ? "text-red-650 animate-pulse" : "text-indigo-650"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Question Box */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 relative flex flex-col bg-white border border-zinc-200/80 shadow-md">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
                1 Mark
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-6 leading-relaxed">
              {currentQuestion.question_text}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => selectOption(currentQuestion.id, idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-250 text-indigo-700 font-bold shadow-sm"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300"
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "border-indigo-500 bg-indigo-50" : "border-zinc-300"
                    }`}>
                      {isSelected && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
              <button
                onClick={() => setCurrentIdx((p) => p - 1)}
                disabled={currentIdx === 0}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => submitTestResultData(false)}
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Assessment"}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIdx((p) => p + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-650 hover:bg-indigo-650 hover:text-white px-5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 px-2">
            {questions.map((_, idx) => {
              const isAnswered = answers[questions[idx].id] !== undefined;
              const isCurrent = currentIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-2 flex-grow rounded-full transition-all cursor-pointer ${
                    isCurrent 
                      ? "bg-indigo-650" 
                      : isAnswered 
                        ? "bg-indigo-200" 
                        : "bg-zinc-200"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
