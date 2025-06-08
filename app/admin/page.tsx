"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   // Replace with your admin check logic
  //   if (status === "authenticated" && session.user.role !== "admin") {
  //     router.push("/");
  //   }
  // }, [status, session, router]);

  // if (status === "loading") return <p>Loading...</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <p>Manage users, subscriptions, and analytics here.</p>
      {/* Add tables for users, subscriptions, etc. */}
    </main>
  );
}
