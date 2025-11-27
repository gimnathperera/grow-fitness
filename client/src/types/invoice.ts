import type { ReactNode } from "react";

export interface Invoice {
  date: ReactNode;
  kidName: string;
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
