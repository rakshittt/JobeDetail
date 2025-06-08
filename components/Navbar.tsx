"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "#fff",
      borderBottom: "1px solid #eee"
    }}>
      <Link href="/" style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#FF5A5F", textDecoration: "none" }}>
        JobeDetail
      </Link>
      <div>
        {session ? (
          <>
            <Link href="/dashboard" style={{ marginRight: "1rem" }}>Dashboard</Link>
            <button onClick={() => signOut()} style={{ background: "#FF5A5F", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link href="/auth/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
