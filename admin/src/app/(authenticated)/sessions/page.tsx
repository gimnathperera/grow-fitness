"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/DataTable";
import { CreateDialog } from "@/components/CreateDialog";
import { EditDialog } from "@/components/EditDialog";
import { ViewDialog } from "@/components/ViewDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionsApi, usersApi, locationsApi, childrenApi } from "@/lib/api";
import { Edit, Trash2, Eye } from "lucide-react";

interface Session {
  _id: string;
  id?: string; // For calendar compatibility
  type: "individual" | "group";
  coachId: string;
  coachName?: string; // Will be populated from coach data
  coach?: { name: string }; // For display purposes
  childIds: string[];
  children?: string[]; // Will be populated from children data
  locationId: string;
  locationName?: string; // Will be populated from location data
  location?: { name: string }; // For display purposes
  startAt: Date;
  endAt: Date;
  start?: Date; // For calendar compatibility
  end?: Date; // For calendar compatibility
  status: "booked" | "canceled" | "completed";
  notes?: string;
  title?: string; // For calendar display
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"calendar" | "table">("table");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await sessionsApi.getAll();

      // Fetch additional data to populate names
      const [coachesResponse, locationsResponse, childrenResponse] =
        await Promise.all([
          usersApi.getAll("coach"),
          locationsApi.getAll(),
          childrenApi.getAll(),
        ]);

      const coaches = coachesResponse.data;
      const locations = locationsResponse.data;
      const allChildren = childrenResponse.data;

      const sessionsWithNames = response.data.map((session: Session) => ({
        ...session,
        coachName: session.coachId?.name || "Unknown Coach",
        locationName: session?.locationId?.label || "Unknown Location",
        children: session.childIds.map((childId: string) => {
          return childId?.name || "Unknown Child";
        }),
      }));

      setSessions(sessionsWithNames);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: {
    type: string;
    coachId: string;
    children: string;
    locationId: string;
    startAt: string;
    endAt: string;
    notes?: string;
  }) => {
    setActionLoading(true);
    try {
      const response = await sessionsApi.create({
        type: data.type as "individual" | "group",
        coachId: data.coachId,
        childIds: data.children
          ? data.children.split(",").map((c: string) => c.trim())
          : [],
        locationId: data.locationId,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        notes: data.notes || undefined,
      });

      // Refresh sessions to get the complete data with names
      await fetchSessions();
      console.log("Created session:", response.data);
    } catch (error) {
      console.error("Failed to create session:", error);
      // TODO: Show error toast/notification
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (data: {
    type: string;
    coachId: string;
    children: string;
    locationId: string;
    startAt: string;
    endAt: string;
    notes?: string;
  }) => {
    if (!selectedSession) return;

    setActionLoading(true);
    try {
      await sessionsApi.update(selectedSession._id, {
        type: data.type as "individual" | "group",
        coachId: data.coachId,
        childIds: data.children
          ? data.children.split(",").map((c: string) => c.trim())
          : [],
        locationId: data.locationId,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        notes: data.notes || undefined,
      });

      // Refresh sessions to get the complete data with names
      await fetchSessions();
      console.log("Updated session");
    } catch (error) {
      console.error("Failed to update session:", error);
      // TODO: Show error toast/notification
    } finally {
      setActionLoading(false);
      setEditDialogOpen(false);
      setSelectedSession(null);
    }
  };

  const handleDelete = async (session: Session) => {
    if (!confirm(`Are you sure you want to delete this session?`)) return;

    setActionLoading(true);
    try {
      await sessionsApi.delete(session._id);
      setSessions((prev) => prev.filter((s) => s._id !== session._id));
      console.log("Deleted session:", session);
    } catch (error) {
      console.error("Failed to delete session:", error);
      // TODO: Show error toast/notification
    } finally {
      setActionLoading(false);
    }
  };

  const handleView = (session: Session) => {
    setSelectedSession(session);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      booked: "default",
      canceled: "destructive",
      completed: "secondary",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (value: string) => (
        <Badge variant={value === "individual" ? "outline" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "coachName",
      label: "Coach",
      sortable: true,
    },
    {
      key: "children",
      label: "Children",
      render: (value: any) => {
        if (!value) return "None";
        if (Array.isArray(value)) {
          return value
            .map((child) =>
              typeof child === "string" ? child : child?.name || "Unknown"
            )
            .join(", ");
        }
        return "None";
      },
    },
    {
      key: "locationName",
      label: "Location",
      sortable: true,
    },
    {
      key: "startAt",
      label: "Date & Time",
      sortable: true,
      render: (value: Date) => format(value, "MMM dd, yyyy HH:mm"),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value),
    },
  ];

  const actions = (session: Session) => (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleView(session)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(session)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(session)}
        title="Delete"
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-600">Manage fitness sessions and schedules</p>
        </div>
        <CreateDialog
          title="Create New Session"
          description="Schedule a new fitness session"
          triggerText="Create Session"
          onSubmit={handleCreate}
          loading={actionLoading}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Session Type</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coach">Coach</Label>
              <Input
                id="coach"
                name="coach"
                placeholder="Enter coach name"
                required
              />
            </div>
            <div>
              <Label htmlFor="children">Children (comma-separated)</Label>
              <Input
                id="children"
                name="children"
                placeholder="Emma Child, Liam Child"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter session location"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startAt">Start Time</Label>
                <Input
                  id="startAt"
                  name="startAt"
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endAt">End Time</Label>
                <Input id="endAt" name="endAt" type="datetime-local" required />
              </div>
            </div>
          </div>
        </CreateDialog>
      </div>

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "calendar" | "table")}
      >
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Simple Calendar Grid */}
          <div className="border rounded-lg p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-sm text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {(() => {
                const monthStart = startOfMonth(currentDate);
                const monthEnd = endOfMonth(currentDate);
                const calendarStart = startOfWeek(monthStart);
                const calendarEnd = endOfWeek(monthEnd);
                const days = eachDayOfInterval({
                  start: calendarStart,
                  end: calendarEnd,
                });

                return days.map((day) => {
                  const daySessions = sessions.filter((session) =>
                    isSameDay(new Date(session.startAt), day)
                  );
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth();
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toString()}
                      className={`min-h-[100px] p-2 border rounded-lg ${
                        !isCurrentMonth
                          ? "bg-gray-50 text-gray-400"
                          : "bg-white"
                      } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <div className="font-semibold text-sm mb-1">
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {daySessions.map((session) => (
                          <div
                            key={session._id}
                            className={`text-xs p-1 rounded cursor-pointer ${
                              session.status === "booked"
                                ? "bg-blue-100 text-blue-700"
                                : session.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                            onClick={() => handleView(session)}
                          >
                            <div className="font-medium truncate">
                              {format(new Date(session.startAt), "HH:mm")}
                            </div>
                            <div className="truncate">{session.type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="table">
          <DataTable
            data={sessions}
            columns={columns}
            loading={loading}
            searchable
            searchPlaceholder="Search sessions..."
            actions={actions}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Session"
        description="Update session information"
        onSubmit={handleUpdate}
        loading={actionLoading}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-type">Session Type</Label>
            <Select name="type" defaultValue={selectedSession?.type} required>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-coach">Coach</Label>
            <Input
              id="edit-coach"
              name="coach"
              defaultValue={selectedSession?.coachName || ""}
              placeholder="Enter coach name"
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-children">Children (comma-separated)</Label>
            <Input
              id="edit-children"
              name="children"
              defaultValue={selectedSession?.children?.join(", ") || ""}
              placeholder="Emma Child, Liam Child"
            />
          </div>
          <div>
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              name="location"
              defaultValue={selectedSession?.locationName || ""}
              placeholder="Enter session location"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startAt">Start Time</Label>
              <Input
                id="edit-startAt"
                name="startAt"
                type="datetime-local"
                defaultValue={
                  selectedSession?.startAt
                    ? new Date(selectedSession.startAt)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-endAt">End Time</Label>
              <Input
                id="edit-endAt"
                name="endAt"
                type="datetime-local"
                defaultValue={
                  selectedSession?.endAt
                    ? new Date(selectedSession.endAt).toISOString().slice(0, 16)
                    : ""
                }
                required
              />
            </div>
          </div>
        </div>
      </EditDialog>

      {/* View Dialog */}
      <ViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        title="Session Details"
        description="View session information"
      >
        {selectedSession && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Type
                </Label>
                <p className="text-lg font-semibold capitalize">
                  {selectedSession.type}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Coach
                </Label>
                <p className="text-lg">{selectedSession.coachName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Location
                </Label>
                <p className="text-lg">{selectedSession.locationName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Status
                </Label>
                <div className="text-lg">
                  {getStatusBadge(selectedSession.status)}
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Children
              </Label>
              <p className="text-lg">
                {selectedSession.children?.join(", ") || "None"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Start Time
                </Label>
                <p className="text-lg">
                  {new Date(selectedSession.startAt).toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  End Time
                </Label>
                <p className="text-lg">
                  {new Date(selectedSession.endAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewDialog>
    </div>
  );
}
