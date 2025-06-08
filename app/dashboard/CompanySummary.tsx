"use client";
import { useState } from "react";
import CompanyCard from "@/components/CompanyCard";
import Loader from "@/components/Loader";

export default function CompanySummary({ companyData, summary }: any) {
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setQuestions(null);
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName: companyData.name, companySummary: summary }),
    });
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>Company Summary</h3>
      <CompanyCard company={companyData} summary={summary} />
      <div style={{ marginTop: "1.5rem" }}>
        <button
          onClick={fetchQuestions}
          style={{
            background: "#00A699",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          Generate Custom Interview Questions
        </button>
        {loading && <Loader />}
        {questions && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Suggested Interview Questions</h4>
            <ol>
              {questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
