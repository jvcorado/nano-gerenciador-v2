"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Trash2,
  Mail,
  Server,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { Client } from "@/types/client";
import { ClientForm } from "./ClientForm";

interface ClientGridProps {
  clients: Client[];
  onEditClient: (
    id: string,
    data: Omit<Client, "id" | "expirationDate">
  ) => void;
  onDeleteClient: (id: string) => void;
  showRowColors: boolean;
  getExpirationStatus: (client: Client) => string;
}

export function ClientGrid({
  clients,
  onEditClient,
  onDeleteClient,
  showRowColors,
  getExpirationStatus,
}: ClientGridProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const getRowColorClass = (status: string) => {
    if (!showRowColors) return "";

    switch (status) {
      case "critical":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/30";
      case "warning":
        return "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-950/30";
      case "good":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-950/30";
      case "excellent":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/30";
      default:
        return "";
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "critical":
        return {
          label: "Crítico",
          color: "bg-red-500",
          textColor: "text-red-700 dark:text-red-400",
        };
      case "warning":
        return {
          label: "Atenção",
          color: "bg-orange-500",
          textColor: "text-orange-700 dark:text-orange-400",
        };
      case "good":
        return {
          label: "Ok",
          color: "bg-green-500",
          textColor: "text-green-700 dark:text-green-400",
        };
      case "excellent":
        return {
          label: "Excelente",
          color: "bg-blue-500",
          textColor: "text-blue-700 dark:text-blue-400",
        };
      default:
        return {
          label: "Desconhecido",
          color: "bg-gray-500",
          textColor: "text-gray-700 dark:text-gray-400",
        };
    }
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    return Math.ceil(
      (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-muted-foreground">
              Adicione seu primeiro cliente para começar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="space-y-4 p-4">
              {clients.map((client) => {
                const expirationStatus = getExpirationStatus(client);
                const statusInfo = getStatusInfo(expirationStatus);
                const daysUntilExpiration = getDaysUntilExpiration(
                  client.expirationDate
                );
                const rowColorClass = getRowColorClass(expirationStatus);

                return (
                  <div
                    key={client.id}
                    className={`p-4 rounded-lg border-l-4 space-y-3 bg-card text-card-foreground ${rowColorClass}`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingClient(client)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingClient(client)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Server className="h-3 w-3" />
                          <span>Servidor</span>
                        </div>
                        <div className="font-medium">{client.server}</div>
                      </div>

                      <div>
                        <div className="text-muted-foreground mb-1">Status</div>
                        <Badge
                          variant={
                            client.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {client.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-muted-foreground mb-1">Plano</div>
                        <div>
                          <div className="font-medium">
                            {client.plan === "monthly" ? "Mensal" : "Anual"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            R$ {client.plan === "monthly" ? "29,90" : "299,90"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-muted-foreground mb-1">
                          Vencimento
                        </div>
                        <div>
                          <div className="flex items-center gap-1 font-medium">
                            <Calendar className="h-3 w-3" />
                            {formatDate(client.expirationDate)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {daysUntilExpiration > 0
                              ? `${daysUntilExpiration} dias`
                              : daysUntilExpiration === 0
                              ? "Hoje"
                              : `${Math.abs(daysUntilExpiration)} dias atrás`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Footer */}
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${statusInfo.color}`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            showRowColors
                              ? statusInfo.textColor
                              : "text-foreground"
                          }`}
                        >
                          Status: {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border font-medium text-sm text-muted-foreground">
                <div className="col-span-2">Cliente</div>
                <div className="col-span-2">Email</div>
                <div className="col-span-1">Servidor</div>
                <div className="col-span-1">Plano</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Vencimento</div>
                <div className="col-span-2">Status Vencimento</div>
                <div className="col-span-1">Ações</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border">
                {clients.map((client) => {
                  const expirationStatus = getExpirationStatus(client);
                  const statusInfo = getStatusInfo(expirationStatus);
                  const daysUntilExpiration = getDaysUntilExpiration(
                    client.expirationDate
                  );
                  const rowColorClass = getRowColorClass(expirationStatus);

                  return (
                    <div
                      key={client.id}
                      className={`grid grid-cols-12 gap-4 p-4 hover:bg-muted/50 transition-colors border-l-4 ${rowColorClass}`}
                    >
                      {/* Cliente */}
                      <div className="col-span-2">
                        <div className="font-medium">{client.name}</div>
                      </div>

                      {/* Email */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                      </div>

                      {/* Servidor */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Server className="h-3 w-3 text-muted-foreground" />
                          {client.server}
                        </div>
                      </div>

                      {/* Plano */}
                      <div className="col-span-1">
                        <div className="text-sm">
                          <div className="font-medium">
                            {client.plan === "monthly" ? "Mensal" : "Anual"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            R$ {client.plan === "monthly" ? "29,90" : "299,90"}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <Badge
                          variant={
                            client.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {client.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>

                      {/* Vencimento */}
                      <div className="col-span-2">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(client.expirationDate)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {daysUntilExpiration > 0
                              ? `${daysUntilExpiration} dias`
                              : daysUntilExpiration === 0
                              ? "Hoje"
                              : `${Math.abs(daysUntilExpiration)} dias atrás`}
                          </div>
                        </div>
                      </div>

                      {/* Status Vencimento */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${statusInfo.color}`}
                          ></div>
                          <span
                            className={`text-sm font-medium ${
                              showRowColors
                                ? statusInfo.textColor
                                : "text-foreground"
                            }`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="col-span-1">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingClient(client)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingClient(client)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingClient}
        onOpenChange={() => setEditingClient(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize os dados do cliente abaixo.
            </DialogDescription>
          </DialogHeader>
          {editingClient && (
            <ClientForm
              client={editingClient}
              onSubmit={(data) => {
                onEditClient(editingClient.id, {
                  ...data,
                  plan:
                    data.plan.toLowerCase() === "monthly"
                      ? "monthly"
                      : data.plan.toLowerCase() === "annual"
                      ? "annual"
                      : editingClient.plan,
                  status:
                    data.status.toLowerCase() === "active"
                      ? "active"
                      : "inactive",
                  tenantId: editingClient.tenantId,
                  createdBy: editingClient.createdBy,
                  createdAt: editingClient.createdAt,
                  updatedAt: new Date().toISOString(),
                });
                setEditingClient(null);
              }}
              onCancel={() => setEditingClient(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deletingClient}
        onOpenChange={() => setDeletingClient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir o cliente{" "}
              <strong>{deletingClient?.name}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingClient) {
                  onDeleteClient(deletingClient.id);
                  setDeletingClient(null);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
