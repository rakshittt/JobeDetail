"use client";
import { useState } from "react";
import Loader from "@/components/Loader";
import CompanySummary from "@/app/dashboard/CompanySummary";

export default function CompanySearch() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Something went wrong.");
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ margin: "2rem 0" }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", maxWidth: 500 }}>
        <input
          type="text"
          placeholder="Paste job link or enter company name"
          value={input}
          onChange={e => setInput(e.target.value)}
          required
          style={{ flex: 1, padding: "0.75rem", borderRadius: "5px", border: "1px solid #ddd" }}
        />
        <button type="submit" style={{ background: "#FF5A5F", color: "#fff", border: "none", borderRadius: "5px", padding: "0.75rem 1.5rem" }}>
          Search
        </button>
      </form>
      {loading && <Loader />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <CompanySummary {...result} />}
    </section>
  );
}
