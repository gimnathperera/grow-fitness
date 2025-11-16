"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Cookies from "js-cookie";
import type { Kid } from "@/auth/authSlice";
import { setSelectedKidId, setSelectedKidDetails, selectSelectedKidId } from "@/auth/authSlice";
import { useLazyGetKidQuery } from "@/services/kidsApi";

const SELECTED_KID_COOKIE = "selectedKidId";

interface KidSelectorProps {
  kids: { id: string; name: string }[];
}

export function KidSelector({ kids }: KidSelectorProps) {
  const dispatch = useDispatch();
  const selectedKidId = useSelector(selectSelectedKidId);
  const [selectedId, setSelectedId] = useState(selectedKidId || "");
  const [triggerGetKid, { data: kidResp }] = useLazyGetKidQuery<{ data: Kid }>();

  // Load selected kid from cookies
  useEffect(() => {
    const savedKidId = Cookies.get(SELECTED_KID_COOKIE);
    if (savedKidId) {
      setSelectedId(savedKidId);
      dispatch(setSelectedKidId(savedKidId));
      triggerGetKid(savedKidId).then((res) => {
        if (res.data?.data) dispatch(setSelectedKidDetails(res.data.data));
      });
    }
  }, [dispatch, triggerGetKid]);

  // Auto-select first kid if none is selected
  useEffect(() => {
    if (!selectedId && kids.length > 0) {
      const firstKid = kids[0];
      setSelectedId(firstKid.id);
      dispatch(setSelectedKidId(firstKid.id));
      Cookies.set(SELECTED_KID_COOKIE, firstKid.id, { expires: 30 });

      triggerGetKid(firstKid.id).then((res) => {
        if (res.data?.data) dispatch(setSelectedKidDetails(res.data.data));
      });
    }
  }, [kids, selectedId, dispatch, triggerGetKid]);

  const handleChange = (kidId: string) => {
    setSelectedId(kidId);
    dispatch(setSelectedKidId(kidId));
    Cookies.set(SELECTED_KID_COOKIE, kidId, { expires: 30 });

    triggerGetKid(kidId).then((res) => {
      if (res.data?.data) dispatch(setSelectedKidDetails(res.data.data));
    });
  };

  if (kids.length === 0) {
    return (
      <span className="px-3 py-1 rounded-md bg-gray-50 text-sm font-medium text-gray-400 italic">
        No kids found
      </span>
    );
  }

  if (kids.length === 1) {
    return (
      <span className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700 shadow-sm">
        {kids[0].name}
      </span>
    );
  }

  return (
    <Select value={selectedId} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[160px] text-sm">
        <SelectValue placeholder="Select Kid" />
      </SelectTrigger>
      <SelectContent>
        {kids.map((kid) => (
          <SelectItem key={kid.id} value={kid.id}>
            {kid.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
