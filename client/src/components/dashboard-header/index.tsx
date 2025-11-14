"use client";

import { useState, useEffect, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setSelectedKidId } from "@/auth/authSlice";
import { useLazyGetKidQuery, useGetKidsQuery } from "@/services/kidsApi";

export function DashboardHeader() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  console.log("USER:", user);
  console.log("Detected User Role:", user?.role);

  const roleConfig = {
    parent: {
      badge: {
        bg: "bg-[#FFFD77]",
        text: "text-[#243E36]",
        label: "Parent Dashboard",
      },
      greeting: `Hi ${user?.name ?? "User"} 👋`,
      subtitle: "Track your child's fitness journey",
    },
    coach: {
      badge: {
        bg: "bg-[#FFFD77]",
        text: "text-[#243E36]",
        label: "Coach Dashboard",
      },
      greeting: `Hi Coach ${user?.name ?? ""} 👋`,
      subtitle: "Ready to inspire young athletes today?",
    },
    admin: {
      badge: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Admin Dashboard",
      },
      greeting: `Welcome back, ${user?.name ?? "Admin"} 👋`,
      subtitle: "Manage the platform and monitor activity",
    },
    team: {
      badge: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Team Dashboard",
      },
      greeting: `Hi ${user?.name ?? "Team Member"} 👋`,
      subtitle: "Collaborate and manage your tasks",
    },
    client: {
      badge: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Client Dashboard",
      },
      greeting: `Hi ${user?.name ?? "Client"} 👋`,
      subtitle: "Access your services and track updates",
    },
  };

  const config = user ? roleConfig[user.role] : null;

  const [selectedKid, setSelectedKid] = useState("");

  const [triggerGetKid, { data: kidResp, isFetching: isKidLoading }] =
    useLazyGetKidQuery();

  // --------------------------
  //    FETCH KIDS (FIXED)
  // --------------------------
  let kidsQueryArg: any = undefined;

  if (user?.role === "client") kidsQueryArg = {};
  else if (user?.role === "parent") kidsQueryArg = { parentId: user?.id };

  console.log("useGetKidsQuery Params:", kidsQueryArg);

  const {
    data: kidsListResp,
    isFetching: kidsLoading,
    error: kidsError,
  } = useGetKidsQuery(kidsQueryArg, {
    skip: !user?.role || (user.role !== "client" && user.role !== "parent"),
  });

  console.log("kidsListResp (API):", kidsListResp);
  console.log("kidsLoading:", kidsLoading);
  console.log("kidsError:", kidsError);

  // userKids from auth store if available
  const userKids = (user as any)?.kids;
  console.log("userKids from user object:", userKids);

  // FIXED: API returns array directly
  const apiKids =
    (kidsListResp as unknown as any[])?.map((k: any) => ({
      id: String(k._id || k.id),
      name: k.name,
    })) || [];

  console.log("apiKids from API:", apiKids);

  const kidsForUi =
    userKids && userKids.length > 0
      ? userKids.map((k: any) => ({
          id: String(k.id),
          name: k.name,
        }))
      : apiKids;

  console.log("Final kidsForUi used in UI:", kidsForUi);

  // ------------------------------------------------
  //       AUTO SELECT FIRST KID (FIXED)
  // ------------------------------------------------
  useEffect(() => {
    console.log("Running AUTO SELECT KID useEffect...");
    console.log("user.role:", user?.role);

    const sourceKids =
      kidsForUi && kidsForUi.length > 0 ? kidsForUi : apiKids;

    console.log("Available kids:", sourceKids);

    if (
      (user?.role === "client" || user?.role === "parent") &&
      sourceKids.length > 0
    ) {
      const firstKidId = String(sourceKids[0].id);
      console.log("Setting FIRST selectedKid to:", firstKidId);

      setSelectedKid(firstKidId);
      dispatch(setSelectedKidId(firstKidId));
    }
  }, [user, kidsListResp, dispatch]);

  // ------------------------------------------------
  //      FETCH SELECTED KID DETAILS
  // ------------------------------------------------
  useEffect(() => {
    if (user?.role === "client" || user?.role === "parent") {
      if (selectedKid) {
        console.log("Fetching kid details for:", selectedKid);
        dispatch(setSelectedKidId(selectedKid));
        triggerGetKid(selectedKid);
      }
    }
  }, [user?.role, selectedKid, triggerGetKid, dispatch]);

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

          {(user.role === "client" || user.role === "parent") &&
            selectedKid && (
              <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                {isKidLoading
                  ? "Loading kid details..."
                  : kidResp?.data?.name
                  ? `Selected: ${kidResp.data.name}`
                  : (() => {
                      const fallback =
                        kidsForUi.find((k: { id: string; }) => k.id === selectedKid) ||
                        apiKids.find((k) => k.id === selectedKid);
                      return fallback ? `Selected: ${fallback.name}` : null;
                    })()}
              </p>
            )}
        </div>

        {(user.role === "client" || user.role === "parent") && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-gray-700">Kid's Name:</h4>

            {kidsForUi && kidsForUi.length > 0 ? (
              kidsForUi.length === 1 ? (
                <span className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700 shadow-sm">
                  {kidsForUi[0].name}
                </span>
              ) : (
                <Select
                  value={selectedKid}
                  onValueChange={(val) => {
                    console.log("Manual select kid:", val);
                    setSelectedKid(val);
                    dispatch(setSelectedKidId(val));
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[160px] text-sm">
                    <SelectValue placeholder="Select Kid" />
                  </SelectTrigger>
                  <SelectContent>
                    {kidsForUi.map((kid: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                      <SelectItem key={kid.id} value={String(kid.id)}>
                        {kid.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            ) : (
              <span className="px-3 py-1 rounded-md bg-gray-50 text-sm font-medium text-gray-400 italic">
                No kids found
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
