import { NextResponse } from "next/server";

const HF_MODEL = "Qwen/Qwen3-4B-Instruct-2507:nscale";

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first === -1 || last === -1) {
    throw new Error("AI returned invalid JSON.");
  }

  return JSON.parse(cleaned.slice(first, last + 1));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const paper = String(body.text || "").trim();
    const repoUrl = String(body.repoUrl || "").trim();
    const repoEvidence = String(body.repoEvidence || "").trim();

    if (paper.length < 50) {
      return NextResponse.json(
        { error: "Please provide more research paper text." },
        { status: 400 }
      );
    }

    if (!repoUrl) {
      return NextResponse.json(
        { error: "GitHub repository URL is required." },
        { status: 400 }
      );
    }

    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { error: "HF_TOKEN is not configured." },
        { status: 500 }
      );
    }

    const prompt = `
You are ReproCheck, an AI research reproducibility investigator.

Your job is to investigate whether a research paper's important claims
have sufficient implementation and experimental evidence.

You are given:
1. Research paper text.
2. A GitHub repository URL.
3. Repository evidence supplied by the user.

IMPORTANT RULES:

- Never claim that an experiment was successfully reproduced unless actual
  execution evidence is supplied.
- Never invent repository files, results, datasets, configurations,
  dependencies, hardware, or metrics.
- "Not found" is NOT the same as "false".
- If evidence is missing, mark the claim "Not verified".
- If paper and repository evidence disagree, mark it "Conflicting evidence".
- Use "Supported" only when the supplied repository evidence actually
  supports the claim.
- Use "Partially supported" when only part of a claim is supported.
- Dataset reproducibility is especially important.
- Be conservative and evidence-driven.

RESEARCH PAPER:
${paper.slice(0, 30000)}

GITHUB REPOSITORY:
${repoUrl}

SUPPLIED REPOSITORY EVIDENCE:
${repoEvidence.slice(0, 18000) || "No repository evidence was supplied."}

CLAIM ANALYSIS:

Extract the most important 4-6 experimental or methodological claims
from the paper.

Examples of useful claims:
- reported metric/result
- dataset used
- dataset version
- preprocessing procedure
- important hyperparameters
- training duration
- hardware requirements
- evaluation procedure
- model configuration

For every claim:

1. State the claim precisely.
2. Identify the relevant evidence from the supplied repository evidence.
3. If the evidence supports it, use "Supported".
4. If only part is supported, use "Partially supported".
5. If the paper makes the claim but repository evidence does not verify it,
   use "Not verified".
6. If repository evidence contradicts the paper, use "Conflicting evidence".

Do NOT treat generic statements such as "the repository supports Transformer"
as evidence that a specific numerical result was reproduced.

Return ONLY valid JSON with this exact structure:

{
  "title": "paper title",

  "status": "Likely reproducible | Partially reproducible | Blocked | Insufficient evidence",

  "summary": "2-4 sentence evidence-based assessment",

  "claims": [
    {
      "claim": "specific paper claim",
      "evidence": "specific repository evidence or 'No supporting repository evidence found'",
      "status": "Supported | Partially supported | Not verified | Conflicting evidence"
    }
  ],

  "datasets": [
    "dataset names identified in the paper"
  ],

  "datasetStatus": "Reproducible | Partially reproducible | Blocked | Not verified",

  "datasetDetails": "Explain dataset source, version, preprocessing, access and missing information.",

  "evidence": [
    "concrete evidence found in the supplied repository evidence"
  ],

  "blockers": [
    "specific reproducibility blockers"
  ],

  "inconsistencies": [
    "specific paper/code inconsistencies, or 'No explicit paper/code inconsistencies were identified from the supplied evidence.'"
  ],

  "environment": "hardware, dependencies, framework, versions and configuration actually evidenced"
}
`;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: HF_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a careful scientific reproducibility investigator. Return valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 2200,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Hugging Face error:", data);

      return NextResponse.json(
        {
          error:
            data?.error ||
            "The open-weight AI model could not complete the investigation.",
        },
        { status: 502 }
      );
    }

    const aiText = data?.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error("No AI analysis was returned.");
    }

    const result = extractJson(aiText);

    // Defensive normalization so the UI always has these sections.
    result.claims = Array.isArray(result.claims)
      ? result.claims
      : [];

    result.datasets = Array.isArray(result.datasets)
      ? result.datasets
      : [];

    result.evidence = Array.isArray(result.evidence)
      ? result.evidence
      : [];

    result.blockers = Array.isArray(result.blockers)
      ? result.blockers
      : [];

    result.inconsistencies = Array.isArray(result.inconsistencies)
      ? result.inconsistencies
      : [
          "No explicit paper/code inconsistencies were identified from the supplied evidence.",
        ];

    return NextResponse.json(result);
  } catch (error) {
    console.error("ReproCheck error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}