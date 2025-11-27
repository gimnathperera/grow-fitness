"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/DataTable";
import { Download, Calendar, Users, DollarSign, Award } from "lucide-react";

interface ReportData {
  period: string;
  dateRange: { start: string; end: string };
  attendance: {
    scheduled: number;
    completed: number;
    canceled: number;
    late: number;
  };
  coachPerformance: Array<{
    name: string;
    sessions: number;
    earnings: number;
  }>;
  childActivity: Array<{
    name: string;
    sessions: number;
    milestones: number;
  }>;
  finance: {
    totalPaid: number;
    totalUnpaid: number;
    totalInvoices: number;
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"weekly" | "monthly">("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Set default date range
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setStartDate(weekAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  const fetchReport = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setReportData({
        period: view,
        dateRange: { start: startDate, end: endDate },
        attendance: {
          scheduled: 24,
          completed: 20,
          canceled: 3,
          late: 1,
        },
        coachPerformance: [
          { name: "John Coach", sessions: 12, earnings: 12000 },
          { name: "Sarah Coach", sessions: 8, earnings: 8000 },
        ],
        childActivity: [
          { name: "Emma Child", sessions: 8, milestones: 1 },
          { name: "Liam Child", sessions: 6, milestones: 0 },
          { name: "Sophia Child", sessions: 10, milestones: 2 },
        ],
        finance: {
          totalPaid: 45000,
          totalUnpaid: 15000,
          totalInvoices: 8,
        },
      });
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
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

  const attendanceColumns = [
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value" },
  ];

  const coachColumns = [
    { key: "name", label: "Coach", sortable: true },
    { key: "sessions", label: "Sessions", sortable: true },
    {
      key: "earnings",
      label: "Earnings",
      sortable: true,
      render: (value: number) => formatCurrency(value),
    },
  ];

  const childColumns = [
    { key: "name", label: "Child", sortable: true },
    { key: "sessions", label: "Sessions", sortable: true },
    { key: "milestones", label: "Milestones", sortable: true },
  ];

  const attendanceData = reportData
    ? [
        { metric: "Scheduled", value: reportData.attendance.scheduled },
        { metric: "Completed", value: reportData.attendance.completed },
        { metric: "Canceled", value: reportData.attendance.canceled },
        { metric: "Late", value: reportData.attendance.late },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export analytics reports</p>
        </div>
        <div className="flex items-center space-x-4">
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

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>
            Select the date range and report type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="view">Report Type</Label>
              <Select
                value={view}
                onValueChange={(value) =>
                  setView(value as "weekly" | "monthly")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchReport} disabled={loading}>
                {loading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Attendance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={attendanceData}
                  columns={attendanceColumns}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coaches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Coach Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={reportData.coachPerformance}
                  columns={coachColumns}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="children" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Child Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={reportData.childActivity}
                  columns={childColumns}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Finance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(reportData.finance.totalPaid)}
                    </div>
                    <div className="text-sm text-gray-500">Total Paid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(reportData.finance.totalUnpaid)}
                    </div>
                    <div className="text-sm text-gray-500">Total Unpaid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {reportData.finance.totalInvoices}
                    </div>
                    <div className="text-sm text-gray-500">Total Invoices</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

