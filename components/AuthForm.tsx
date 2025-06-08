"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (mode === "register") {
      try {
        // Call registration API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
          headers: { "Content-Type": "application/json" },
        });
        
        const data = await res.json();
        
        if (res.ok) {
          await signIn("credentials", { email, password, redirect: false });
          router.push("/dashboard");
        } else {
          setError(data.error || "Registration failed.");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      }
    } else {
      // Login
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Invalid credentials.");
      else router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {mode === "register" && (
        <input
          required
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      )}
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        required
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        minLength={8}
      />
      <button type="submit" style={{ background: "#FF5A5F", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "5px", fontWeight: "bold" }}>
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </form>
  );
}
