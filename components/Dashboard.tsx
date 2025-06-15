import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Users,
  Server,
  TrendingUp,
  AlertTriangle,
  Calendar as CalendarIcon,
  DollarSign,
  CalendarDays,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClientPlan, ClientStatus } from "@prisma/client";

interface DashboardProps {
  clients: any[];
  expiringClients: any[];
  onStatusClick: (status: string) => void;
  monthFilter: string;
  setMonthFilter: (month: string) => void;
  getAvailableMonths: () => string[];
  formatMonthLabel: (month: string) => string;
  getClientMonth: (client: any) => string;
}

export function Dashboard({
  clients,
  expiringClients,
  onStatusClick,
  monthFilter,
  setMonthFilter,
  getAvailableMonths,
  formatMonthLabel,
  getClientMonth,
}: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    monthFilter !== "all" ? new Date(monthFilter + "-01") : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Get unique months from client dates
  const getAvailableMonthDates = () => {
    const monthDates = new Set<string>();
    clients.forEach((client) => {
      const date = new Date(client.startDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthDates.add(monthKey);
    });
    return Array.from(monthDates).map((monthKey) => new Date(monthKey + "-01"));
  };

  // Check if a date has clients registered
  const hasClientsInMonth = (date: Date) => {
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    return clients.some((client) => getClientMonth(client) === monthKey);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (hasClientsInMonth(date)) {
        setSelectedDate(date);
        setMonthFilter(monthKey);
        setIsCalendarOpen(false);
      }
    }
  };

  // Clear filter
  const clearFilter = () => {
    setSelectedDate(undefined);
    setMonthFilter("all");
    setIsCalendarOpen(false);
  };

  // Filter clients by selected month
  const filteredClientsByMonth =
    monthFilter === "all"
      ? clients
      : clients.filter((client) => getClientMonth(client) === monthFilter);

  const totalClients = filteredClientsByMonth.length;
  const activeClients = filteredClientsByMonth.filter(
    (c) => c.status === ClientStatus.ACTIVE
  ).length;
  const monthlyClients = filteredClientsByMonth.filter(
    (c) => c.plan === ClientPlan.MONTHLY
  ).length;
  const annualClients = filteredClientsByMonth.filter(
    (c) => c.plan === ClientPlan.ANNUAL
  ).length;

  // Clients by server (filtered by month)
  const serverStats = {
    "Server 1": filteredClientsByMonth.filter((c) => c.server === "Server 1")
      .length,
    "Server 2": filteredClientsByMonth.filter((c) => c.server === "Server 2")
      .length,
    "Server 3": filteredClientsByMonth.filter((c) => c.server === "Server 3")
      .length,
  };

  // Revenue calculation for filtered month
  const monthlyRevenue = monthlyClients * 29.9;
  const annualRevenue = annualClients * 299.9;
  const totalRevenue = monthlyRevenue + annualRevenue;

  // Expiration status for filtered clients
  const getExpirationStatus = (client: any) => {
    const today = new Date();
    const expirationDate = new Date(client.expirationDate);
    const daysUntilExpiration = Math.ceil(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration <= 7) return "critical";
    if (daysUntilExpiration <= 30) return "warning";
    if (daysUntilExpiration <= 90) return "good";
    return "excellent";
  };

  const criticalClients = filteredClientsByMonth.filter(
    (c) => getExpirationStatus(c) === "critical"
  ).length;
  const warningClients = filteredClientsByMonth.filter(
    (c) => getExpirationStatus(c) === "warning"
  ).length;
  const goodClients = filteredClientsByMonth.filter(
    (c) => getExpirationStatus(c) === "good"
  ).length;

  // Calculate growth percentage (mock data for demonstration)
  const getGrowthPercentage = () => {
    if (monthFilter === "all") return "+12%";
    const currentMonth = new Date().getMonth() + 1;
    const selectedMonth = monthFilter
      ? parseInt(monthFilter.split("-")[1])
      : currentMonth;
    const growth = Math.max(
      -20,
      Math.min(50, (selectedMonth - currentMonth) * 5 + Math.random() * 10)
    );
    return growth >= 0 ? `+${growth.toFixed(0)}%` : `${growth.toFixed(0)}%`;
  };

  return (
    <div className="space-y-8">
      {/* Calendar Period Filter */}
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6 text-blue-600" />
            Período de Análise
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Inteligente
            </Badge>
          </CardTitle>
          <CardDescription className="text-base">
            Selecione um mês específico para visualizar dados detalhados e
            insights personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                Selecionar Período
              </Label>
              <div className="flex gap-2">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white/50 dark:bg-gray-700/50",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "MMMM 'de' yyyy", {
                            locale: ptBR,
                          })
                        : "Selecione um mês"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                      <h4 className="font-semibold text-sm mb-2">
                        Meses com clientes cadastrados
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Apenas meses com clientes podem ser selecionados
                      </p>
                    </div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => !hasClientsInMonth(date)}
                      modifiers={{
                        hasClients: (date) => hasClientsInMonth(date),
                      }}
                      modifiersStyles={{
                        hasClients: {
                          backgroundColor: "hsl(var(--primary))",
                          color: "hsl(var(--primary-foreground))",
                          fontWeight: "bold",
                        },
                      }}
                      locale={ptBR}
                      className="rounded-md"
                    />
                    <div className="p-4 border-t border-border bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <div className="w-3 h-3 bg-primary rounded"></div>
                        <span>Meses com clientes cadastrados</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilter}
                        className="w-full"
                      >
                        Ver todos os períodos
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-muted-foreground">
                {monthFilter === "all"
                  ? `Exibindo dados de todos os períodos (${clients.length} clientes)`
                  : `Exibindo dados de ${formatMonthLabel(
                      monthFilter
                    )} (${totalClients} clientes)`}
                {selectedDate && (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
                    >
                      {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Month Selection */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Label className="text-sm font-semibold mb-3 block">
              Acesso Rápido
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={monthFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={clearFilter}
                className={
                  monthFilter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                Todos os períodos
              </Button>
              {getAvailableMonthDates()
                .slice(0, 6)
                .map((date) => {
                  const monthKey = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}`;
                  const clientCount = clients.filter(
                    (client) => getClientMonth(client) === monthKey
                  ).length;

                  return (
                    <Button
                      key={monthKey}
                      variant={monthFilter === monthKey ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedDate(date);
                        setMonthFilter(monthKey);
                      }}
                      className={`text-xs ${
                        monthFilter === monthKey
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : ""
                      }`}
                    >
                      {format(date, "MMM/yy", { locale: ptBR })}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {clientCount}
                      </Badge>
                    </Button>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {monthFilter === "all"
                ? "Total de Clientes"
                : "Clientes do Período"}
            </CardTitle>
            <Users className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClients}</div>
            <p className="text-xs opacity-80 mt-1">
              {activeClients} ativos • {totalClients - activeClients} inativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              {monthFilter === "all" ? "Receita Total" : "Receita do Período"}
            </CardTitle>
            <DollarSign className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {totalRevenue.toFixed(0)}
            </div>
            <p className="text-xs opacity-80 mt-1">
              {getGrowthPercentage()} vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Alertas Críticos
            </CardTitle>
            <AlertTriangle className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{criticalClients}</div>
            <p className="text-xs opacity-80 mt-1">Vencem em até 7 dias</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Taxa de Renovação
            </CardTitle>
            <TrendingUp className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-xs opacity-80 mt-1">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Server Distribution */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Server className="h-6 w-6 text-blue-600" />
              Distribuição por Servidor
              {monthFilter !== "all" && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
                >
                  {formatMonthLabel(monthFilter)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(serverStats).map(([server, count]) => (
              <div key={server} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {server}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {count} clientes
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {totalClients > 0
                        ? Math.round((count / totalClients) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={totalClients > 0 ? (count / totalClients) * 100 : 0}
                  className="h-3 bg-gray-200 dark:bg-gray-700"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PieChart className="h-6 w-6 text-purple-600" />
              Distribuição de Planos
              {monthFilter !== "all" && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300"
                >
                  {formatMonthLabel(monthFilter)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Plano Mensal
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
                  >
                    {monthlyClients} clientes
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {totalClients > 0
                      ? Math.round((monthlyClients / totalClients) * 100)
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <Progress
                value={
                  totalClients > 0 ? (monthlyClients / totalClients) * 100 : 0
                }
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
              <p className="text-xs text-muted-foreground">
                R$ {monthlyRevenue.toFixed(2)}/mês
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Plano Anual
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                  >
                    {annualClients} clientes
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {totalClients > 0
                      ? Math.round((annualClients / totalClients) * 100)
                      : 0}
                    %
                  </Badge>
                </div>
              </div>
              <Progress
                value={
                  totalClients > 0 ? (annualClients / totalClients) * 100 : 0
                }
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
              <p className="text-xs text-muted-foreground">
                R$ {annualRevenue.toFixed(2)}/ano
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiration Status - Clickable Cards */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-6 w-6 text-orange-600" />
            Status de Vencimento
            {monthFilter !== "all" && (
              <Badge
                variant="outline"
                className="ml-2 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300"
              >
                {formatMonthLabel(monthFilter)}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-base">
            Clique em um status para ver os clientes correspondentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Crítico */}
            <div
              onClick={() => onStatusClick("critical")}
              className="group bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/30 p-6 rounded-xl border border-red-200 dark:border-red-800 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Crítico
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {criticalClients}
                  </p>
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></div>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                Até 7 dias
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Clique para ver clientes →
              </p>
            </div>

            {/* Atenção */}
            <div
              onClick={() => onStatusClick("warning")}
              className="group bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 p-6 rounded-xl border border-orange-200 dark:border-orange-800 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                    Atenção
                  </p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {warningClients}
                  </p>
                </div>
                <div className="w-4 h-4 bg-orange-500 rounded-full group-hover:scale-125 transition-transform"></div>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                Até 30 dias
              </p>
              <p className="text-xs text-orange-500 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Clique para ver clientes →
              </p>
            </div>

            {/* Ok */}
            <div
              onClick={() => onStatusClick("good")}
              className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-800 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    Ok
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {goodClients}
                  </p>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                Até 90 dias
              </p>
              <p className="text-xs text-green-500 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Clique para ver clientes →
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
