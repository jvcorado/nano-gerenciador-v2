"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Client, ClientPlan, ClientStatus } from '@prisma/client';

interface ClientFormData {
  name: string;
  email: string;
  server: string;
  plan: ClientPlan;
  startDate: string;
  status: ClientStatus;
}

interface ClientWithExpiration extends Omit<Client, 'startDate' | 'expirationDate'> {
  startDate: string;
  expirationDate: string;
}

export function useClients() {
  const { user, isAuthenticated } = useAuth();
  const [clients, setClients] = useState<ClientWithExpiration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.tenantId) {
      fetchClients();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.tenantId]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: ClientFormData) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 🔥 necessário para enviar o cookie da sessão
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const newClient = await response.json();
        setClients(prev => [...prev, newClient]);
      } else {
        const err = await response.json();
        console.error('Server responded with error:', err);
      }
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };


  const editClient = async (id: string, clientData: ClientFormData) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Adicionar aqui também
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        setClients(prev => prev.map(client =>
          client.id === id ? updatedClient : client
        ));
      } else {
        const err = await response.json();
        console.error('Server responded with error:', err);
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };


  const deleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        credentials: 'include', // ✅ Aqui também!
      });

      if (response.ok) {
        setClients(prev => prev.filter(client => client.id !== id));
      } else {
        const err = await response.json();
        console.error('Server responded with error:', err);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const getExpiringClients = () => {
    const today = new Date();
    return clients.filter(client => {
      const expirationDate = new Date(client.expirationDate);
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 30 && client.status === ClientStatus.ACTIVE;
    });
  };

  return {
    clients,
    isLoading,
    addClient,
    editClient,
    deleteClient,
    getExpiringClients,
    refetch: fetchClients,
  };
}