import Link from "next/link";

import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <span className="text-xl font-bold italic tracking-tight">ristretto</span>
    </Link>
  );
}
