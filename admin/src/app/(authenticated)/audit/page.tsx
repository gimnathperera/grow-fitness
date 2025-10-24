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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Filter, Eye } from "lucide-react";

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  meta: any;
  createdAt: string;
}

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actorFilter, setActorFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");

  useEffect(() => {
    fetchAuditLogs();
  }, [actorFilter, actionFilter, targetTypeFilter]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setAuditLogs([
        {
          id: "1",
          actor: "Admin User",
          action: "CREATE",
          targetType: "Session",
          targetId: "sess_123",
          meta: {
            coachId: "coach_1",
            childIds: ["child_1"],
            locationId: "loc_1",
          },
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          actor: "Admin User",
          action: "UPDATE",
          targetType: "Request",
          targetId: "req_123",
          meta: {
            status: "approved",
            adminNote: "Approved due to valid reason",
          },
          createdAt: "2024-01-15T09:15:00Z",
        },
        {
          id: "3",
          actor: "Admin User",
          action: "DELETE",
          targetType: "Session",
          targetId: "sess_124",
          meta: { reason: "Cancelled due to coach unavailability" },
          createdAt: "2024-01-15T08:00:00Z",
        },
        {
          id: "4",
          actor: "Admin User",
          action: "UPDATE",
          targetType: "Invoice",
          targetId: "inv_123",
          meta: { status: "paid", paidMethod: "bank", paidDate: "2024-01-14" },
          createdAt: "2024-01-14T16:45:00Z",
        },
        {
          id: "5",
          actor: "Admin User",
          action: "CREATE",
          targetType: "User",
          targetId: "user_123",
          meta: { role: "coach", email: "newcoach@growfitness.lk" },
          createdAt: "2024-01-14T14:20:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const variants = {
      CREATE: "default",
      UPDATE: "secondary",
      DELETE: "destructive",
      READ: "outline",
    } as const;

    return (
      <Badge variant={variants[action as keyof typeof variants] || "outline"}>
        {action}
      </Badge>
    );
  };

  const getTargetTypeBadge = (targetType: string) => {
    const variants = {
      Session: "default",
      Request: "secondary",
      Invoice: "outline",
      User: "secondary",
      Child: "default",
      Coach: "secondary",
    } as const;

    return (
      <Badge
        variant={variants[targetType as keyof typeof variants] || "outline"}
      >
        {targetType}
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
      key: "action",
      label: "Action",
      render: (value: string) => getActionBadge(value),
    },
    {
      key: "targetType",
      label: "Target Type",
      render: (value: string) => getTargetTypeBadge(value),
    },
    {
      key: "targetId",
      label: "Target ID",
      render: (value: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
      ),
    },
    {
      key: "meta",
      label: "Metadata",
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

  const actions = (log: AuditLog) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => console.log("View details:", log)}
      title="View Details"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  const filteredLogs = auditLogs.filter((log) => {
    if (actorFilter !== "all" && log.actor !== actorFilter) return false;
    if (actionFilter !== "all" && log.action !== actionFilter) return false;
    if (targetTypeFilter !== "all" && log.targetType !== targetTypeFilter)
      return false;
    return true;
  });

  const uniqueActors = Array.from(new Set(auditLogs.map((l) => l.actor)));
  const uniqueActions = Array.from(new Set(auditLogs.map((l) => l.action)));
  const uniqueTargetTypes = Array.from(
    new Set(auditLogs.map((l) => l.targetType))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">
            Track all system changes and administrative actions
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
            Filter audit logs by actor, action, and target type
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
              <label className="text-sm font-medium">Action</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Target Type</label>
              <Select
                value={targetTypeFilter}
                onValueChange={setTargetTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTargetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        data={filteredLogs}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search audit logs..."
        actions={actions}
      />
    </div>
  );
}

