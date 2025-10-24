"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit } from "lucide-react";
import { childrenApi } from "@/lib/api";

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

interface ChildrenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string;
  parentName: string;
  children: Child[];
  onChildrenUpdate: (children: Child[]) => void;
}

export function ChildrenDialog({
  open,
  onOpenChange,
  parentId,
  parentName,
  children,
  onChildrenUpdate,
}: ChildrenDialogProps) {
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [childForm, setChildForm] = useState({
    name: "",
    age: "",
    medicalCondition: "",
    gender: "",
    goals: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingChild) {
      setChildForm({
        name: editingChild.name,
        age: editingChild.age.toString(),
        medicalCondition: editingChild.medicalCondition || "",
        gender: editingChild.gender,
        goals: editingChild.goals.join(", "),
      });
    } else {
      setChildForm({
        name: "",
        age: "",
        medicalCondition: "",
        gender: "",
        goals: "",
      });
    }
  }, [editingChild]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!childForm.name.trim()) {
      alert("Please enter the child's name");
      return;
    }

    if (!childForm.age || !childForm.gender) {
      alert("Please enter the child's age and select gender");
      return;
    }

    const age = parseInt(childForm.age);
    if (isNaN(age) || age < 0 || age > 18) {
      alert("Please enter a valid age between 0 and 18");
      return;
    }

    setLoading(true);

    try {
      const childData = {
        name: childForm.name.trim(),
        parentId: parentId,
        age: age,
        medicalCondition: childForm.medicalCondition.trim() || undefined,
        gender: childForm.gender,
        goals: childForm.goals
          .split(",")
          .map((goal) => goal.trim())
          .filter((goal) => goal.length > 0),
      };

      let updatedChild: Child;
      if (editingChild) {
        // Update existing child
        const response = await childrenApi.update(editingChild._id, childData);
        updatedChild = response.data;
        const updatedChildren = children.map((child) =>
          child._id === editingChild._id ? updatedChild : child
        );
        onChildrenUpdate(updatedChildren);
      } else {
        // Create new child
        const response = await childrenApi.create(childData);
        updatedChild = response.data;
        onChildrenUpdate([...children, updatedChild]);
      }

      setEditingChild(null);
      setChildForm({
        name: "",
        age: "",
        medicalCondition: "",
        gender: "",
        goals: "",
      });
    } catch (error) {
      console.error("Failed to save child:", error);
      // TODO: Show error notification
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (childId: string) => {
    if (!confirm("Are you sure you want to delete this child?")) return;

    setLoading(true);
    try {
      await childrenApi.delete(childId);
      const updatedChildren = children.filter((child) => child._id !== childId);
      onChildrenUpdate(updatedChildren);
    } catch (error) {
      console.error("Failed to delete child:", error);
      // TODO: Show error notification
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
  };

  const handleCancel = () => {
    setEditingChild(null);
    setChildForm({
      name: "",
      age: "",
      medicalCondition: "",
      gender: "",
      goals: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Children for {parentName}</DialogTitle>
          <DialogDescription>
            Add, edit, or remove children for this parent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Children List */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Children ({children.length})
            </h3>
            {children.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No children added yet
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {children.map((child) => (
                  <div key={child._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
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
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(child)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(child._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">
              {editingChild ? "Edit Child" : "Add New Child"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="childName">Child's Name</Label>
                <Input
                  id="childName"
                  value={childForm.name}
                  onChange={(e) =>
                    setChildForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter child's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="childAge">Age</Label>
                <Input
                  id="childAge"
                  type="number"
                  min="0"
                  max="18"
                  value={childForm.age}
                  onChange={(e) =>
                    setChildForm((prev) => ({
                      ...prev,
                      age: e.target.value,
                    }))
                  }
                  placeholder="Enter child's age"
                  required
                />
              </div>
              <div>
                <Label htmlFor="childGender">Gender</Label>
                <Select
                  value={childForm.gender}
                  onValueChange={(value) =>
                    setChildForm((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="childMedicalCondition">Medical Condition</Label>
                <Input
                  id="childMedicalCondition"
                  value={childForm.medicalCondition}
                  onChange={(e) =>
                    setChildForm((prev) => ({
                      ...prev,
                      medicalCondition: e.target.value,
                    }))
                  }
                  placeholder="Any medical conditions (optional)"
                />
              </div>
              <div>
                <Label htmlFor="childGoals">Goals (comma-separated)</Label>
                <Textarea
                  id="childGoals"
                  value={childForm.goals}
                  onChange={(e) =>
                    setChildForm((prev) => ({ ...prev, goals: e.target.value }))
                  }
                  placeholder="e.g., Improve coordination, Build confidence, Learn swimming"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingChild
                    ? "Update Child"
                    : "Add Child"}
                </Button>
                {editingChild && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
