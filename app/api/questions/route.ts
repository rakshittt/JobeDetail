import { NextRequest, NextResponse } from "next/server";
import { summarizeCompany } from "@/lib/openai"; // Already used for company summary
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

// Simulated fallback in case OpenAI API key is not set
function generateInterviewQuestionsSimulated(companyName: string, companySummary: string) {
  return [
    `What are the key challenges ${companyName} is currently facing in the industry?`,
    `How does ${companyName} foster innovation and creativity among its employees?`,
    `Can you describe the company culture at ${companyName} and how it impacts daily work?`,
    `What recent projects or initiatives at ${companyName} are you most excited about?`,
    `How does ${companyName} support professional growth and development for its team members?`
  ];
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { companyName, companySummary } = await req.json();
  if (!companyName || !companySummary) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Use OpenAI if key is set, else simulate
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ questions: generateInterviewQuestionsSimulated(companyName, companySummary) });
  }

  // Use OpenAI API to generate questions
  try {
    const prompt = `
      Generate 5 insightful interview questions for a job seeker interviewing at ${companyName}.
      Consider the following company summary for context:
      ${companySummary}
    `;
    const openai = require("openai");
    const client = new openai.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    });
    const questionsText = response.choices[0].message.content;
    const questions = questionsText
      .split('\n')
      .map((q: string) => q.replace(/^- /, '').trim())
      .filter(Boolean);
    return NextResponse.json({ questions });
  } catch (err) {
    // Fallback to simulated
    return NextResponse.json({ questions: generateInterviewQuestionsSimulated(companyName, companySummary) });
  }
}
