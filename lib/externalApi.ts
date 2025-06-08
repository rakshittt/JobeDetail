// CRUNCHBASE Company Profile & Funding
export async function getCrunchbaseProfile(companyName: string) {
    // You may need to search for the company first to get its permalink
    const searchUrl = `https://api.crunchbase.com/v4/entities/organizations?query=${encodeURIComponent(companyName)}&user_key=${process.env.CRUNCHBASE_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error('Crunchbase search error');
    const searchData = await searchRes.json();
    const org = searchData.entities?.[0];
    if (!org) throw new Error('Company not found in Crunchbase');
    // Fetch detailed profile
    const profileUrl = `https://api.crunchbase.com/v4/data/entities/organizations/${org.permalink}?card_ids=raised_funding_rounds&user_key=${process.env.CRUNCHBASE_API_KEY}`;
    const profileRes = await fetch(profileUrl);
    if (!profileRes.ok) throw new Error('Crunchbase profile error');
    const profileData = await profileRes.json();
    return {
      name: org.name,
      industry: org.categories?.[0]?.name || "N/A",
      size: org.num_employees_enum || "N/A",
      hq: org.location_identifiers?.[0]?.value || "N/A",
      funding: profileData.data?.cards?.raised_funding_rounds || [],
      permalink: org.permalink,
    };
  }
  
  // GLASSDOOR Reviews
  export async function getGlassdoorReviews(companyName: string) {
    // You may need to search for the company to get its employerId
    const searchUrl = `http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=${process.env.GLASSDOOR_PARTNER_ID}&t.k=${process.env.GLASSDOOR_API_KEY}&action=employers&q=${encodeURIComponent(companyName)}&userip=${process.env.GLASSDOOR_USER_IP}&useragent=Mozilla/4.0`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error('Glassdoor search error');
    const searchData = await searchRes.json();
    const employer = searchData.response?.employers?.[0];
    if (!employer) throw new Error('Company not found on Glassdoor');
    return {
      rating: employer.overallRating,
      reviews: employer.numberOfRatings,
      highlights: [
        employer.featuredReview?.headline,
        employer.featuredReview?.pros,
      ].filter(Boolean),
      culture: employer.cultureAndValuesRating,
      employerId: employer.id,
    };
  }
  
  // NEWSAPI for Company News
  export async function getCompanyNews(companyName: string) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(companyName)}&apiKey=${process.env.NEWSAPI_KEY}&language=en&sortBy=publishedAt&pageSize=5`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('NewsAPI error');
    const data = await res.json();
    return data.articles.map((n: any) => ({
      title: n.title,
      url: n.url,
    }));
  }
  