"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  category: string;
  tags: string[];
  contentRef: string;
  createdAt: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setResources([
        {
          id: "1",
          title: "Child Nutrition Guide",
          category: "Nutrition",
          tags: ["nutrition", "health", "children"],
          contentRef: "nutrition-guide.pdf",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          title: "Basic Exercise Routines",
          category: "Fitness",
          tags: ["exercise", "fitness", "routine"],
          contentRef: "exercise-routines.pdf",
          createdAt: "2024-01-02T00:00:00Z",
        },
        {
          id: "3",
          title: "Swimming Safety Tips",
          category: "Safety",
          tags: ["swimming", "safety", "water"],
          contentRef: "swimming-safety.pdf",
          createdAt: "2024-01-03T00:00:00Z",
        },
        {
          id: "4",
          title: "Parenting Fitness Tips",
          category: "Parenting",
          tags: ["parenting", "fitness", "tips"],
          contentRef: "parenting-tips.pdf",
          createdAt: "2024-01-04T00:00:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    console.log("Create resource");
  };

  const handleEdit = (resource: Resource) => {
    console.log("Edit resource:", resource);
  };

  const handleDelete = (resource: Resource) => {
    if (confirm(`Are you sure you want to delete ${resource.title}?`)) {
      console.log("Delete resource:", resource);
    }
  };

  const handleView = (resource: Resource) => {
    console.log("View resource:", resource);
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      Nutrition: "default",
      Fitness: "secondary",
      Safety: "destructive",
      Parenting: "outline",
    } as const;

    return (
      <Badge variant={variants[category as keyof typeof variants] || "outline"}>
        {category}
      </Badge>
    );
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      render: (value: string) => getCategoryBadge(value),
    },
    {
      key: "tags",
      label: "Tags",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
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
      key: "contentRef",
      label: "File",
      render: (value: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = (resource: Resource) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleView(resource)}
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(resource)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(resource)}
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
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600">
            Manage parenting and fitness resources
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <DataTable
        data={resources}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search resources..."
        actions={actions}
      />
    </div>
  );
}

