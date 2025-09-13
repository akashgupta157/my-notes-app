import mongoose, { Document, Schema } from "mongoose";

export interface ITenant extends Document {
  name: string;
  slug: string;
  plan: "free" | "pro";
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Tenant ||
  mongoose.model<ITenant>("Tenant", TenantSchema);
