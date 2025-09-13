"use client";

import { NoteListProps } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NoteList({
  notes,
  onDelete,
  onEdit,
  onCreate,
  isFreePlan,
  noteCount,
}: NoteListProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Notes</h2>
        <Button onClick={onCreate} disabled={isFreePlan && noteCount >= 3}>
          <Plus className="mr-2 w-4 h-4" /> Add Note
        </Button>
      </div>

      {isFreePlan && noteCount >= 3 && (
        <div className="bg-yellow-100 px-4 py-3 border border-yellow-400 rounded text-yellow-700">
          You have reached the limit of 3 notes on the Free plan. Upgrade to Pro
          to add more notes.
        </div>
      )}

      {notes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No notes yet. Create your first note!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="gap-4 grid">
          {notes.map((note) => (
            <Card key={note._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{note.title}</CardTitle>
                    <CardDescription>
                      Created by {note.createdBy.email} on{" "}
                      {isClient
                        ? new Date(note.createdAt).toLocaleDateString()
                        : ""}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(note)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(note._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
