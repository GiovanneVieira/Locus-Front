// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardSkeleton } from "@/components/skeleton/DashboardSkeleton";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Marca o sinal de que agora estamos autenticados
    localStorage.setItem('auth_signal', 'true');

    // 2. Pequeno delay apenas para garantir que o cookie foi processado pelo browser
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Enquanto processa, você pode mostrar seu Skeleton ou um Spinner
  return <DashboardSkeleton />;
}