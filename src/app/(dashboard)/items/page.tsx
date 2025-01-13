import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Item List",
  description: "View and manage items.",
};

export default function ItemsPage() {
  redirect("/items/products");
}
