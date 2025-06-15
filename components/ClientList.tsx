"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Edit, Trash2, Mail, Server, Calendar, Clock } from "lucide-react";
import { Client } from "@/types/client";
import { ClientForm } from "./ClientForm";

interface ClientListProps {
  clients: Client[];
  onEditClient: (
    id: string,
    data: Omit<Client, "id" | "expirationDate">
  ) => void;
  onDeleteClient: (id: string) => void;
}

export function ClientList({
  clients,
  onEditClient,
  onDeleteClient,
}: ClientListProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const getExpirationStatus = (expirationDate: string) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const daysUntilExpiration = Math.ceil(
      (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration <= 7) {
      return {
        status: "critical",
        color: "bg-red-500",
        label: "Crítico",
        days: daysUntilExpiration,
      };
    } else if (daysUntilExpiration <= 30) {
      return {
        status: "warning",
        color: "bg-orange-500",
        label: "Atenção",
        days: daysUntilExpiration,
      };
    } else if (daysUntilExpiration <= 90) {
      return {
        status: "good",
        color: "bg-green-500",
        label: "Ok",
        days: daysUntilExpiration,
      };
    }
    return {
      status: "excellent",
      color: "bg-blue-500",
      label: "Excelente",
      days: daysUntilExpiration,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Server className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-500">
              Adicione seu primeiro cliente para começar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const expirationInfo = getExpirationStatus(client.expirationDate);

          return (
            <Card
              key={client.id}
              className="hover:shadow-lg transition-all duration-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingClient(client)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingClient(client)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{client.server}</span>
                  </div>
                  <Badge
                    variant={
                      client.status === "active" ? "default" : "secondary"
                    }
                  >
                    {client.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {client.plan === "monthly" ? "Mensal" : "Anual"}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    R$ {client.plan === "monthly" ? "29,90" : "299,90"}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Vencimento:</span>
                    <span className="font-medium">
                      {formatDate(client.expirationDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${expirationInfo.color}`}
                      ></div>
                      <span className="text-sm font-medium">
                        {expirationInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {expirationInfo.days > 0
                        ? `${expirationInfo.days} dias`
                        : expirationInfo.days === 0
                        ? "Hoje"
                        : `${Math.abs(expirationInfo.days)} dias atrás`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                      : "annual",
                  status: data.status.toLowerCase() as "active" | "inactive",
                  tenantId: editingClient.tenantId,
                  createdAt: editingClient.createdAt,
                  updatedAt: new Date().toISOString(),
                  createdBy: editingClient.createdBy,
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
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
