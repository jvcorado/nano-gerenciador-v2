// app/plans/page.tsx
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, TrendingUp, Shield } from "lucide-react";

const plans = [
  {
    id: "starter",
    label: "Starter",
    description: "Até 20 clientes, 1 usuário",
    features: ["Gratuito para sempre"],
    price: "Grátis",
    icon: Zap,
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "professional",
    label: "Professional",
    description: "Até 200 clientes, 10 usuários",
    features: ["Automação", "Relatórios avançados"],
    price: "R$ 149/mês",
    priceId: process.env.STRIPE_PRICE_ID_PROFESSIONAL,
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Até 1000 clientes, 50 usuários",
    features: ["Suporte 24h", "API dedicada"],
    price: "R$ 399/mês",
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    icon: Shield,
    color: "from-emerald-500 to-emerald-600",
  },
];

export default async function PlansPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/login");

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { id: true, plan: true },
  });

  if (!tenant) redirect("/login");

  return (
    <div className="container max-w-5xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Escolha seu plano</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent =
            plan.id.toLowerCase() === tenant.plan?.toLowerCase();
          const isFree = plan.id === "starter";

          return (
            <Card key={plan.id} className="relative">
              <CardHeader className="pb-4">
                <div
                  className={`w-fit rounded-md px-2 py-1 text-sm text-white bg-gradient-to-r ${plan.color}`}
                >
                  {plan.label}
                </div>
                <CardTitle className="text-xl mt-2">{plan.price}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Badge variant="outline" className="mt-4">
                    Seu plano atual
                  </Badge>
                ) : isFree ? (
                  <Button variant="outline" disabled className="w-full mt-4">
                    Plano Gratuito
                  </Button>
                ) : (
                  <form
                    action="/api/stripe/checkout"
                    method="POST"
                    className="w-full"
                  >
                    <input type="hidden" name="priceId" value={plan.priceId} />
                    <input
                      type="hidden"
                      name="successUrl"
                      value={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                    />
                    <input
                      type="hidden"
                      name="cancelUrl"
                      value={`${process.env.NEXT_PUBLIC_APP_URL}/plans`}
                    />
                    <Button type="submit" className="w-full mt-4">
                      Assinar
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
