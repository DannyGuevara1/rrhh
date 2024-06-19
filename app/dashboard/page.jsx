"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirige al login si no hay token
    }
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>

    
  );
}
