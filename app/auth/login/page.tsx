import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Login</h2>
      <AuthForm mode="login" />
    </>
  );
}
