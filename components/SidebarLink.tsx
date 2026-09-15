"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type SidebarLinkProps = {
  href: string;
  children: ReactNode;
};

export default function SidebarLink({
  href,
  children,
}: SidebarLinkProps) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        active
          ? "bg-slate-700 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
