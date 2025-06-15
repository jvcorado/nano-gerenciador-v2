"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientPlan, ClientStatus } from '@prisma/client';

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

export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: client?.name || '',
    email: client?.email || '',
    server: client?.server || '',
    plan: client?.plan || ClientPlan.MONTHLY,
    startDate: client?.startDate || new Date().toISOString().split('T')[0],
    status: client?.status || ClientStatus.ACTIVE
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.server) {
      newErrors.server = 'Servidor é obrigatório';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
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

  const handleInputChange = (field: keyof ClientFormData, value: string | ClientPlan | ClientStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Cliente</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Digite o nome completo"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="cliente@email.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="server">Servidor</Label>
        <Select 
          value={formData.server} 
          onValueChange={(value) => handleInputChange('server', value)}
        >
          <SelectTrigger className={errors.server ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione o servidor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Server 1">Server 1</SelectItem>
            <SelectItem value="Server 2">Server 2</SelectItem>
            <SelectItem value="Server 3">Server 3</SelectItem>
          </SelectContent>
        </Select>
        {errors.server && <p className="text-sm text-red-500">{errors.server}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan">Plano</Label>
        <Select 
          value={formData.plan} 
          onValueChange={(value) => handleInputChange('plan', value as ClientPlan)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ClientPlan.MONTHLY}>Mensal - R$ 29,90</SelectItem>
            <SelectItem value={ClientPlan.ANNUAL}>Anual - R$ 299,90</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Data de Início</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
          className={errors.startDate ? 'border-red-500' : ''}
        />
        {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleInputChange('status', value as ClientStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ClientStatus.ACTIVE}>Ativo</SelectItem>
            <SelectItem value={ClientStatus.INACTIVE}>Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {client ? 'Atualizar' : 'Adicionar'} Cliente
        </Button>
      </div>
    </form>
  );
}