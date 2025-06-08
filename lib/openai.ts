import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizeCompany(companyData: any) {
  const prompt = `
    Summarize the following company for a job seeker interview prep:
    Name: ${companyData.name}
    Industry: ${companyData.industry}
    Size: ${companyData.size}
    HQ: ${companyData.hq}
    Culture: ${companyData.culture}
    Funding: ${companyData.funding}
    Glassdoor: rating ${companyData.glassdoor.rating}, highlights: ${companyData.glassdoor.highlights.join(", ")}
    News: ${companyData.news.map((n:any) => n.title).join("; ")}
    Respond in 3-4 sentences.
  `;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 120,
  });
  return completion.choices[0].message.content;
}
