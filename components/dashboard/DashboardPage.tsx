"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/Dashboard";
import { ClientGrid } from "@/components/ClientGrid";
import { ClientForm } from "@/components/ClientForm";
import { useClients } from "@/hooks/useClients";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Users,
  AlertTriangle,
  Search,
  Filter,
  Bell,
  Palette,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  Calendar,
  Settings,
  Sparkles,
} from "lucide-react";
import { ClientPlan, ClientStatus } from "@prisma/client";

export function DashboardPage() {
  const { user } = useAuth();
  const {
    clients,
    addClient,
    editClient,
    deleteClient,
    getExpiringClients,
    isLoading,
  } = useClients();

  const [isAddingClient, setIsAddingClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serverFilter, setServerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expirationStatusFilter, setExpirationStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [showRowColors, setShowRowColors] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const expiringClients = getExpiringClients();

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

  const getClientMonth = (client: any) => {
    const startDate = new Date(client.startDate);
    return `${startDate.getFullYear()}-${String(
      startDate.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesServer =
      serverFilter === "all" || client.server === serverFilter;
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;

    let matchesExpirationStatus = true;
    if (expirationStatusFilter !== "all") {
      const clientExpirationStatus = getExpirationStatus(client);
      matchesExpirationStatus =
        clientExpirationStatus === expirationStatusFilter;
    }

    let matchesMonth = true;
    if (monthFilter !== "all") {
      const clientMonth = getClientMonth(client);
      matchesMonth = clientMonth === monthFilter;
    }

    return (
      matchesSearch &&
      matchesServer &&
      matchesStatus &&
      matchesExpirationStatus &&
      matchesMonth
    );
  });

  const navigateToClientsWithFilter = (expirationStatus: string) => {
    setExpirationStatusFilter(expirationStatus);
    setActiveTab("clients");
  };

  const getAvailableMonths = () => {
    const months = new Set<string>();
    clients.forEach((client) => {
      months.add(getClientMonth(client));
    });
    return Array.from(months).sort().reverse();
  };

  const formatMonthLabel = (monthValue: string) => {
    const [year, month] = monthValue.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "long" });
  };

  // Quick stats for the header
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (c) => c.status === ClientStatus.ACTIVE
  ).length;
  const monthlyRevenue =
    clients.filter((c) => c.plan === ClientPlan.MONTHLY).length * 29.9;
  const annualRevenue =
    clients.filter((c) => c.plan === ClientPlan.ANNUAL).length * 299.9;
  const totalRevenue = monthlyRevenue + annualRevenue;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <Header />

      <div className="container mx-auto py-8 px-4 w-full ">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Olá, {user?.name?.split(" ")[0]}! 👋
                  </h1>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                  {user?.plan && (
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white capitalize">
                      Plano:{" "}
                      {
                        {
                          STARTER: "Gratuito",
                          PROFESSIONAL: "Profissional",
                          ENTERPRISE: "Empresarial",
                        }[user.plan]
                      }
                    </Badge>
                  )}
                </div>
                {user?.plan === "STARTER" && totalClients >= 20 && (
                  <Alert className="mt-2 border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-400">
                      Seu plano gratuito permite até{" "}
                      <strong>20 clientes</strong>. Para continuar cadastrando,
                      faça upgrade para um plano profissional.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <p className="text-lg text-muted-foreground">
                Aqui está um resumo do seu negócio hoje
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalClients}</div>
                  <div className="text-xs opacity-90">Clientes</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{activeClients}</div>
                  <div className="text-xs opacity-90">Ativos</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-xl font-bold">
                    R$ {totalRevenue.toFixed(0)}
                  </div>
                  <div className="text-xs opacity-90">Receita</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {expiringClients.length}
                  </div>
                  <div className="text-xs opacity-90">Alertas</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Alert Banner */}
          {expiringClients.length > 0 && (
            <Alert className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
              <Bell className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-300">
                <strong>{expiringClients.length} cliente(s)</strong> próximo(s)
                ao vencimento!
                <Button
                  variant="link"
                  className="p-0 ml-2 text-orange-600 dark:text-orange-400 underline"
                  onClick={() => navigateToClientsWithFilter("warning")}
                >
                  Ver detalhes
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard
              clients={clients}
              expiringClients={expiringClients}
              onStatusClick={navigateToClientsWithFilter}
              monthFilter={monthFilter}
              setMonthFilter={setMonthFilter}
              getAvailableMonths={getAvailableMonths}
              formatMonthLabel={formatMonthLabel}
              getClientMonth={getClientMonth}
            />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Gerenciar Clientes
                </h2>
                <p className="text-muted-foreground">
                  Visualize e gerencie todos os seus clientes
                </p>
              </div>

              <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Adicionar Novo Cliente
                    </DialogTitle>
                    <DialogDescription>
                      Preencha os dados do cliente abaixo.
                    </DialogDescription>
                  </DialogHeader>
                  <ClientForm
                    onSubmit={(data) => {
                      addClient(data);
                      setIsAddingClient(false);
                    }}
                    onCancel={() => setIsAddingClient(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  Filtros Avançados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/50 dark:bg-gray-700/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Servidor</Label>
                    <Select
                      value={serverFilter}
                      onValueChange={setServerFilter}
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectContent>
                          <SelectItem value="UNITV">UNITV</SelectItem>
                          <SelectItem value="STRONG">STRONG</SelectItem>
                          <SelectItem value="LION">LION</SelectItem>
                          <SelectItem value="TIVIONE">TIVIONE</SelectItem>
                          <SelectItem value="LATINO">LATINO</SelectItem>
                          <SelectItem value="MAGIS">MAGIS</SelectItem>
                          <SelectItem value="PFAST">PFAST</SelectItem>
                          <SelectItem value="BLADE">BLADE</SelectItem>
                          <SelectItem value="UNIPLAY">UNIPLAY</SelectItem>
                          <SelectItem value="WAREZ">WAREZ</SelectItem>
                          <SelectItem value="NEKO">NEKO</SelectItem>
                        </SelectContent>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value={ClientStatus.ACTIVE}>
                          Ativo
                        </SelectItem>
                        <SelectItem value={ClientStatus.INACTIVE}>
                          Inativo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Mês</Label>
                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os meses</SelectItem>
                        {getAvailableMonths().map((month) => (
                          <SelectItem key={month} value={month}>
                            {formatMonthLabel(month)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status de Vencimento</Label>
                    <Select
                      value={expirationStatusFilter}
                      onValueChange={setExpirationStatusFilter}
                    >
                      <SelectTrigger className="bg-white/50 dark:bg-gray-700/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="critical">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Crítico (até 7 dias)
                          </div>
                        </SelectItem>
                        <SelectItem value="warning">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Atenção (até 30 dias)
                          </div>
                        </SelectItem>
                        <SelectItem value="good">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Ok (até 90 dias)
                          </div>
                        </SelectItem>
                        <SelectItem value="excellent">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Excelente (+90 dias)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Color Toggle */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <Label
                        htmlFor="color-toggle"
                        className="text-sm font-medium"
                      >
                        Cores por status de vencimento
                      </Label>
                    </div>
                    <Switch
                      id="color-toggle"
                      checked={showRowColors}
                      onCheckedChange={setShowRowColors}
                    />
                  </div>
                </div>

                {/* Filter Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">
                      Mostrando:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-sm bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
                    >
                      {filteredClients.length} de {clients.length} clientes
                    </Badge>

                    {searchTerm && (
                      <Badge variant="secondary" className="text-sm">
                        Busca: &quot;{searchTerm} &quot;
                      </Badge>
                    )}

                    {serverFilter !== "all" && (
                      <Badge variant="secondary" className="text-sm">
                        Servidor: {serverFilter}
                      </Badge>
                    )}

                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="text-sm">
                        Status:{" "}
                        {statusFilter === ClientStatus.ACTIVE
                          ? "Ativo"
                          : "Inativo"}
                      </Badge>
                    )}

                    {monthFilter !== "all" && (
                      <Badge variant="secondary" className="text-sm">
                        Mês: {formatMonthLabel(monthFilter)}
                      </Badge>
                    )}

                    {expirationStatusFilter !== "all" && (
                      <Badge variant="secondary" className="text-sm">
                        Vencimento:{" "}
                        {expirationStatusFilter === "critical"
                          ? "Crítico"
                          : expirationStatusFilter === "warning"
                          ? "Atenção"
                          : expirationStatusFilter === "good"
                          ? "Ok"
                          : "Excelente"}
                      </Badge>
                    )}

                    {(searchTerm ||
                      serverFilter !== "all" ||
                      statusFilter !== "all" ||
                      monthFilter !== "all" ||
                      expirationStatusFilter !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setServerFilter("all");
                          setStatusFilter("all");
                          setMonthFilter("all");
                          setExpirationStatusFilter("all");
                        }}
                        className="text-xs hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <ClientGrid
              clients={filteredClients.map((client) => ({
                ...client,
                plan:
                  client.plan === ClientPlan.MONTHLY
                    ? "monthly"
                    : client.plan === ClientPlan.ANNUAL
                    ? "annual"
                    : client.plan,
                status:
                  client.status === ClientStatus.ACTIVE ? "active" : "inactive",
                createdAt:
                  typeof client.createdAt === "string"
                    ? client.createdAt
                    : client.createdAt.toISOString(),
                updatedAt:
                  typeof client.updatedAt === "string"
                    ? client.updatedAt
                    : client.updatedAt.toISOString(),
              }))}
              onEditClient={(id, data) => {
                // Convert plan and status to enum values expected by your backend
                const mappedData = {
                  ...data,
                  plan:
                    data.plan === "monthly"
                      ? ClientPlan.MONTHLY
                      : data.plan === "annual"
                      ? ClientPlan.ANNUAL
                      : data.plan,
                  status:
                    data.status === "active"
                      ? ClientStatus.ACTIVE
                      : ClientStatus.INACTIVE,
                };
                // Call the async editClient but don't return the promise (to match expected sync signature)
                void editClient(id, mappedData);
              }}
              onDeleteClient={deleteClient}
              showRowColors={showRowColors}
              getExpirationStatus={getExpirationStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
