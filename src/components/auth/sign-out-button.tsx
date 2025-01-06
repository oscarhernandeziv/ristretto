"use client";

import { authSignOut } from "@/app/(server)/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button variant="outline" onClick={authSignOut}>
      Sign out
    </Button>
  );
}
