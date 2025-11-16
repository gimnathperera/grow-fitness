"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KidPayments } from "./kid-payments";
import { useGetKidsQuery, useUpdateKidMutation, useDeleteKidMutation } from "@/services/kidsApi";
import { useAppSelector } from "@/hooks/store";
import { selectCurrentUser } from "@/auth/authSlice";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface FormKid {
  _id: string;
  name: string;
  parentId: string;
  birthDate?: string;
  gender: "girl" | "boy"; 
  location: string;
  goals?: string[];
  medicalCondition?: string;
  isInSports?: boolean;
  trainingPreference?: "personal" | "group"; 
  createdAt?: string;
  updatedAt?: string;
}

export const KidsSection: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const [updateKid] = useUpdateKidMutation();
  const [deleteKid] = useDeleteKidMutation();

  console.log("Current User:", user);

  const { data: kidsData, isLoading, error } = useGetKidsQuery(
    user?.role === "parent" && user?.id ? { parentId: user.id } : {},
    { skip: !user?.role || (user.role !== "parent" && user.role !== "client") }
  );

  console.log("Kids API Response:", kidsData);

  const [localKids, setLocalKids] = useState<FormKid[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [kidToDelete, setKidToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (kidsData && Array.isArray(kidsData)) {
      console.log("Mapping kids data to local state...");
      setLocalKids(
        kidsData.map((kid: any) => ({
          _id: kid._id,
          name: kid.name || "",
          parentId: kid.parentId || user?.id || "",
          birthDate: kid.birthDate || "",
          gender: kid.gender || "",
          location: kid.location || "",
          goals: kid.goals || [],
          medicalCondition: kid.medicalCondition || "",
          isInSports: kid.isInSports || false,
          trainingPreference: kid.trainingPreference || "",
          createdAt: kid.createdAt,
          updatedAt: kid.updatedAt,
        }))
      );
    }
  }, [kidsData, user?.id]);

  const handleKidChange = (kidId: string, field: keyof FormKid, value: any) => {
    console.log(`Updating kid ${kidId} field ${field} with value:`, value);
    setLocalKids((prevKids) =>
      prevKids.map((kid) => (kid._id === kidId ? { ...kid, [field]: value } : kid))
    );
  };

  const handleSaveKid = async (kid: FormKid) => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const payload = {
        name: kid.name,
        birthDate: kid.birthDate,
        gender: kid.gender,
        location: kid.location,
        goals: kid.goals,
        medicalCondition: kid.medicalCondition,
        isInSports: kid.isInSports,
        trainingPreference: kid.trainingPreference,
      };

      await updateKid({ id: kid._id, payload }).unwrap();
      toast.success("Kid's information updated successfully");
    } catch (error) {
      console.error("Failed to update kid:", error);
      toast.error("Failed to update kid's information");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (kidId: string) => {
    setKidToDelete(kidId);
  };

  const confirmDeleteKid = async () => {
    if (!kidToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteKid(kidToDelete).unwrap();
      setLocalKids(prevKids => prevKids.filter(kid => kid._id !== kidToDelete));
      toast.success("Child's profile deleted successfully");
    } catch (error) {
      console.error("Failed to delete child:", error);
      toast.error("Failed to delete child's profile");
    } finally {
      setIsDeleting(false);
      setKidToDelete(null);
    }
  };

  if (isLoading) {
    console.log("Kids data loading...");
    return <p className="text-gray-500">Loading kids data...</p>;
  }
  if (error) {
    console.error("Error loading kids:", error);
    return <p className="text-red-500">Error loading kids data.</p>;
  }
  if (!localKids || localKids.length === 0) {
    console.log("No kids data available.");
    return <p className="text-gray-500">No kids data available.</p>;
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle>My Kids</CardTitle>
        <CardDescription>Manage your kids’ information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {localKids.map((kid) => {
          console.log("Rendering kid:", kid);
          return (
            <Card key={kid._id} className="p-4 border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={kid.name}
                    onChange={(e) => handleKidChange(kid._id, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input
                    value={kid.gender || ""}
                    onChange={(e) => handleKidChange(kid._id, "gender", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={
                      kid.birthDate
                        ? Math.floor(
                            (new Date().getTime() - new Date(kid.birthDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 365.25)
                          )
                        : ""
                    }
                    onChange={(e) =>
                      handleKidChange(
                        kid._id,
                        "birthDate",
                        e.target.value
                          ? new Date(
                              new Date().getFullYear() - Number(e.target.value),
                              new Date().getMonth(),
                              new Date().getDate()
                            ).toISOString()
                          : ""
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={kid.location || ""}
                    onChange={(e) => handleKidChange(kid._id, "location", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(kid._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Profile"}
                </Button>
                <Button
                  onClick={() =>
                    handleSaveKid({
                      ...kid,
                      name: kid.name.trim(),
                      location: kid.location.trim(),
                    })
                  }
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              <KidPayments kidId={kid._id} />
            </Card>
          );
        })}
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!kidToDelete} onOpenChange={(open: any) => !open && setKidToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this child's profile and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteKid}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
