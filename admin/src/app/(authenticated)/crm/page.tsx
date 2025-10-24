"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Filter, Calendar } from "lucide-react";

interface CRMEvent {
  id: string;
  actor: string;
  subject: string;
  kind: string;
  payload: any;
  createdAt: string;
}

export default function CRMPage() {
  const [events, setEvents] = useState<CRMEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actorFilter, setActorFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, [actorFilter, kindFilter, dateFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setEvents([
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
        {
          id: "4",
          actor: "Admin User",
          subject: "Request Approved",
          kind: "request_approved",
          payload: { requestId: "req_123", type: "reschedule" },
          createdAt: "2024-01-14T16:45:00Z",
        },
        {
          id: "5",
          actor: "Bob Parent",
          subject: "Invoice Created",
          kind: "invoice_created",
          payload: { invoiceId: "inv_123", amount: 5000 },
          createdAt: "2024-01-14T14:20:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch CRM events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getKindBadge = (kind: string) => {
    const variants = {
      session_created: "default",
      session_updated: "secondary",
      session_canceled: "destructive",
      request_submitted: "outline",
      request_approved: "secondary",
      request_rejected: "destructive",
      milestone_awarded: "default",
      invoice_created: "outline",
      invoice_paid: "secondary",
    } as const;

    return (
      <Badge variant={variants[kind as keyof typeof variants] || "outline"}>
        {kind.replace(/_/g, " ")}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-LK", {
      timeZone: "Asia/Colombo",
    });
  };

  const columns = [
    {
      key: "actor",
      label: "Actor",
      sortable: true,
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
    },
    {
      key: "kind",
      label: "Event Type",
      render: (value: string) => getKindBadge(value),
    },
    {
      key: "payload",
      label: "Details",
      render: (value: any) => (
        <div
          className="max-w-xs truncate"
          title={JSON.stringify(value, null, 2)}
        >
          {JSON.stringify(value).substring(0, 50)}...
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Timestamp",
      sortable: true,
      render: (value: string) => formatDate(value),
    },
  ];

  const actions = (event: CRMEvent) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => console.log("View details:", event)}
      title="View Details"
    >
      <Activity className="h-4 w-4" />
    </Button>
  );

  const filteredEvents = events.filter((event) => {
    if (actorFilter !== "all" && event.actor !== actorFilter) return false;
    if (kindFilter !== "all" && event.kind !== kindFilter) return false;
    // Add date filtering logic here if needed
    return true;
  });

  const uniqueActors = Array.from(new Set(events.map((e) => e.actor)));
  const uniqueKinds = Array.from(new Set(events.map((e) => e.kind)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Timeline</h1>
          <p className="text-gray-600">
            Track all system events and activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter events by actor, type, and date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Actor</label>
              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actors</SelectItem>
                  {uniqueActors.map((actor) => (
                    <SelectItem key={actor} value={actor}>
                      {actor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Event Type</label>
              <Select value={kindFilter} onValueChange={setKindFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueKinds.map((kind) => (
                    <SelectItem key={kind} value={kind}>
                      {kind.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        data={filteredEvents}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search events..."
        actions={actions}
      />
    </div>
  );
}

