"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Download, DollarSign } from "lucide-react";

interface Invoice {
  id: string;
  parent: string;
  amountLKR: number;
  status: "paid" | "unpaid";
  paidDate?: string;
  paidMethod?: "cash" | "bank" | "other";
  createdAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalUnpaid: 0,
    totalInvoices: 0,
  });

  useEffect(() => {
    fetchInvoices();
    fetchSummary();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setInvoices([
        {
          id: "1",
          parent: "Alice Parent",
          amountLKR: 5000,
          status: "paid",
          paidDate: "2024-01-10T00:00:00Z",
          paidMethod: "bank",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          parent: "Bob Parent",
          amountLKR: 7500,
          status: "unpaid",
          createdAt: "2024-01-02T00:00:00Z",
        },
        {
          id: "3",
          parent: "Alice Parent",
          amountLKR: 3000,
          status: "paid",
          paidDate: "2024-01-12T00:00:00Z",
          paidMethod: "cash",
          createdAt: "2024-01-05T00:00:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      // Mock data - replace with actual API call
      setSummary({
        totalPaid: 8000,
        totalUnpaid: 7500,
        totalInvoices: 3,
      });
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  const handleCreate = () => {
    console.log("Create invoice");
  };

  const handleEdit = (invoice: Invoice) => {
    console.log("Edit invoice:", invoice);
  };

  const handleDelete = (invoice: Invoice) => {
    if (confirm(`Are you sure you want to delete this invoice?`)) {
      console.log("Delete invoice:", invoice);
    }
  };

  const handleMarkPaid = (invoice: Invoice) => {
    console.log("Mark as paid:", invoice);
  };

  const handleExportCSV = () => {
    console.log("Export CSV");
  };

  const handleExportPDF = () => {
    console.log("Export PDF");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "secondary",
      unpaid: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  const columns = [
    {
      key: "parent",
      label: "Parent",
      sortable: true,
    },
    {
      key: "amountLKR",
      label: "Amount",
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "paidDate",
      label: "Paid Date",
      sortable: true,
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "Not paid",
    },
    {
      key: "paidMethod",
      label: "Method",
      render: (value: string) => value || "N/A",
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = (invoice: Invoice) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(invoice)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      {invoice.status === "unpaid" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMarkPaid(invoice)}
          title="Mark as Paid"
          className="text-green-600 hover:text-green-700"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(invoice)}
        title="Delete"
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const filteredInvoices =
    statusFilter === "all"
      ? invoices
      : invoices.filter((invoice) => invoice.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage invoices and payments</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalPaid)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unpaid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalUnpaid)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalInvoices}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filteredInvoices}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search invoices..."
        actions={actions}
      />
    </div>
  );
}

