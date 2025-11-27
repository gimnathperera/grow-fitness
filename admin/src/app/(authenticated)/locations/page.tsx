"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Location {
  id: string;
  label: string;
  createdAt: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setLocations([
        {
          id: "1",
          label: "Main Gym - Colombo",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          label: "Swimming Pool - Kandy",
          createdAt: "2024-01-02T00:00:00Z",
        },
        {
          id: "3",
          label: "Outdoor Playground - Galle",
          createdAt: "2024-01-03T00:00:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    console.log("Create location");
  };

  const handleEdit = (location: Location) => {
    console.log("Edit location:", location);
  };

  const handleDelete = (location: Location) => {
    if (confirm(`Are you sure you want to delete ${location.label}?`)) {
      console.log("Delete location:", location);
    }
  };

  const columns = [
    {
      key: "label",
      label: "Location Name",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = (location: Location) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(location)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(location)}
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
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage session locations</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <DataTable
        data={locations}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Search locations..."
        actions={actions}
      />
    </div>
  );
}

