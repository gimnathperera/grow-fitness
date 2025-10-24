"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { Plus, Edit, Trash2, Eye, Award } from "lucide-react";

interface Child {
  id: string;
  name: string;
  parent: string;
  birthDate: string;
  goals: string[];
  createdAt: string;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setChildren([
        {
          id: "1",
          name: "Emma Child",
          parent: "Alice Parent",
          birthDate: "2018-05-15",
          goals: ["Improve coordination", "Build confidence", "Learn swimming"],
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Liam Child",
          parent: "Alice Parent",
          birthDate: "2020-03-22",
          goals: ["Basic motor skills", "Social interaction"],
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "3",
          name: "Sophia Child",
          parent: "Bob Parent",
          birthDate: "2019-08-10",
          goals: ["Fitness foundation", "Team sports"],
          createdAt: "2024-01-02T00:00:00Z",
        },
        {
          id: "4",
          name: "Noah Child",
          parent: "Bob Parent",
          birthDate: "2021-12-05",
          goals: ["Early development", "Play skills"],
          createdAt: "2024-01-02T00:00:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    console.log("Create child");
  };

  const handleEdit = (child: Child) => {
    console.log("Edit child:", child);
  };

  const handleDelete = (child: Child) => {
    if (confirm(`Are you sure you want to delete ${child.name}?`)) {
      console.log("Delete child:", child);
    }
  };

  const handleViewSessions = (child: Child) => {
    console.log("View sessions for:", child);
  };

  const handleViewMilestones = (child: Child) => {
    console.log("View milestones for:", child);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "parent",
      label: "Parent",
      sortable: true,
    },
    {
      key: "birthDate",
      label: "Age",
      sortable: true,
      render: (value: string) => `${calculateAge(value)} years old`,
    },
    {
      key: "goals",
      label: "Goals",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((goal, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {goal}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2} more
            </Badge>
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

  const actions = (child: Child) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewSessions(child)}
        title="View Sessions"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewMilestones(child)}
        title="View Milestones"
      >
        <Award className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(child)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(child)}
        title="Delete"
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Children</h1>
          <p className="text-gray-600">
            Manage children and their fitness goals
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Child
        </Button>
      </div>

      <DataTable
        data={children}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search children..."
        actions={actions}
      />
    </div>
  );
}

