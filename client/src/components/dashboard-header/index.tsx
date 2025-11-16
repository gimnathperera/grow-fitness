"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetKidsQuery } from "@/services/kidsApi";
import { KidSelector } from "./kid-selector";

type Role = "parent" | "coach" | "admin" | "client" | "team";

export function DashboardHeader() {
  const user = useSelector((state: RootState) => state.auth.user);

  const roleConfig = {
    parent: {
      badge: { bg: "bg-[#FFFD77]", text: "text-[#243E36]", label: "Parent Dashboard" },
      greeting: `Hi ${user?.name ?? "User"} 👋`,
      subtitle: "Track your child's fitness journey",
    },
    coach: {
      badge: { bg: "bg-[#FFFD77]", text: "text-[#243E36]", label: "Coach Dashboard" },
      greeting: `Hi Coach ${user?.name ?? ""} 👋`,
      subtitle: "Ready to inspire young athletes today?",
    },
    admin: {
      badge: { bg: "bg-blue-100", text: "text-blue-800", label: "Admin Dashboard" },
      greeting: `Welcome back, ${user?.name ?? "Admin"} 👋`,
      subtitle: "Manage the platform and monitor activity",
    },
    team: {
      badge: { bg: "bg-green-100", text: "text-green-800", label: "Team Dashboard" },
      greeting: `Hi ${user?.name ?? "Team Member"} 👋`,
      subtitle: "Collaborate and manage your tasks",
    },
    client: {
      badge: { bg: "bg-purple-100", text: "text-purple-800", label: "Client Dashboard" },
      greeting: `Hi ${user?.name ?? "Client"} 👋`,
      subtitle: "Access your services and track updates",
    },
  };

  const config = user ? roleConfig[user.role as Role] : null;

  // Fetch kids
  let kidsQueryArg: any = undefined;
  if (user?.role === "client") kidsQueryArg = {};
  else if (user?.role === "parent") kidsQueryArg = { parentId: user?.id };

  const { data: kidsListResp } = useGetKidsQuery(kidsQueryArg, {
    skip: !user?.role || (user.role !== "client" && user.role !== "parent"),
  });

  const apiKids =
    (kidsListResp as unknown as any[])?.map((k: any) => ({
      id: String(k._id || k.id),
      name: k.name,
    })) || [];

  const userKids = (user as any)?.kids;
  const kidsForUi =
    userKids && userKids.length > 0
      ? userKids.map((k: any) => ({ id: String(k.id), name: k.name }))
      : apiKids;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            {config?.greeting}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">{config?.subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 text-center sm:text-left">
          <h4 className="text-sm font-bold text-gray-700">Kid's Name:</h4>
          {(user.role === "client" || user.role === "parent") && <KidSelector kids={kidsForUi} />}
        </div>
      </div>
    </div>
  );
}
