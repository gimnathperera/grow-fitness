"use client";

import { useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";

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

interface ChildFormProps {
  children: Child[];
  onChildrenChange: (children: Child[]) => void;
}

export function ChildForm({ children, onChildrenChange }: ChildFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    medicalCondition: "",
    gender: "",
    goals: "",
  });

  const handleAddChild = () => {
    if (!formData.name.trim() || !formData.age || !formData.gender) {
      alert("Please fill in the child's name, age, and gender");
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 0 || age > 18) {
      alert("Please enter a valid age between 0 and 18");
      return;
    }

    const newChild: Child = {
      _id: `temp_${Date.now()}`, // Temporary ID for new children
      name: formData.name.trim(),
      parentId: "", // Will be set when parent is created
      age: age,
      medicalCondition: formData.medicalCondition.trim() || undefined,
      gender: formData.gender,
      goals: formData.goals
        .split(",")
        .map((goal) => goal.trim())
        .filter((goal) => goal.length > 0),
      createdAt: new Date().toISOString(),
    };

    onChildrenChange([...children, newChild]);
    setFormData({
      name: "",
      age: "",
      medicalCondition: "",
      gender: "",
      goals: "",
    });
  };

  const handleRemoveChild = (childId: string) => {
    onChildrenChange(children.filter((child) => child._id !== childId));
  };

  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Add Children (Optional)</h3>

        {/* Children List */}
        {children.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="font-medium">Children to be added:</h4>
            {children.map((child) => (
              <div
                key={child._id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">{child.name}</p>
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
                      <div className="flex flex-wrap gap-1">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveChild(child._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Child Form */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="childName">Child's Name *</Label>
              <Input
                id="childName"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter child's name"
                required
              />
            </div>
            <div>
              <Label htmlFor="childAge">Age *</Label>
              <Input
                id="childAge"
                type="number"
                min="0"
                max="18"
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
                placeholder="Enter child's age"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="childGender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
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
                value={formData.medicalCondition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    medicalCondition: e.target.value,
                  }))
                }
                placeholder="Any medical conditions (optional)"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="childGoals">Goals (comma-separated)</Label>
            <Textarea
              id="childGoals"
              value={formData.goals}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, goals: e.target.value }))
              }
              placeholder="e.g., Improve coordination, Build confidence, Learn swimming"
              rows={2}
            />
          </div>
          <Button
            type="button"
            onClick={handleAddChild}
            disabled={!formData.name || !formData.age || !formData.gender}
            className="mt-3"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </Button>
        </div>
      </div>
    </div>
  );
}
