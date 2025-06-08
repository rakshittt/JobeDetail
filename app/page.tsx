import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ color: "#FF5A5F" }}>JobeDetail</h1>
        <p>
          Instantly get company insights, culture, funding, reviews, and custom interview questions for any job application.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <a href="/auth/login" style={{
            background: "#FF5A5F", color: "#fff", padding: "0.75rem 2rem", borderRadius: "5px", textDecoration: "none", fontWeight: "bold"
          }}>Get Started</a>
        </div>
      </main>
    </>
  );
}
