"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/ui/logo";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Erro de configuração do servidor. Entre em contato com o suporte.";
      case "AccessDenied":
        return "Acesso negado. Você não tem permissão para acessar esta aplicação.";
      case "Verification":
        return "Token de verificação inválido ou expirado.";
      case "Default":
      default:
        return "Ocorreu um erro durante a autenticação. Tente novamente.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Erro de Autenticação
          </h1>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">
              Falha na Autenticação
            </CardTitle>
            <CardDescription>
              Não foi possível completar o processo de login
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/20"
            >
              <AlertDescription className="text-red-800 dark:text-red-400">
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Link href="/login" className="block">
                <Button className="w-full">Tentar Novamente</Button>
              </Link>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Voltar ao Início
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Precisa de ajuda?{" "}
                <a
                  href="mailto:suporte@clientmanager.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Entre em contato
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
