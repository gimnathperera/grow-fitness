"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Users } from "lucide-react";

interface QuizDefinition {
  id: string;
  title: string;
  type: string;
  questions: number;
  isActive: boolean;
  createdAt: string;
}

interface QuizSubmission {
  id: string;
  ownerType: string;
  ownerName: string;
  quizType: string;
  score: number;
  submittedAt: string;
}

export default function QuizzesPage() {
  const [definitions, setDefinitions] = useState<QuizDefinition[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"definitions" | "submissions">(
    "definitions"
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      setDefinitions([
        {
          id: "1",
          title: "Child Development Assessment",
          type: "development",
          questions: 15,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          title: "Fitness Knowledge Quiz",
          type: "fitness",
          questions: 20,
          isActive: true,
          createdAt: "2024-01-02T00:00:00Z",
        },
        {
          id: "3",
          title: "Nutrition Awareness Test",
          type: "nutrition",
          questions: 12,
          isActive: false,
          createdAt: "2024-01-03T00:00:00Z",
        },
      ]);

      setSubmissions([
        {
          id: "1",
          ownerType: "Parent",
          ownerName: "Alice Parent",
          quizType: "Child Development Assessment",
          score: 85,
          submittedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          ownerType: "Coach",
          ownerName: "John Coach",
          quizType: "Fitness Knowledge Quiz",
          score: 92,
          submittedAt: "2024-01-14T14:20:00Z",
        },
        {
          id: "3",
          ownerType: "Parent",
          ownerName: "Bob Parent",
          quizType: "Nutrition Awareness Test",
          score: 78,
          submittedAt: "2024-01-13T16:45:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefinition = () => {
    console.log("Create quiz definition");
  };

  const handleEditDefinition = (definition: QuizDefinition) => {
    console.log("Edit quiz definition:", definition);
  };

  const handleDeleteDefinition = (definition: QuizDefinition) => {
    if (confirm(`Are you sure you want to delete ${definition.title}?`)) {
      console.log("Delete quiz definition:", definition);
    }
  };

  const handleViewSubmissions = (definition: QuizDefinition) => {
    console.log("View submissions for:", definition);
  };

  const getScoreBadge = (score: number) => {
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "outline";
    if (score >= 90) variant = "default";
    else if (score >= 70) variant = "secondary";
    else variant = "destructive";

    return <Badge variant={variant}>{score}%</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const definitionColumns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "questions",
      label: "Questions",
      sortable: true,
      render: (value: number) => `${value} questions`,
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const submissionColumns = [
    {
      key: "ownerType",
      label: "Owner Type",
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "ownerName",
      label: "Owner",
      sortable: true,
    },
    {
      key: "quizType",
      label: "Quiz",
      sortable: true,
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      render: (value: number) => getScoreBadge(value),
    },
    {
      key: "submittedAt",
      label: "Submitted",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  const definitionActions = (definition: QuizDefinition) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewSubmissions(definition)}
        title="View Submissions"
      >
        <Users className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditDefinition(definition)}
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteDefinition(definition)}
        title="Delete"
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const submissionActions = (submission: QuizSubmission) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => console.log("View submission:", submission)}
      title="View Details"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600">
            Manage quiz definitions and view submissions
          </p>
        </div>
        <Button onClick={handleCreateDefinition}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      <Tabs
        value={view}
        onValueChange={(value) =>
          setView(value as "definitions" | "submissions")
        }
      >
        <TabsList>
          <TabsTrigger value="definitions">Quiz Definitions</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="space-y-4">
          <DataTable
            data={definitions}
            columns={definitionColumns}
            loading={loading}
            searchable
            searchPlaceholder="Search quiz definitions..."
            actions={definitionActions}
          />
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <DataTable
            data={submissions}
            columns={submissionColumns}
            loading={loading}
            searchable
            searchPlaceholder="Search submissions..."
            actions={submissionActions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

