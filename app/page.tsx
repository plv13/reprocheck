"use client";

import { useState } from "react";

// Sample research paper abstract for quick testing during hackathon demos
const SAMPLE_PAPER = `Title: Attention Is All You Need (Vaswani et al.)

Abstract:
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.

Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs.`;

interface AnalysisResult {
  title: string;
  summary: string;
  keyFindings: string[];
  methodology: string;
  limitations: string[];
}

export default function Home() {
  const [paperText, setPaperText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Compute word and character counts dynamically
  const wordCount = paperText.trim() ? paperText.trim().split(/\s+/).length : 0;
  const charCount = paperText.length;

  const handlePasteSample = () => {
    setPaperText(SAMPLE_PAPER);
    setError(null);
  };

  const handleClear = () => {
    setPaperText("");
    setResult(null);
    setError(null);
  };

  const handleAnalyze = () => {
    if (!paperText.trim()) {
      setError("Please paste or type some research paper text first.");
      return;
    }

    if (paperText.trim().length < 50) {
      setError("Text is too short. Please provide a longer excerpt or abstract (at least 50 characters).");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult(null);

    // Simulate an AI analysis process with a short delay (e.g., 900ms)
    // This will be replaced with a real AI API call later.
    setTimeout(() => {
      setIsLoading(false);
      setResult({
        title: paperText.includes("Attention Is All You Need")
          ? "Attention Is All You Need (Analysis)"
          : "Research Paper Analysis",
        summary:
          "The paper introduces an innovative architectural paradigm that replaces recurrent and convolutional neural structures with multi-head self-attention mechanisms, significantly improving training parallelization and benchmark accuracy.",
        keyFindings: [
          "Demonstrates that pure attention mechanisms can outperform recurrent networks in sequence transduction tasks.",
          "Achieves state-of-the-art translation performance on WMT 2014 English-to-German (28.4 BLEU) and English-to-French (41.8 BLEU).",
          "Substantially reduces training time compared to previous architectures (trained in 3.5 days on 8 GPUs).",
        ],
        methodology:
          "Encoder-decoder architecture utilizing stacked multi-head self-attention and point-wise fully connected layers without recurrence or convolutions.",
        limitations: [
          "Self-attention computation scales quadratically O(n²) with sequence length.",
          "Tested primarily on machine translation tasks; generalizability to other modalities requires further evaluation.",
        ],
      });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
      {/* Top Navigation / Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white font-bold shadow-sm">
              ✈️
            </span>
            <div>
              <span className="font-bold text-lg tracking-tight">PaperPilot</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                MVP Demo
              </span>
            </div>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Hackathon Edition
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Understand Research Papers in Seconds
          </h1>
          <p className="mt-2 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Paste any abstract, introduction, or paper excerpt below. PaperPilot
            extracts key findings, methodology, and limitations instantly.
          </p>
        </section>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Paper Input
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteSample}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Paste Sample Paper
                </button>
                {paperText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs font-medium text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors cursor-pointer ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={paperText}
                onChange={(e) => {
                  setPaperText(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste the title, abstract, or text from any research paper here..."
                rows={12}
                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y text-sm leading-relaxed"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                ⚠️ {error}
              </div>
            )}

            {/* Footer with stats & button */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                <span>{wordCount} words</span>
                <span className="mx-2">•</span>
                <span>{charCount} characters</span>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>Analyze Paper</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output / Insights Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Insights & Summary
                </h2>
                {result && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                    Analysis Complete
                  </span>
                )}
              </div>

              {/* State 1: Loading Skeleton */}
              {isLoading && (
                <div className="space-y-4 py-8 animate-pulse">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                  </div>
                  <div className="h-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-4 mt-4" />
                  <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
                    Parsing sections and extracting key insights...
                  </div>
                </div>
              )}

              {/* State 2: No Analysis Yet (Empty State) */}
              {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center text-center py-16 px-4 text-zinc-400 dark:text-zinc-500">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl mb-3">
                    📄
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    No Analysis Generated Yet
                  </h3>
                  <p className="text-xs max-w-sm">
                    Paste your paper text on the left and click{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      &quot;Analyze Paper&quot;
                    </strong>{" "}
                    to see instant takeaways. Or click &quot;Paste Sample Paper&quot; for a quick test.
                  </p>
                </div>
              )}

              {/* State 3: Analysis Results */}
              {!isLoading && result && (
                <div className="space-y-5">
                  {/* Title & TL;DR */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1">
                      <span>📌</span>
                      <span>TL;DR Summary</span>
                    </div>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>

                  {/* Key Contributions */}
                  <div>
                    <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Key Findings & Contributions</span>
                    </h3>
                    <ul className="space-y-2">
                      {result.keyFindings.map((finding, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800"
                        >
                          <span className="text-blue-500 font-bold shrink-0">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Methodology */}
                  <div>
                    <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <span>🔬</span>
                      <span>Methodology</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 leading-relaxed">
                      {result.methodology}
                    </p>
                  </div>

                  {/* Limitations */}
                  <div>
                    <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>Limitations & Notes</span>
                    </h3>
                    <ul className="space-y-1.5">
                      {result.limitations.map((limitation, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2"
                        >
                          <span className="text-amber-500 shrink-0 font-bold">›</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom note for hackathon reviewer / user */}
            <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
              <span>PaperPilot Interface v0.1</span>
              <span>Next step: AI API integration</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
