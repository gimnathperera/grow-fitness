"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Invoice } from "@/types/invoice";

interface InvoicesSectionProps {
  invoices: Invoice[];
}

export const InvoicesSection: React.FC<InvoicesSectionProps> = ({ invoices }) => {
  const handleDownloadInvoice = (id: string) => {
    console.log("Downloading invoice:", id);
  };

  if (!invoices || invoices.length === 0) return <p className="text-gray-500">No invoices found.</p>;

    function getStatusColor(status: any) {
        throw new Error("Function not implemented.");
    }

    function formatCurrency(amount: any): React.ReactNode {
        throw new Error("Function not implemented.");
    }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>Track your payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {invoices.map((inv) => (
          <div key={inv.id} className="flex justify-between items-center p-3 border rounded-md border-gray-200">
            <div>
              <p className="font-medium">{inv.kidName || "N/A"}</p>
              <p className="text-sm text-gray-500">{inv.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(inv.status)}`}>
                {inv.status}
              </span>
              <span>{formatCurrency(inv.amount)}</span>
              <Button size="sm" onClick={() => handleDownloadInvoice(inv.id)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
