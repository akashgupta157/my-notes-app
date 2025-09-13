"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { Note, User } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NoteList from "@/components/NoteList";
import NoteForm from "@/components/NoteForm";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchNotes();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      router.push("/login");
    }
  };
  console.log(user);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      } else {
        setError("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setError("Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteForm(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== id));
      } else {
        setError("Failed to delete note");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError("Failed to delete note");
    }
  };

  const handleNoteFormSubmit = async (title: string, content: string) => {
    try {
      let response;
      if (editingNote) {
        response = await fetch(`/api/notes/${editingNote._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });
      } else {
        response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });
      }

      if (response.ok) {
        setShowNoteForm(false);
        setEditingNote(null);
        fetchNotes();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save note");
      }
    } catch (error) {
      console.error("Failed to save note:", error);
      setError("Failed to save note");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (showNoteForm) {
    return (
      <NoteForm
        note={editingNote}
        onSubmit={handleNoteFormSubmit}
        onCancel={() => {
          setShowNoteForm(false);
          setEditingNote(null);
        }}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <div>
            <h1 className="font-semibold text-xl">SaaS Notes App</h1>
            {user && (
              <p className="text-gray-500 text-sm">
                {user.email} ({user.role}) - {user.tenantId.name} (
                {user.tenantId.plan} plan)
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user?.role === "admin" && (
              <>
                {user.tenantId.plan === "free" && (
                  <Button variant="outline" asChild>
                    <Link href="/upgrade">
                      <Crown className="mr-2 w-4 h-4" /> Upgrade
                    </Link>
                  </Button>
                )}
              </>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {error && (
          <div className="bg-red-100 mb-4 px-4 py-3 border border-red-400 rounded text-red-700">
            {error}
          </div>
        )}

        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          onEdit={handleEditNote}
          onCreate={handleCreateNote}
          isFreePlan={user?.tenantId.plan === "free"}
          noteCount={notes.length}
        />
      </main>
    </div>
  );
}
