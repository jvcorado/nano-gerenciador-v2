"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Logo } from '@/components/ui/logo';
import { 
  Users, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Zap, 
  Clock, 
  TrendingUp,
  Globe,
  Lock,
  Smartphone,
  Brain,
  Target,
  Rocket,
  Award,
  Heart,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "IA Integrada",
      description: "Inteligência artificial que aprende com seus dados e sugere as melhores ações para cada cliente.",
      color: "from-blue-500 to-cyan-500",
      delay: "0ms"
    },
    {
      icon: Target,
      title: "Automação Inteligente",
      description: "Workflows automatizados que se adaptam ao comportamento dos seus clientes em tempo real.",
      color: "from-purple-500 to-pink-500",
      delay: "100ms"
    },
    {
      icon: Shield,
      title: "Segurança Avançada",
      description: "Criptografia militar e compliance total com LGPD para máxima proteção dos dados.",
      color: "from-emerald-500 to-teal-500",
      delay: "200ms"
    },
    {
      icon: Zap,
      title: "Performance Extrema",
      description: "Interface ultra-rápida com carregamento instantâneo e sincronização em tempo real.",
      color: "from-yellow-500 to-orange-500",
      delay: "300ms"
    },
    {
      icon: Globe,
      title: "Multi-região",
      description: "Infraestrutura global com CDN para acesso rápido de qualquer lugar do mundo.",
      color: "from-indigo-500 to-purple-500",
      delay: "400ms"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Experiência perfeita em todos os dispositivos com app nativo para iOS e Android.",
      color: "from-rose-500 to-pink-500",
      delay: "500ms"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "49",
      originalPrice: "99",
      description: "Perfeito para startups e pequenas empresas",
      features: [
        "Até 100 clientes",
        "3 usuários inclusos",
        "Dashboard inteligente",
        "Automações básicas",
        "Suporte 24/7",
        "App mobile"
      ],
      popular: false,
      color: "from-blue-500 to-cyan-500",
      badge: "Economia de 50%"
    },
    {
      name: "Professional",
      price: "149",
      originalPrice: "299",
      description: "Ideal para empresas em crescimento acelerado",
      features: [
        "Até 500 clientes",
        "10 usuários inclusos",
        "IA avançada",
        "Automações ilimitadas",
        "API completa",
        "Integrações premium",
        "Suporte prioritário",
        "Relatórios avançados"
      ],
      popular: true,
      color: "from-purple-500 to-pink-500",
      badge: "Mais Popular"
    },
    {
      name: "Enterprise",
      price: "399",
      originalPrice: "799",
      description: "Para grandes organizações e corporações",
      features: [
        "Clientes ilimitados",
        "Usuários ilimitados",
        "IA personalizada",
        "White-label completo",
        "Infraestrutura dedicada",
        "Gerente de sucesso",
        "SLA 99.99%",
        "Customizações sob medida"
      ],
      popular: false,
      color: "from-emerald-500 to-teal-500",
      badge: "Máximo Poder"
    }
  ];

  const testimonials = [
    {
      name: "Sofia Rodriguez",
      company: "TechFlow Solutions",
      content: "Revolucionou nossa operação! Aumentamos a retenção de clientes em 85% e reduzimos o churn para praticamente zero.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      role: "CEO & Founder"
    },
    {
      name: "Marcus Chen",
      company: "Digital Innovations",
      content: "A IA do ClientManager é impressionante. Ela prevê quais clientes vão cancelar antes mesmo deles pensarem nisso!",
      rating: 5,
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      role: "Head of Growth"
    },
    {
      name: "Isabella Santos",
      company: "Scale Ventures",
      content: "Interface linda, performance incrível e resultados que falam por si. Nossa produtividade triplicou em 3 meses.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      role: "Operations Director"
    }
  ];

  const stats = [
    { number: "50k+", label: "Empresas Ativas", icon: Users },
    { number: "2.5M+", label: "Clientes Gerenciados", icon: Target },
    { number: "99.99%", label: "Uptime Garantido", icon: Shield },
    { number: "4.9/5", label: "Satisfação", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-6">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                  Recursos
                </a>
                <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                  Preços
                </a>
                <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                  Clientes
                </a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="font-semibold">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2" />
                Mais de 50.000 empresas confiam em nós
              </Badge>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="text-gray-900 dark:text-white">O futuro da</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                gestão de clientes
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">é agora</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Plataforma alimentada por IA que transforma dados em insights, 
              automatiza processos e multiplica seus resultados de forma exponencial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/register">
                <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <Rocket className="mr-3 h-6 w-6" />
                  Começar Gratuitamente
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-bold transition-all duration-300">
                <Award className="mr-3 h-6 w-6" />
                Ver Demonstração
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold mb-4">
              Tecnologia de Ponta
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Recursos que <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">revolucionam</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Cada funcionalidade foi pensada para maximizar seus resultados e simplificar sua operação
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`group cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                    hoveredFeature === index ? 'shadow-2xl scale-105' : ''
                  }`}
                  style={{ animationDelay: feature.delay }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm font-semibold mb-4">
              Oferta Especial
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Preços que <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">aceleram</span> seu crescimento
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Escolha o plano ideal e comece a transformar seus resultados hoje mesmo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative group cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-500 transform hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105 shadow-2xl' : 'hover:shadow-xl'
                } ${hoveredPlan === index ? 'shadow-2xl scale-105' : ''}`}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 font-bold">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">R$ {plan.originalPrice}</span>
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">R$ {plan.price}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">/mês</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/register" className="block">
                    <Button 
                      className={`w-full mt-8 font-bold text-lg py-6 transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                      }`}
                    >
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold mb-4">
              Histórias de Sucesso
            </Badge>
            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Clientes que <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">transformaram</span> seus negócios
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Descubra como empresas de todos os tamanhos estão alcançando resultados extraordinários
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="pt-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg mb-6 italic text-gray-700 dark:text-gray-300 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">
                Pronto para revolucionar sua gestão?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Junte-se a mais de 50.000 empresas que já transformaram seus resultados com nossa plataforma
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/register">
                  <Button size="lg" className="text-lg px-10 py-6 bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Rocket className="mr-3 h-6 w-6" />
                    Começar Gratuitamente
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold transition-all duration-300">
                  <Award className="mr-3 h-6 w-6" />
                  Agendar Demo
                </Button>
              </div>
              
              <p className="text-sm mt-6 opacity-75">
                Sem cartão de crédito • Setup em 2 minutos • Suporte em português • Garantia de 30 dias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" className="mb-4" />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A plataforma mais avançada para gerenciar clientes e acelerar o crescimento do seu negócio.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Produto</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Empresa</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Suporte</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 ClientManager Pro. Todos os direitos reservados. Feito com ❤️ no Brasil.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}