import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function genererSignature(
  userId: number,
  action: string,
  description: string,
  details: string,
  createdAt: Date
) {
  const contenu = [
    userId,
    action,
    description,
    details,
    createdAt.toISOString(),
  ].join("|");

  return crypto
    .createHash("sha256")
    .update(contenu)
    .digest("hex");
}

export async function enregistrerAudit(
  userId: number,
  action: string,
  description: string,
  details: string = ""
) {
  const createdAt = new Date();

  const signature = genererSignature(
    userId,
    action,
    description,
    details,
    createdAt
  );

  return prisma.auditLog.create({
    data: {
      userId,
      action,
      description,
      details,
      signature,
      createdAt,
    },
  });
}
