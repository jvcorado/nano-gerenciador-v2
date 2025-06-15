"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Shield, Zap, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await login(); // login já faz o redirecionamento para /dashboard
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro ao fazer login. Tente novamente.");
      setIsLoading(false); // só chega aqui se falhar antes de redirecionar
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <Logo size="md" />
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <Logo size="xl" />
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Bem-vindo de volta à
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    revolução da gestão
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Acesse sua conta e continue transformando a forma como você
                  gerencia seus clientes.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Gestão Inteligente
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Organize todos os seus clientes em um só lugar
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Automação Avançada
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Alertas automáticos e processos otimizados
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Segurança Total
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seus dados protegidos com criptografia avançada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
              <CardHeader className="space-y-1 text-center pb-8">
                <div className="lg:hidden mb-4">
                  <Logo size="lg" className="justify-center" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Entrar
                </CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                  Acesse sua conta para gerenciar seus clientes
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-red-200 bg-red-50 dark:bg-red-950/20"
                  >
                    <AlertDescription className="text-red-800 dark:text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continuar com Google</span>
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Não tem uma conta?{" "}
                    <Link
                      href="/register"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                    >
                      Criar conta
                    </Link>
                  </p>
                </div>

                {/* Info */}
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      🚀 Login seguro com Google
                    </p>
                    <div className="text-xs text-blue-700 dark:text-blue-400">
                      <p>Acesso rápido e seguro usando sua conta Google</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ao entrar, você concorda com nossos{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Política de Privacidade
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
