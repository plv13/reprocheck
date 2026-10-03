"use client";

import { useState } from "react";

interface Claim {
  claim: string;
  evidence: string;
  status:
    | "Supported"
    | "Partially supported"
    | "Not verified"
    | "Conflicting evidence";
}

interface Result {
  title?: string;
  status?: string;
  summary?: string;
  claims?: Claim[];
  datasets?: string[];
  datasetStatus?: string;
  datasetDetails?: string;
  evidence?: string[];
  blockers?: string[];
  inconsistencies?: string[];
  environment?: string;
}

export default function Home() {
  const [paper, setPaper] = useState("");
  const [repo, setRepo] = useState("");
  const [repoEvidence, setRepoEvidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const investigate = async () => {
    if (!paper.trim()) {
      setError("Paste the research paper text first.");
      return;
    }

    if (!repo.trim()) {
      setError("Enter the GitHub repository URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: paper,
          repoUrl: repo,
          repoEvidence,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Investigation failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const claims = result?.claims || [];

  const supportedClaims = claims.filter(
    (claim) =>
      claim.status === "Supported" ||
      claim.status === "Partially supported"
  ).length;

  const evidenceCoverage =
    claims.length > 0
      ? Math.round((supportedClaims / claims.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              ReproCheck
            </h1>

            <p className="text-sm text-zinc-400 mt-1">
              AI research reproducibility investigator
            </p>
          </div>

          <span className="hidden sm:block text-xs text-zinc-500">
            Open-weight AI • Hackathon MVP
          </span>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-blue-900 bg-blue-950/30 px-3 py-1 text-xs text-blue-300 mb-4">
            Evidence-first research auditing
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Can this research actually be reproduced?
          </h2>

          <p className="mt-4 text-zinc-400 max-w-3xl text-base leading-relaxed">
            ReproCheck traces important paper claims against available
            implementation evidence, datasets, configuration and
            experimental details. It separates what is supported from
            what remains unverified.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* INPUT */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">
                Investigation inputs
              </h3>

              <span className="text-xs text-zinc-500">
                Step 1
              </span>
            </div>

            <label className="block text-sm font-semibold mt-5">
              Research paper
            </label>

            <textarea
              value={paper}
              onChange={(e) => setPaper(e.target.value)}
              placeholder="Paste the research paper text..."
              className="mt-2 w-full h-64 rounded-xl bg-zinc-950 border border-zinc-700 p-4 text-sm resize-none outline-none focus:border-blue-500"
            />

            <label className="block text-sm font-semibold mt-5">
              GitHub repository
            </label>

            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="mt-2 w-full rounded-xl bg-zinc-950 border border-zinc-700 p-3 text-sm outline-none focus:border-blue-500"
            />

            <label className="block text-sm font-semibold mt-5">
              Repository evidence
            </label>

            <p className="text-xs text-zinc-500 mt-1">
              Paste README text, relevant files, configuration or
              other repository evidence.
            </p>

            <textarea
              value={repoEvidence}
              onChange={(e) => setRepoEvidence(e.target.value)}
              placeholder={`Example:

README:
Transformer implementation for WMT14.

Files:
transformer.py
train.py
config.yaml
requirements.txt
data/README.md

Config:
batch_size: 4096
learning_rate: 0.0005

Dataset:
WMT14 EN-DE and EN-FR
`}
              className="mt-2 w-full h-44 rounded-xl bg-zinc-950 border border-zinc-700 p-4 text-sm resize-none outline-none focus:border-blue-500"
            />

            {error && (
              <div className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={investigate}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3.5 font-semibold transition"
            >
              {loading
                ? "Investigating evidence..."
                : "Investigate Reproducibility"}
            </button>
          </div>

          {/* RESULTS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            {!result && !loading && (
              <div className="min-h-[600px] flex items-center justify-center text-center">
                <div>
                  <div className="text-5xl mb-5">
                    🔬
                  </div>

                  <h3 className="font-semibold text-xl">
                    Reproduction report
                  </h3>

                  <p className="text-sm text-zinc-500 mt-2 max-w-sm">
                    Your evidence-based investigation will appear here.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-5 animate-pulse">
                    🔎
                  </div>

                  <p className="font-semibold text-lg">
                    Investigating evidence...
                  </p>

                  <p className="text-sm text-zinc-500 mt-2">
                    Qwen is tracing paper claims against the supplied
                    repository evidence.
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-5">
                {/* TITLE */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Paper
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    {result.title || "Research paper"}
                  </h3>
                </div>

                {/* STATUS */}
                <div className="rounded-xl border border-blue-900 bg-blue-950/30 p-4">
                  <p className="text-xs uppercase text-blue-400 font-bold">
                    Overall status
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {result.status ||
                      "Insufficient evidence"}
                  </p>
                </div>

                {/* EVIDENCE COVERAGE */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Evidence coverage
                      </p>

                      <h4 className="font-bold mt-1">
                        Claim evidence coverage
                      </h4>
                    </div>

                    <span className="text-2xl font-bold">
                      {evidenceCoverage}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{
                        width: `${evidenceCoverage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-zinc-500">
                    {supportedClaims} of {claims.length} extracted
                    claims have supporting or partial repository evidence.
                  </p>
                </div>

                {/* SUMMARY */}
                <div>
                  <h4 className="font-bold">
                    Summary
                  </h4>

                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    {result.summary ||
                      "No summary returned."}
                  </p>
                </div>

                {/* CLAIM → EVIDENCE */}
                <div className="rounded-xl border border-blue-900 bg-blue-950/20 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-blue-300">
                      Claim → Evidence
                    </h4>

                    <span className="text-xs text-zinc-500">
                      {claims.length} claims traced
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {claims.length > 0 ? (
                      claims.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold leading-relaxed">
                              {item.claim}
                            </p>

                            <span
                              className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${
                                item.status === "Supported"
                                  ? "bg-emerald-950 text-emerald-300"
                                  : item.status ===
                                    "Conflicting evidence"
                                  ? "bg-red-950 text-red-300"
                                  : "bg-amber-950 text-amber-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <div className="mt-3 text-xs text-zinc-500 leading-relaxed">
                            <span className="text-zinc-400 font-semibold">
                              Evidence:
                            </span>{" "}
                            {item.evidence}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No claims could be traced from the supplied
                        evidence.
                      </p>
                    )}
                  </div>
                </div>

                {/* DATASET */}
                <div className="rounded-xl border border-amber-900 bg-amber-950/20 p-4">
                  <h4 className="font-bold text-amber-300">
                    Dataset reproducibility
                  </h4>

                  <p className="mt-2 font-semibold">
                    {result.datasetStatus ||
                      "Not verified"}
                  </p>

                  <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                    {result.datasetDetails ||
                      "No dataset details returned."}
                  </p>

                  {result.datasets &&
                  result.datasets.length > 0 ? (
                    <ul className="mt-3 list-disc list-inside text-sm text-zinc-300">
                      {result.datasets.map((dataset, i) => (
                        <li key={i}>
                          {dataset}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* EVIDENCE */}
                <div>
                  <h4 className="font-bold">
                    Evidence found
                  </h4>

                  <ul className="mt-2 space-y-2 text-sm text-zinc-400">
                    {result.evidence &&
                    result.evidence.length > 0 ? (
                      result.evidence.map((item, i) => (
                        <li key={i}>
                          • {item}
                        </li>
                      ))
                    ) : (
                      <li>
                        • No concrete repository evidence was returned.
                      </li>
                    )}
                  </ul>
                </div>

                {/* BLOCKERS */}
                <div>
                  <h4 className="font-bold">
                    Reproducibility blockers
                  </h4>

                  <ul className="mt-2 space-y-2 text-sm text-red-300">
                    {result.blockers &&
                    result.blockers.length > 0 ? (
                      result.blockers.map((item, i) => (
                        <li key={i}>
                          • {item}
                        </li>
                      ))
                    ) : (
                      <li>
                        • No blockers identified.
                      </li>
                    )}
                  </ul>
                </div>

                {/* INCONSISTENCIES */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                  <h4 className="font-bold text-purple-300">
                    Paper / code inconsistencies
                  </h4>

                  <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                    {result.inconsistencies &&
                    result.inconsistencies.length > 0 ? (
                      result.inconsistencies.map((item, i) => (
                        <li key={i}>
                          • {item}
                        </li>
                      ))
                    ) : (
                      <li>
                        • No explicit paper/code inconsistencies
                        were identified from the supplied evidence.
                      </li>
                    )}
                  </ul>
                </div>

                {/* ENVIRONMENT */}
                <div>
                  <h4 className="font-bold">
                    Environment
                  </h4>

                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {result.environment ||
                      "Environment details were not verified."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-xs text-zinc-600 text-center">
        ReproCheck • Evidence-first research reproducibility analysis
        using an open-weight Qwen model
      </footer>
    </main>
  );
}