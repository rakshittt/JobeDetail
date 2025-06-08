import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Sign Up</h2>
      <AuthForm mode="register" />
    </>
  );
}