"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  Clock,
  Award,
  DollarSign,
  Activity,
  Filter,
  FileText,
} from "lucide-react";

interface KPIData {
  todaysSessions: number;
  pendingRequests: number;
  upcomingWeekSessions: number;
  milestoneAwards: number;
  invoicesSummary: {
    totalPaid: number;
    totalUnpaid: number;
  };
}

interface CRMEvent {
  id: string;
  actor: string;
  subject: string;
  kind: string;
  payload: any;
  createdAt: string;
}

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KPIData>({
    todaysSessions: 0,
    pendingRequests: 0,
    upcomingWeekSessions: 0,
    milestoneAwards: 0,
    invoicesSummary: { totalPaid: 0, totalUnpaid: 0 },
  });
  const [crmEvents, setCrmEvents] = useState<CRMEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const [coachFilter, setCoachFilter] = useState("all");

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, coachFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      setKpiData({
        todaysSessions: 8,
        pendingRequests: 3,
        upcomingWeekSessions: 24,
        milestoneAwards: 2,
        invoicesSummary: { totalPaid: 45000, totalUnpaid: 15000 },
      });

      setCrmEvents([
        {
          id: "1",
          actor: "Admin User",
          subject: "Session Created",
          kind: "session_created",
          payload: { sessionId: "sess_123", childName: "Emma Child" },
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          actor: "Alice Parent",
          subject: "Request Submitted",
          kind: "request_submitted",
          payload: { requestType: "reschedule", sessionId: "sess_124" },
          createdAt: "2024-01-15T09:15:00Z",
        },
        {
          id: "3",
          actor: "System",
          subject: "Milestone Awarded",
          kind: "milestone_awarded",
          payload: {
            childName: "Liam Child",
            milestone: "10 Sessions Completed",
          },
          createdAt: "2024-01-15T08:00:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-LK", {
      timeZone: "Asia/Colombo",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your fitness center operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={coachFilter} onValueChange={setCoachFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coaches</SelectItem>
              <SelectItem value="coach1">John Coach</SelectItem>
              <SelectItem value="coach2">Sarah Coach</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.todaysSessions}</div>
            <p className="text-xs text-muted-foreground">
              Sessions scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting admin approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiData.upcomingWeekSessions}
            </div>
            <p className="text-xs text-muted-foreground">Sessions this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Milestone Awards
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.milestoneAwards}</div>
            <p className="text-xs text-muted-foreground">
              Awards given this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Finance Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Finance Summary
            </CardTitle>
            <CardDescription>Invoice totals in LKR</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-600">Paid</span>
                <span className="font-medium">
                  {formatCurrency(kpiData.invoicesSummary.totalPaid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-red-600">Unpaid</span>
                <span className="font-medium">
                  {formatCurrency(kpiData.invoicesSummary.totalUnpaid)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {formatCurrency(
                      kpiData.invoicesSummary.totalPaid +
                        kpiData.invoicesSummary.totalUnpaid
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest CRM events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crmEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium">{event.actor}</span>
                      <span className="text-gray-500"> {event.subject}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(event.createdAt)}
                    </div>
                    {event.payload && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {event.kind}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
