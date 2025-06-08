import { NextRequest, NextResponse } from "next/server";
import { getCrunchbaseProfile, getGlassdoorReviews, getCompanyNews } from "@/lib/externalApi";
import { summarizeCompany } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { input } = await req.json();
  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  try {
    // 1. Get company profile from Crunchbase
    const profile = await getCrunchbaseProfile(input);

    // 2. Glassdoor reviews (by name)
    let glassdoor = null;
    try {
      glassdoor = await getGlassdoorReviews(profile.name);
    } catch (e) {
      glassdoor = null; // Not fatal if not found
    }

    // 3. News
    let news = [];
    try {
      news = await getCompanyNews(profile.name);
    } catch (e) {
      news = [];
    }

    // 4. Compose companyData object
    const companyData = {
      name: profile.name,
      industry: profile.industry,
      size: profile.size,
      hq: profile.hq,
      culture: glassdoor?.culture || "N/A",
      funding: profile.funding.length > 0 ? profile.funding[0].money_raised : "N/A",
      glassdoor: glassdoor
        ? {
            rating: glassdoor.rating,
            reviews: glassdoor.reviews,
            highlights: glassdoor.highlights,
          }
        : null,
      news,
    };

    // 5. Summarize with OpenAI
    const summary = await summarizeCompany(companyData);

    // 6. Store search in DB
    await prisma.search.create({
      data: {
        user: { connect: { email: session.user.email } },
        company: companyData.name,
      },
    });

    return NextResponse.json({ summary, companyData });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch company data" }, { status: 500 });
  }
}
