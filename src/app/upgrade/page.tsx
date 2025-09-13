"use client";

import { User } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UpgradePlan from "@/components/UpgradePlan";

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null);
  const [noteCount, setNoteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userResponse, notesResponse] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/notes"),
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);

        if (userData.user.role !== "admin") {
          router.push("/");
          return;
        }
      } else {
        router.push("/login");
        return;
      }

      if (notesResponse.ok) {
        const notesData = await notesResponse.json();
        setNoteCount(notesData.length);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/tenants/${user.tenantId.slug}/upgrade`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const userResponse = await fetch("/api/auth/me");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        }
        alert("Tenant upgraded to Pro plan successfully!");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to upgrade tenant");
      }
    } catch (error) {
      console.error("Failed to upgrade tenant:", error);
      setError("Failed to upgrade tenant");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="flex items-center mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <h1 className="font-semibold text-xl">Subscription Management</h1>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {error && (
          <div className="bg-red-100 mb-4 px-4 py-3 border border-red-400 rounded text-red-700">
            {error}
          </div>
        )}

        <UpgradePlan
          currentPlan={user.tenantId.plan as "free" | "pro"}
          noteCount={noteCount}
          maxFreeNotes={3}
          tenantSlug={user.tenantId.slug}
          onUpgrade={handleUpgrade}
        />
      </main>
    </div>
  );
}
