import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Make",
  description: "Plan and track production.",
};

export default function MakePage() {
  redirect("/make/operator-panel");
}
