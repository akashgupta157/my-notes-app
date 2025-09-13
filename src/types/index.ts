export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: {
    email: string;
  };
}

export interface NoteFormProps {
  note?: Note | null;
  onSubmit: (title: string, content: string) => void;
  onCancel: () => void;
}

export interface User {
  id: string;
  email: string;
  role: string;
  tenantId: {
    _id: string;
    name: string;
    slug: string;
    plan: string;
  };
}
export interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onCreate: () => void;
  isFreePlan: boolean;
  noteCount: number;
}

export interface UpgradePlanProps {
  currentPlan: "free" | "pro";
  noteCount: number;
  maxFreeNotes: number;
  tenantSlug: string;
  onUpgrade: () => Promise<void>;
}
