"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { Plus, Edit, Trash2, Eye, UserCheck, DollarSign } from "lucide-react";

interface Coach {
  id: string;
  name: string;
  email: string;
  skills: string[];
  earnings: number;
  sessionsCount: number;
  createdAt: string;
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setCoaches([
        {
          id: "1",
          name: "John Coach",
          email: "coach1@growfitness.lk",
          skills: ["Fitness Training", "Child Development", "Nutrition"],
          earnings: 12000,
          sessionsCount: 12,
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Sarah Coach",
          email: "coach2@growfitness.lk",
          skills: ["Swimming", "Gymnastics", "Team Sports"],
          earnings: 8000,
          sessionsCount: 8,
          createdAt: "2024-01-02T00:00:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch coaches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    console.log("Create coach");
  };

  const handleEdit = (coach: Coach) => {
    console.log("Edit coach:", coach);
  };

  const handleDelete = (coach: Coach) => {
    if (confirm(`Are you sure you want to delete ${coach.name}?`)) {
      console.log("Delete coach:", coach);
    }
  };

  const handleViewSessions = (coach: Coach) => {
    console.log("View sessions for:", coach);
  };

  const handleImpersonate = (coach: Coach) => {
    console.log("Impersonate coach:", coach);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
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
      key: "skills",
      label: "Skills",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "sessionsCount",
      label: "Sessions",
      sortable: true,
      render: (value: number) => (
        <Badge variant="outline">{value} sessions</Badge>
      ),
    },
    {
      key: "earnings",
      label: "Earnings",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-green-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = (coach: Coach) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewSessions(coach)}
        title="View Sessions"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleImpersonate(coach)}
        title="Impersonate"
      >
        <UserCheck className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(coach)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(coach)}
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
          <h1 className="text-2xl font-bold text-gray-900">Coaches</h1>
          <p className="text-gray-600">
            Manage coach accounts and their performance
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coach
        </Button>
      </div>

      <DataTable
        data={coaches}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search coaches..."
        actions={actions}
      />
    </div>
  );
}

