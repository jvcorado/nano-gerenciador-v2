"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientPlan, ClientStatus } from "@prisma/client";

interface ClientFormData {
  name: string;
  email: string;
  server: string;
  plan: ClientPlan;
  startDate: string;
  status: ClientStatus;
}

interface ClientFormProps {
  client?: any;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
}

const planLabels: Record<ClientPlan, string> = {
  MONTHLY: "Mensal - R$ 29,90",
  ANNUAL: "Anual - R$ 299,90",
};

const statusLabels: Record<ClientStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: client?.name || "",
    email: client?.email || "",
    server: client?.server || "",
    plan: (client?.plan?.toUpperCase() as ClientPlan) || ClientPlan.MONTHLY,
    startDate: client?.startDate || new Date().toISOString().split("T")[0],
    status:
      (client?.status?.toUpperCase() as ClientStatus) || ClientStatus.ACTIVE,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.server) {
      newErrors.server = "Servidor é obrigatório";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Data de início é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof ClientFormData,
    value: string | ClientPlan | ClientStatus
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Cliente</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Digite o nome completo"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="cliente@email.com"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="server">Servidor</Label>
        <Select
          value={formData.server}
          onValueChange={(value) => handleInputChange("server", value)}
        >
          <SelectTrigger className={errors.server ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione o servidor" />
          </SelectTrigger>
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
        </Select>

        {errors.server && (
          <p className="text-sm text-red-500">{errors.server}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan">Plano</Label>
        <Select
          value={formData.plan.toString()}
          onValueChange={(value) =>
            handleInputChange("plan", value as ClientPlan)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o plano">
              {planLabels[formData.plan]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MONTHLY">{planLabels.MONTHLY}</SelectItem>
            <SelectItem value="ANNUAL">{planLabels.ANNUAL}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Data de Início</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange("startDate", e.target.value)}
          className={errors.startDate ? "border-red-500" : ""}
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status.toString()}
          onValueChange={(value) =>
            handleInputChange("status", value as ClientStatus)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status">
              {statusLabels[formData.status]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">{statusLabels.ACTIVE}</SelectItem>
            <SelectItem value="INACTIVE">{statusLabels.INACTIVE}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {client ? "Atualizar" : "Adicionar"} Cliente
        </Button>
      </div>
    </form>
  );
}
