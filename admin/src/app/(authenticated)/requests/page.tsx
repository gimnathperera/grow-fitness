"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Request {
  id: string;
  type: "reschedule" | "cancel";
  requester: string;
  session: string;
  reason: string;
  isLate: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setRequests([
        {
          id: "1",
          type: "reschedule",
          requester: "Alice Parent",
          session: "Emma Child - Jan 16, 10:00 AM",
          reason: "Family emergency, need to reschedule",
          isLate: false,
          status: "pending",
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          type: "cancel",
          requester: "Alice Parent",
          session: "Liam Child - Jan 16, 2:00 PM",
          reason: "Child is sick",
          isLate: false,
          status: "approved",
          createdAt: "2024-01-15T09:15:00Z",
        },
        {
          id: "3",
          type: "reschedule",
          requester: "Bob Parent",
          session: "Sophia Child - Jan 23, 9:00 AM",
          reason: "Work conflict",
          isLate: true,
          status: "rejected",
          createdAt: "2024-01-15T08:00:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request: Request) => {
    setSelectedRequest(request);
    setApproveDialogOpen(true);
  };

  const handleReject = (request: Request) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRequest) return;

    try {
      // API call to approve request
      console.log("Approving request:", selectedRequest.id, { adminNote });
      setApproveDialogOpen(false);
      setAdminNote("");
      fetchRequests();
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const confirmReject = async () => {
    if (!selectedRequest) return;

    try {
      // API call to reject request
      console.log("Rejecting request:", selectedRequest.id, {
        reason: rejectReason,
      });
      setRejectDialogOpen(false);
      setRejectReason("");
      fetchRequests();
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const getStatusBadge = (status: string, isLate: boolean) => {
    const variants = {
      pending: "default",
      approved: "secondary",
      rejected: "destructive",
    } as const;

    return (
      <div className="flex items-center space-x-2">
        <Badge variant={variants[status as keyof typeof variants] || "default"}>
          {status}
        </Badge>
        {isLate && (
          <Badge variant="destructive" className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Late</span>
          </Badge>
        )}
      </div>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === "reschedule" ? (
      <Clock className="h-4 w-4" />
    ) : (
      <XCircle className="h-4 w-4" />
    );
  };

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          {getTypeIcon(value)}
          <span className="capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: "requester",
      label: "Requester",
      sortable: true,
    },
    {
      key: "session",
      label: "Session",
      sortable: true,
    },
    {
      key: "reason",
      label: "Reason",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string, row: Request) =>
        getStatusBadge(value, row.isLate),
    },
    {
      key: "createdAt",
      label: "Requested",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  const actions = (request: Request) => (
    <div className="flex items-center space-x-2">
      {request.status === "pending" && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleApprove(request)}
            className="text-green-600 hover:text-green-700"
            title="Approve"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReject(request)}
            className="text-red-600 hover:text-red-700"
            title="Reject"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((request) => request.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-600">
            Manage reschedule and cancellation requests
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={filteredRequests}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search requests..."
        actions={actions}
      />

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              Approve the {selectedRequest?.type} request for{" "}
              {selectedRequest?.session}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminNote">Admin Note (Optional)</Label>
              <Textarea
                id="adminNote"
                placeholder="Add a note about this approval..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
            {selectedRequest?.type === "reschedule" && (
              <div>
                <Label htmlFor="newSlot">New Time Slot</Label>
                <Input
                  id="newSlot"
                  type="datetime-local"
                  placeholder="Select new date and time"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmApprove}>Approve Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Reject the {selectedRequest?.type} request for{" "}
              {selectedRequest?.session}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectReason">Reason for Rejection</Label>
              <Textarea
                id="rejectReason"
                placeholder="Explain why this request is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

