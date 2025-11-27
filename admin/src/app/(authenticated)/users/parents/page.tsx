"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/DataTable";
import { CreateDialog } from "@/components/CreateDialog";
import { EditDialog } from "@/components/EditDialog";
import { ViewDialog } from "@/components/ViewDialog";
import { ChildrenDialog } from "@/components/ChildrenDialog";
import { ChildForm } from "@/components/ChildForm";
import { usersApi, childrenApi } from "@/lib/api";
import { Plus, Edit, Trash2, Eye, UserCheck, Users } from "lucide-react";

interface Child {
  _id: string;
  name: string;
  parentId: string;
  age: number;
  medicalCondition?: string;
  gender: string;
  goals: string[];
  createdAt: string;
}

interface Parent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "parent";
  createdAt: string;
  children?: Child[];
  childrenCount?: number;
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [childrenDialogOpen, setChildrenDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newParentChildren, setNewParentChildren] = useState<Child[]>([]);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await usersApi.getAll("parent");

      // Fetch children for each parent
      const parentsWithChildren = await Promise.all(
        response.data.map(async (parent: any) => {
          try {
            const childrenResponse = await childrenApi.getAll(parent._id);
            const children = childrenResponse.data || [];
            return {
              ...parent,
              children: children,
              childrenCount: children.length,
            };
          } catch (error) {
            console.error(
              `Failed to fetch children for parent ${parent._id}:`,
              error
            );
            return {
              ...parent,
              children: [],
              childrenCount: 0,
            };
          }
        })
      );

      setParents(parentsWithChildren);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic
  };

  const handleCreate = async (data: any) => {
    setActionLoading(true);
    try {
      const response = await usersApi.create({
        name: data.name,
        email: data.email,
        password: "defaultPassword123", // TODO: Generate secure password
        role: "parent",
        phone: data.phone || undefined,
      });

      const newParent: Parent = {
        ...response.data,
        children: [],
        childrenCount: 0,
      };

      // Create children if any were added during parent creation
      if (newParentChildren.length > 0) {
        try {
          const childrenPromises = newParentChildren.map((child) =>
            childrenApi.create({
              name: child.name.trim(),
              parentId: newParent._id,
              age: child.age,
              medicalCondition: child.medicalCondition,
              gender: child.gender,
              goals: child.goals,
            })
          );

          const childrenResponses = await Promise.all(childrenPromises);
          newParent.children = childrenResponses.map((res) => res.data);
          newParent.childrenCount = childrenResponses.length;
          console.log("Created children:", childrenResponses);
        } catch (error) {
          console.error("Failed to create children:", error);
          console.error("Error details:", error.response?.data);
          // Parent was created but children failed - still add parent to list
          newParent.children = [];
          newParent.childrenCount = 0;
        }
      }

      setParents((prev) => [...prev, newParent]);
      setNewParentChildren([]); // Reset children for next creation
      console.log("Created parent:", newParent);
    } catch (error) {
      console.error("Failed to create parent:", error);
      // TODO: Show error toast/notification
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (parent: Parent) => {
    setSelectedParent(parent);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (data: any) => {
    if (!selectedParent) return;

    setActionLoading(true);
    try {
      const response = await usersApi.update(selectedParent._id, {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
      });

      const updatedParent: Parent = {
        ...selectedParent,
        ...response.data,
      };

      setParents((prev) =>
        prev.map((p) => (p._id === selectedParent._id ? updatedParent : p))
      );
      console.log("Updated parent:", updatedParent);
    } catch (error) {
      console.error("Failed to update parent:", error);
      // TODO: Show error toast/notification
    } finally {
      setActionLoading(false);
      setEditDialogOpen(false);
      setSelectedParent(null);
    }
  };

  const handleDelete = async (parent: Parent) => {
    if (!confirm(`Are you sure you want to delete ${parent.name}?`)) return;

    setActionLoading(true);
    try {
      await usersApi.delete(parent._id);
      setParents((prev) => prev.filter((p) => p._id !== parent._id));
      console.log("Deleted parent:", parent);
    } catch (error) {
      console.error("Failed to delete parent:", error);
      // TODO: Show error toast/notification
    } finally {
      setActionLoading(false);
    }
  };

  const handleView = (parent: Parent) => {
    setSelectedParent(parent);
    setViewDialogOpen(true);
  };

  const handleManageChildren = (parent: Parent) => {
    setSelectedParent(parent);
    setChildrenDialogOpen(true);
  };

  const handleChildrenUpdate = (updatedChildren: Child[]) => {
    if (!selectedParent) return;

    const updatedParent = {
      ...selectedParent,
      children: updatedChildren,
      childrenCount: updatedChildren.length,
    };

    setParents((prev) =>
      prev.map((p) => (p._id === selectedParent._id ? updatedParent : p))
    );

    // Update selectedParent to reflect changes
    setSelectedParent(updatedParent);
  };

  const handleAddChildToNewParent = (child: Child) => {
    setNewParentChildren((prev) => [...prev, child]);
  };

  const handleRemoveChildFromNewParent = (childId: string) => {
    setNewParentChildren((prev) =>
      prev.filter((child) => child._id !== childId)
    );
  };

  const handleImpersonate = (parent: Parent) => {
    // Generate impersonation token
    console.log("Impersonate parent:", parent);
    // TODO: Implement impersonation
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      render: (value: string) => value || "Not provided",
    },
    {
      key: "childrenCount",
      label: "Children",
      render: (value: number, row: Parent) => (
        <div className="space-y-1">
          <Badge variant="secondary">{value} children</Badge>
          {row.children && row.children.length > 0 && (
            <div className="text-xs text-gray-500">
              {row.children
                .slice(0, 2)
                .map(
                  (child) => `${child.name} (${child.age}y, ${child.gender})`
                )
                .join(", ")}
              {row.children.length > 2 && ` +${row.children.length - 2} more`}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = (parent: Parent) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleView(parent)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleManageChildren(parent)}
        title="Manage Children"
      >
        <Users className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(parent)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(parent)}
        title="Delete"
        className="text-red-600 hover:text-red-700"
        disabled={actionLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parents</h1>
          <p className="text-gray-600">
            Manage parent accounts and their children
          </p>
        </div>
        <CreateDialog
          title="Create New Parent"
          description="Add a new parent to the system"
          triggerText="Add Parent"
          onSubmit={handleCreate}
          loading={actionLoading}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter parent name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
              />
            </div>

            {/* Children Form */}
            <ChildForm
              children={newParentChildren}
              onChildrenChange={setNewParentChildren}
            />
          </div>
        </CreateDialog>
      </div>

      <DataTable
        data={parents}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search parents..."
        onSearch={handleSearch}
        actions={actions}
      />

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Parent"
        description="Update parent information"
        onSubmit={handleUpdate}
        loading={actionLoading}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={selectedParent?.name || ""}
              placeholder="Enter parent name"
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              defaultValue={selectedParent?.email || ""}
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">Phone (Optional)</Label>
            <Input
              id="edit-phone"
              name="phone"
              type="tel"
              defaultValue={selectedParent?.phone || ""}
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </EditDialog>

      {/* View Dialog */}
      <ViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        title="Parent Details"
        description="View parent information"
      >
        {selectedParent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Name
                </Label>
                <p className="text-lg font-semibold">{selectedParent.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Email
                </Label>
                <p className="text-lg">{selectedParent.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Phone
                </Label>
                <p className="text-lg">
                  {selectedParent.phone || "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Children Count
                </Label>
                <p className="text-lg">
                  {selectedParent.childrenCount} children
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Joined
              </Label>
              <p className="text-lg">
                {new Date(selectedParent.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Children Information */}
            {selectedParent.children && selectedParent.children.length > 0 && (
              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-gray-500">
                  Children Details
                </Label>
                <div className="mt-3 space-y-3">
                  {selectedParent.children.map((child) => (
                    <div key={child._id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{child.name}</h4>
                          <p className="text-sm text-gray-600">
                            Age: {child.age} years old • Gender: {child.gender}
                          </p>
                          {child.medicalCondition && (
                            <p className="text-sm text-amber-600">
                              Medical Condition: {child.medicalCondition}
                            </p>
                          )}
                          {child.goals.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Goals:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {child.goals.map((goal, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {goal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ViewDialog>

      {/* Children Management Dialog */}
      <ChildrenDialog
        open={childrenDialogOpen}
        onOpenChange={setChildrenDialogOpen}
        parentId={selectedParent?._id || ""}
        parentName={selectedParent?.name || ""}
        children={selectedParent?.children || []}
        onChildrenUpdate={handleChildrenUpdate}
      />
    </div>
  );
}
