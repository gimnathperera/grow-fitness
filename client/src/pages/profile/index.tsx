"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ProfilePage from "./components/profile-page";

import { useGetMyClientProfileQuery } from "@/services/clientsApi";
import { useGetMyCoachProfileQuery } from "@/services/coachesApi";

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  profilePic?: string;
  role: "client" | "coach";
  kids?: {
    id: string;
    name: string;
    age: number;
    sessionType: string;
    gender: "boy" | "girl" | undefined; 
    location: string;
    paymentStatus: "paid" | "unpaid";
  }[];
  timeSlots?: {
    id: string;
    day: string;
    time: string;
    available: boolean;
  }[];
  invoices?: {
    id: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    kidName?: string;
  }[];
}

const mapClientProfileToProfileUser = (client: any): ProfileUser => ({
  id: client?.userId?._id || client?._id || "",
  name: client?.userId?.name || "N/A",
  email: client?.userId?.email || "N/A",
  phone: client?.userId?.phone || "N/A",
  location: client?.userId?.location || "N/A",
  profilePic: client?.userId?.profilePic || "",
  role: "client",
  kids: client?.kids?.map((k: any) => ({
    id: k?._id || k?.id || "",
    name: k?.name || "N/A",
    age: k?.age ?? 0,
    sessionType: k?.sessionType || "N/A",
    gender: k?.gender || "N/A",
    location: k?.location || "N/A",
    paymentStatus: k?.paymentStatus || "unpaid",
  })) || [],
  invoices: client?.invoices?.map((i: any) => ({
    id: i?._id || i?.id || "",
    date: i?.date || "N/A",
    amount: i?.amount ?? 0,
    status: i?.status || "pending",
    kidName: i?.kidName || "",
  })) || [],
});

const mapCoachProfileToProfileUser = (coach: any): ProfileUser => ({
  id: coach?._id || coach?.id || "",
  name: coach?.name || "N/A",
  email: coach?.email || "N/A",
  phone: coach?.phone || "N/A",
  location: coach?.location || "N/A",
  profilePic: coach?.profilePic || "",
  role: "coach",
  timeSlots: coach?.timeSlots?.map((t: any) => ({
    id: t?._id || t?.id || "",
    day: t?.day || "N/A",
    time: t?.time || "N/A",
    available: t?.available ?? false,
  })) || [],
  invoices: coach?.invoices?.map((i: any) => ({
    id: i?._id || i?.id || "",
    date: i?.date || "N/A",
    amount: i?.amount ?? 0,
    status: i?.status || "pending",
  })) || [],
});

const Index = () => {
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const role = loggedUser?.role;

  const { data: clientData, isLoading: isClientLoading } = useGetMyClientProfileQuery(undefined, {
    skip: role !== "client",
  });
  const { data: coachData, isLoading: isCoachLoading } = useGetMyCoachProfileQuery(undefined, {
    skip: role !== "coach",
  });

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No user logged in.</p>
      </div>
    );
  }

  if (isClientLoading || isCoachLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const user: ProfileUser =
    role === "client"
      ? mapClientProfileToProfileUser(clientData?.data || {})
      : mapCoachProfileToProfileUser(coachData?.data || {});

  return (
    <div className="min-h-screen">
      <div>Hiiiii</div>
      <ProfilePage user={user} />
    </div>
  );
};

export default Index;
