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
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export function RegisterPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");

    try {
      await login();
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const planOptions = [
    {
      value: "starter",
      label: "Starter",
      description: "Até 50 clientes, 2 usuários",
      price: "R$ 49/mês",
      features: [
        "Dashboard básico",
        "Alertas de vencimento",
        "Suporte por email",
      ],
      icon: Zap,
      color: "from-blue-500 to-blue-600",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Até 200 clientes, 10 usuários",
      price: "R$ 149/mês",
      features: [
        "Dashboard avançado",
        "Automações",
        "Relatórios personalizados",
        "Suporte prioritário",
      ],
      popular: true,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
    {
      value: "enterprise",
      label: "Enterprise",
      description: "Até 1000 clientes, 50 usuários",
      price: "R$ 399/mês",
      features: [
        "Recursos avançados",
        "API personalizada",
        "Integrações ilimitadas",
        "Suporte 24/7",
      ],
      icon: Shield,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="lg:hidden mb-6">
              <Logo size="lg" className="justify-center" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-900 dark:text-white">
                Crie sua conta e
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                transforme seu negócio
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que já revolucionaram sua gestão
              de clientes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center pb-8">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Criar Conta
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                    Comece sua jornada com o Google
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
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                        <span>Criando conta...</span>
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
                        <span>Criar conta com Google</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Já tem uma conta?{" "}
                      <Link
                        href="/login"
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                      >
                        Fazer login
                      </Link>
                    </p>
                  </div>

                  {/* Plans Preview */}
                  <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">
                      Escolha seu plano após o cadastro
                    </h3>
                    <div className="grid gap-3">
                      {planOptions.map((plan) => {
                        const IconComponent = plan.icon;
                        return (
                          <div
                            key={plan.value}
                            className="relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                          >
                            {plan.popular && (
                              <div className="absolute -top-2 left-4">
                                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                  Mais Popular
                                </Badge>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-r ${plan.color}`}
                                >
                                  <IconComponent className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {plan.label}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {plan.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                  {plan.price}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trust indicators sidebar */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-center">
                    Por que escolher o ClientManager Pro?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Setup em menos de 2 minutos
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Dados seguros e criptografados
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Suporte em português
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Teste grátis por 14 dias
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm italic text-gray-700 dark:text-gray-300">
                      &quot;O ClientManager Pro transformou completamente nossa
                      gestão. Aumentamos nossa eficiência em 300%!&quot;
                    </blockquote>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Maria Silva</strong> - CEO, TechStart
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ao criar uma conta, você concorda com nossos{" "}
              <a
                href="#"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a
                href="#"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
