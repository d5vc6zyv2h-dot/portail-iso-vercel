"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type UserActionsProps = {
  userId: number;
};

export default function UserActions({ userId }: UserActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || "Impossible de supprimer l'utilisateur.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/utilisateurs/${userId}`}
        className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
      >
        Consulter
      </Link>

      <Link
        href={`/utilisateurs/${userId}/modifier`}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Modifier
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Supprimer
      </button>
    </div>
  );
}
