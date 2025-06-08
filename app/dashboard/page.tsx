"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CompanySearch from "./CompanySearch";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    // ...existing code for search history
    const fetchSaved = async () => {
        const res = await fetch("/api/saved");
        if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
        }
    };
    if (status === "authenticated") fetchSaved();
  }, [status, router]);

  // Fetch search history
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    // Fetch search history
    const fetchHistory = async () => {
      const res = await fetch("/api/searches");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.searches);
      }
    };
    if (status === "authenticated") fetchHistory();
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <h2>Dashboard</h2>
        <p>Welcome, {session?.user?.name || session?.user?.email}!</p>
        <CompanySearch />
        <hr style={{ margin: "2rem 0" }} />
        <h3>Your Recent Searches</h3>
        <ul>
          {history.map((s, i) => (
            <li key={i}>{s.company} <span style={{ color: "#888" }}>({new Date(s.createdAt).toLocaleString()})</span></li>
          ))}
        </ul>
        <hr style={{ margin: "2rem 0" }} />
        <h3>Your Saved Companies</h3>
        <ul>
        {saved.map((s, i) => (
            <li key={i}>{s.company} <span style={{ color: "#888" }}>({new Date(s.createdAt).toLocaleString()})</span></li>
        ))}
        </ul>
      </main>
    </>
  );
}
