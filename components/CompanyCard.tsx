"use client";
import { useState, useEffect } from "react";

export default function CompanyCard({ company, summary }: any) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if company is already saved
  useEffect(() => {
    async function checkSaved() {
      const res = await fetch("/api/saved");
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved.some((s: any) => s.company === company.name));
      }
    }
    checkSaved();
  }, [company.name]);

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/saved", {
      method: saved ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: company.name }),
    });
    if (res.ok) setSaved(!saved);
    setLoading(false);
  };

  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: "8px",
      padding: "1.5rem",
      background: "#fff",
      marginBottom: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ color: "#FF5A5F" }}>{company.name}</h4>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            background: saved ? "#00A699" : "#FF5A5F",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <p><b>Industry:</b> {company.industry}</p>
      <p><b>Size:</b> {company.size}</p>
      <p><b>Headquarters:</b> {company.hq}</p>
      <p><b>Culture:</b> {company.culture}</p>
      <p><b>Funding:</b> {company.funding}</p>
      <p><b>Glassdoor:</b> {company.glassdoor.rating} ⭐ ({company.glassdoor.reviews} reviews)</p>
      <p><b>Highlights:</b> {company.glassdoor.highlights.join(", ")}</p>
      <p><b>Recent News:</b></p>
      <ul>
        {company.news.map((n: any, i: number) => (
          <li key={i}><a href={n.url} target="_blank">{n.title}</a></li>
        ))}
      </ul>
      <hr style={{ margin: "1rem 0" }} />
      <p><b>Summary:</b> {summary}</p>
    </div>
  );
}
